"use client"

import { useEffect, useState } from "react"
import { CalendarDays, PackageCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { InventoryMaterial } from "../../types/inventory"
import type { InitializeExpirationStockInput } from "../../services/inventory.service"

interface InitializeExpirationStockDialogProps {
  material: InventoryMaterial | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onInitialize: (
    input: InitializeExpirationStockInput
  ) => Promise<unknown>
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0]
}

export function InitializeExpirationStockDialog({
  material,
  open,
  onOpenChange,
  onInitialize,
}: InitializeExpirationStockDialogProps) {
  const [batchNumber, setBatchNumber] = useState("")
  const [receivedAt, setReceivedAt] = useState(getTodayDate())
  const [expirationDate, setExpirationDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (!open) return

    setBatchNumber("")
    setReceivedAt(getTodayDate())
    setExpirationDate("")
    setNotes("")
    setValidationError(null)
  }, [open, material?.id])

  const handleSubmit = async () => {
    if (!material) return

    setValidationError(null)

    if (!receivedAt) {
      setValidationError("Received date is required.")
      return
    }

    if (!expirationDate) {
      setValidationError("Expiration date is required.")
      return
    }

    if (expirationDate < receivedAt) {
      setValidationError(
        "Expiration date cannot be earlier than the received date."
      )
      return
    }

    try {
      setIsSubmitting(true)

      await onInitialize({
        materialId: material.id,
        batchNumber,
        receivedAt,
        expirationDate,
        notes,
      })

      onOpenChange(false)
    } catch {
      // The hook/service already handles the error message.
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PackageCheck className="h-5 w-5" />
            Initialize Expiration Stock
          </DialogTitle>

          <DialogDescription>
            Assign existing unbatched stock to an expiration batch.
            This does not add new inventory.
          </DialogDescription>
        </DialogHeader>

        {material && (
          <div className="space-y-5 py-2">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium">{material.material_name}</p>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Current stock
                </span>

                <span className="font-medium">
                  {material.stock_quantity} {material.unit}
                </span>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                The database will automatically determine how much of
                this stock has not yet been assigned to a batch.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialize-batch-number">
                Batch Number
              </Label>

              <Input
                id="initialize-batch-number"
                value={batchNumber}
                onChange={(event) =>
                  setBatchNumber(event.target.value)
                }
                placeholder="Optional batch or lot number"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="initialize-received-at">
                  Received Date
                </Label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="initialize-received-at"
                    type="date"
                    value={receivedAt}
                    onChange={(event) =>
                      setReceivedAt(event.target.value)
                    }
                    className="pl-9"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialize-expiration-date">
                  Expiration Date
                </Label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="initialize-expiration-date"
                    type="date"
                    value={expirationDate}
                    onChange={(event) =>
                      setExpirationDate(event.target.value)
                    }
                    className="pl-9"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialize-notes">Notes</Label>

              <Textarea
                id="initialize-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Optional notes about the existing stock"
                disabled={isSubmitting}
              />
            </div>

            {validationError && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {validationError}
              </div>
            )}

            <div className="rounded-lg border p-3 text-sm text-muted-foreground">
              This operation only creates an expiration batch for
              existing stock. It will not increase the material&apos;s
              current inventory quantity.
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              !material ||
              !receivedAt ||
              !expirationDate ||
              isSubmitting
            }
          >
            {isSubmitting
              ? "Initializing..."
              : "Initialize Stock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}