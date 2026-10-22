"use client"

import { type ReactNode, useMemo, useState } from "react"

import { PackagePlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import type { InventoryMaterial } from "../../types/inventory"

interface RestockMaterialDialogProps {
  material: InventoryMaterial
  trigger?: ReactNode

  onRestock: (input: {
    materialId: string
    quantity: number
    notes?: string
    batchNumber?: string
    receivedAt?: string
    expirationDate?: string
  }) => Promise<unknown>
}

export function RestockMaterialDialog({
  material,
  trigger,
  onRestock,
}: RestockMaterialDialogProps) {
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [batchNumber, setBatchNumber] = useState("")
  const [receivedAt, setReceivedAt] = useState("")
  const [expirationDate, setExpirationDate] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const quantityNumber = Number(quantity)

  const isValidQuantity =
    quantity.trim() !== "" &&
    Number.isFinite(quantityNumber) &&
    quantityNumber > 0

  const requiresExpiration = material.tracks_expiration

  const hasValidExpirationDetails =
    !requiresExpiration ||
    (receivedAt !== "" && expirationDate !== "" && expirationDate >= receivedAt)

  const canSubmit = isValidQuantity && hasValidExpirationDetails

  const newStock = useMemo(() => {
    if (!isValidQuantity) {
      return material.stock_quantity
    }

    return material.stock_quantity + quantityNumber
  }, [isValidQuantity, material.stock_quantity, quantityNumber])

  function resetForm() {
    setQuantity("")
    setNotes("")
    setBatchNumber("")
    setReceivedAt("")
    setExpirationDate("")
    setError(null)
  }

  function handleOpenChange(nextOpen: boolean) {
    if (submitting) return

    setOpen(nextOpen)

    if (!nextOpen) {
      resetForm()
    }
  }

  async function handleRestock() {
    if (!isValidQuantity) {
      setError("Enter a quantity greater than zero.")
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      if (requiresExpiration) {
        if (!receivedAt) {
          setError("Received date is required for this material.")
          return
        }

        if (!expirationDate) {
          setError("Expiration date is required for this material.")
          return
        }

        if (expirationDate < receivedAt) {
          setError("Expiration date cannot be before the received date.")
          return
        }
      }

      await onRestock({
        materialId: material.id,
        quantity: quantityNumber,
        notes: notes.trim() || undefined,
        batchNumber: requiresExpiration
          ? batchNumber.trim() || undefined
          : undefined,
        receivedAt: requiresExpiration ? receivedAt : undefined,
        expirationDate: requiresExpiration ? expirationDate : undefined,
      })

      setOpen(false)
      resetForm()
    } catch (error) {
      console.error(error)

      setError(
        error instanceof Error ? error.message : "Failed to restock material."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
  {trigger ?? (
    <Button
      size="icon"
      variant="outline"
    >
      <PackagePlus className="h-4 w-4" />
    </Button>
  )}
</DialogTrigger>

      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Restock Material</DialogTitle>

          <DialogDescription>
            Add newly received stock to{" "}
            <span className="font-medium text-foreground">
              {material.material_name}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto py-2 pr-1">
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">
                Current Stock
              </span>

              <span className="font-semibold">
                {material.stock_quantity} {material.unit}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground">New Stock</span>

              <span className="font-semibold">
                {newStock} {material.unit}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`restock-quantity-${material.id}`}>
              Quantity to Add
            </Label>

            <Input
              id={`restock-quantity-${material.id}`}
              type="number"
              min="0"
              step="any"
              value={quantity}
              onChange={(event) => {
                setQuantity(event.target.value)
                setError(null)
              }}
              placeholder="Enter quantity"
              disabled={submitting}
            />

            <p className="text-xs text-muted-foreground">
              Unit: {material.unit}
            </p>
          </div>

          {requiresExpiration && (
            <div className="space-y-3 rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">Expiration Tracking</p>

                <p className="text-xs text-muted-foreground">
                  This material requires batch and expiration information when
                  new stock is received.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`restock-batch-${material.id}`}>
                  Batch / Lot Number
                  <span className="ml-1 text-muted-foreground">(Optional)</span>
                </Label>

                <Input
                  id={`restock-batch-${material.id}`}
                  value={batchNumber}
                  onChange={(event) => {
                    setBatchNumber(event.target.value)
                    setError(null)
                  }}
                  placeholder="Example: LOT-2026-001"
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`restock-received-${material.id}`}>
                    Received Date
                  </Label>

                  <Input
                    id={`restock-received-${material.id}`}
                    type="date"
                    value={receivedAt}
                    onChange={(event) => {
                      setReceivedAt(event.target.value)
                      setError(null)
                    }}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`restock-expiration-${material.id}`}>
                    Expiration Date
                  </Label>

                  <Input
                    id={`restock-expiration-${material.id}`}
                    type="date"
                    min={receivedAt || undefined}
                    value={expirationDate}
                    onChange={(event) => {
                      setExpirationDate(event.target.value)
                      setError(null)
                    }}
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor={`restock-notes-${material.id}`}>
              Remarks
              <span className="ml-1 text-muted-foreground">(Optional)</span>
            </Label>

            <Textarea
              id={`restock-notes-${material.id}`}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Example: Supplier delivery received"
              disabled={submitting}
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleRestock}
            disabled={!canSubmit || submitting}
          >
            <PackagePlus className="mr-2 h-4 w-4" />

            {submitting ? "Restocking..." : "Restock Material"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
