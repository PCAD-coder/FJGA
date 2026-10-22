"use client"

import { type ReactNode, useEffect, useState } from "react"
import { CalendarClock } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { InventoryMaterial } from "../../types/inventory"
import type { EnableExpirationTrackingInput } from "../../services/inventory.service"

interface EnableExpirationTrackingDialogProps {
  material: InventoryMaterial
  trigger?: ReactNode
  onSubmit: (input: EnableExpirationTrackingInput) => Promise<unknown>
}

function getToday() {
  const date = new Date()
  const offset = date.getTimezoneOffset()

  return new Date(date.getTime() - offset * 60_000).toISOString().split("T")[0]
}

export function EnableExpirationTrackingDialog({
  material,
  trigger,
  onSubmit,
}: EnableExpirationTrackingDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [batchNumber, setBatchNumber] = useState("")
  const [receivedAt, setReceivedAt] = useState(getToday())
  const [expirationDate, setExpirationDate] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (!open) {
      setBatchNumber("")
      setReceivedAt(getToday())
      setExpirationDate("")
      setNotes("")
    }
  }, [open])

  async function handleSubmit() {
    if (!expirationDate) {
      return
    }

    if (expirationDate < receivedAt) {
      return
    }

    try {
      setSubmitting(true)

      await onSubmit({
        materialId: material.id,
        batchNumber,
        receivedAt,
        expirationDate,
        notes,
      })

      setOpen(false)
    } catch (error) {
      console.error("Failed to enable expiration tracking:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            size="icon"
            variant="outline"
            title="Enable expiration tracking"
          >
            <CalendarClock className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Enable Expiration Tracking</DialogTitle>

          <DialogDescription>
            Initialize the existing stock of {material.material_name} into its
            first expiration batch.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto py-4 pr-1">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-medium">{material.material_name}</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Existing stock:{" "}
              <span className="font-medium text-foreground">
                {material.stock_quantity} {material.unit}
              </span>
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              This does not add new stock. The existing quantity will be
              assigned to the initial expiration batch.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`enable-batch-${material.id}`}>Batch Number</Label>

            <Input
              id={`enable-batch-${material.id}`}
              value={batchNumber}
              onChange={(event) => setBatchNumber(event.target.value)}
              placeholder="e.g. BATCH-001"
            />

            <p className="text-xs text-muted-foreground">
              Optional internal batch or lot reference.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`enable-received-${material.id}`}>
                Received Date
              </Label>

              <Input
                id={`enable-received-${material.id}`}
                type="date"
                value={receivedAt}
                onChange={(event) => setReceivedAt(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`enable-expiration-${material.id}`}>
                Expiration Date
              </Label>

              <Input
                id={`enable-expiration-${material.id}`}
                type="date"
                min={receivedAt}
                value={expirationDate}
                onChange={(event) => setExpirationDate(event.target.value)}
              />
            </div>
          </div>

          {expirationDate && expirationDate < receivedAt && (
            <p className="text-sm text-destructive">
              Expiration date cannot be earlier than the received date.
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor={`enable-notes-${material.id}`}>Notes</Label>

            <Textarea
              id={`enable-notes-${material.id}`}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional notes about the existing stock..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              submitting ||
              !receivedAt ||
              !expirationDate ||
              expirationDate < receivedAt
            }
          >
            {submitting ? "Enabling..." : "Enable Tracking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
