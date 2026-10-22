"use client"

import { type ReactNode, useMemo, useState } from "react"
import { AlertTriangle, Trash2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { InventoryMaterial } from "../../types/inventory"
import type { DisposeExpiredBatchInput } from "../../services/inventory.service"

interface DisposeExpiredStockDialogProps {
  material: InventoryMaterial
  trigger?: ReactNode
  onDispose: (input: DisposeExpiredBatchInput) => Promise<unknown>
}

export function DisposeExpiredStockDialog({
  material,
  trigger,
  onDispose,
}: DisposeExpiredStockDialogProps) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [submittingBatchId, setSubmittingBatchId] = useState<string | null>(
    null
  )

  const expiredBatches = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return material.expiration_batches.filter((batch) => {
      if (batch.quantity_remaining <= 0) {
        return false
      }

      const expirationDate = new Date(`${batch.expiration_date}T00:00:00`)

      return expirationDate < today
    })
  }, [material.expiration_batches])

  const totalExpiredQuantity = expiredBatches.reduce(
    (total, batch) => total + batch.quantity_remaining,
    0
  )

  async function handleDispose(batchId: string) {
    try {
      setSubmittingBatchId(batchId)

      await onDispose({
        batchId,
        notes: notes.trim() || undefined,
      })

      setNotes("")
      setOpen(false)
    } catch (error) {
      console.error("Failed to dispose expired batch:", error)
    } finally {
      setSubmittingBatchId(null)
    }
  }

  if (expiredBatches.length === 0) {
    return null
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (submittingBatchId) {
          return
        }

        setOpen(nextOpen)

        if (!nextOpen) {
          setNotes("")
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            title="Dispose expired stock"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Dispose expired stock</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Dispose Expired Stock</DialogTitle>

          <DialogDescription>
            Review the expired batches for {material.material_name}. Disposing a
            batch permanently removes its remaining quantity from available
            inventory.
          </DialogDescription>
        </DialogHeader>

        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />

          <AlertTitle>Expired inventory detected</AlertTitle>

          <AlertDescription>
            {totalExpiredQuantity} {material.unit}
            {totalExpiredQuantity === 1 ? "" : "s"} are currently expired. Only
            expired batches can be disposed using this action.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {expiredBatches.map((batch) => {
            const isSubmitting = submittingBatchId === batch.id

            return (
              <div key={batch.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {batch.batch_number || "Unnumbered Batch"}
                      </span>

                      <Badge variant="destructive">Expired</Badge>
                    </div>

                    <div className="grid gap-1 text-sm text-muted-foreground">
                      <span>
                        Remaining:{" "}
                        <strong className="text-foreground">
                          {batch.quantity_remaining} {material.unit}
                        </strong>
                      </span>

                      <span>
                        Received:{" "}
                        {new Date(
                          `${batch.received_at}T00:00:00`
                        ).toLocaleDateString()}
                      </span>

                      <span>
                        Expired:{" "}
                        {new Date(
                          `${batch.expiration_date}T00:00:00`
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={submittingBatchId !== null}
                    onClick={() => handleDispose(batch.id)}
                  >
                    {isSubmitting
                      ? "Disposing..."
                      : `Dispose ${batch.quantity_remaining}`}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`expired-stock-notes-${material.id}`}>
            Disposal Notes
          </Label>

          <Textarea
            id={`expired-stock-notes-${material.id}`}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional reason or disposal details..."
            disabled={submittingBatchId !== null}
            rows={3}
          />

          <p className="text-xs text-muted-foreground">
            The notes will be recorded with the expired-stock transaction.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={submittingBatchId !== null}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
