"use client"

import { useEffect, useState } from "react"
import { ImageIcon, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

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

import type { Delivery } from "../types/delivery"
import { completeReturnDelivery } from "../services/delivery-payment-actions"

interface ReturnDeliveryConfirmationDialogProps {
  delivery: Delivery | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCompleted: () => Promise<void> | void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
]

export default function ReturnDeliveryConfirmationDialog({
  delivery,
  open,
  onOpenChange,
  onCompleted,
}: ReturnDeliveryConfirmationDialogProps) {
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      setProofFile(null)
      setNotes("")
      setSubmitting(false)
    }
  }, [open])

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null

    if (!file) {
      setProofFile(null)
      return
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(
        "Delivery proof must be a JPG, PNG, or WebP image."
      )
      event.target.value = ""
      setProofFile(null)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        "Delivery proof must not exceed 5 MB."
      )
      event.target.value = ""
      setProofFile(null)
      return
    }

    setProofFile(file)
  }

  const handleSubmit = async () => {
    if (!delivery) {
      return
    }

    if (delivery.deliveryType !== "return") {
      toast.error(
        "This confirmation is only for return deliveries."
      )
      return
    }

    if (!proofFile) {
      toast.error(
        "Please upload a delivery proof photo."
      )
      return
    }

    try {
      setSubmitting(true)

      const deliveryDate =
        new Date().toISOString().split("T")[0]

      await completeReturnDelivery({
        deliveryId: delivery.id,
        deliveryDate,
        notes: notes.trim() || null,
        proofFile,
      })

      toast.success(
        "Return delivery completed successfully."
      )

      await onCompleted()
    } catch (error) {
      console.error(
        "Failed to complete return delivery:",
        error
      )

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to complete return delivery."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!submitting) {
          onOpenChange(nextOpen)
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Confirm Return Delivery
          </DialogTitle>

          <DialogDescription>
            Upload a photo as proof that the repaired or
            replacement product was successfully delivered to
            the customer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {delivery && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium">
                {delivery.projectName}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {delivery.clientName}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="return-delivery-proof">
              Delivery Proof Photo
              <span className="ml-1 text-destructive">
                *
              </span>
            </Label>

            <Input
              id="return-delivery-proof"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={submitting}
              onChange={handleFileChange}
            />

            <p className="text-xs text-muted-foreground">
              Upload a JPG, PNG, or WebP image. Maximum file
              size is 5 MB.
            </p>

            {proofFile && (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <ImageIcon className="h-5 w-5 shrink-0 text-muted-foreground" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {proofFile.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="return-delivery-notes">
              Delivery Notes
            </Label>

            <Textarea
              id="return-delivery-notes"
              placeholder="Add optional delivery notes..."
              value={notes}
              disabled={submitting}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={!proofFile || submitting}
            onClick={handleSubmit}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Confirm Delivered
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}