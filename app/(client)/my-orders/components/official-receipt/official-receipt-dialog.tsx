"use client"

import { useEffect, useState } from "react"
import {
  AlertCircle,
  Loader2,
  Printer,
  ReceiptText,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { getOfficialReceiptByOrderId } from "../../services/official-receipt.service"
import type { OfficialReceipt } from "../../types/official-receipt"
import { OfficialReceiptDocument } from "./official-receipt-document"
import { printOfficialReceipt } from "../../utils/print-official-receipt"

interface OfficialReceiptDialogProps {
  orderId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OfficialReceiptDialog({
  orderId,
  open,
  onOpenChange,
}: OfficialReceiptDialogProps) {
  const [receipt, setReceipt] = useState<OfficialReceipt | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

function handlePrint() {
  if (!receipt) {
    return
  }

  try {
    printOfficialReceipt({
      documentId: "official-receipt-print-area",
      receiptNumber: receipt.receipt_number,
    })
  } catch (error) {
    console.error("Failed to print official receipt:", error)

    setError(
      error instanceof Error
        ? error.message
        : "Failed to print the official receipt."
    )
  }
}

  useEffect(() => {
    if (!open) {
      return
    }

    let cancelled = false

    async function loadReceipt() {
      try {
        setIsLoading(true)
        setError(null)

        const data = await getOfficialReceiptByOrderId(orderId)

        if (cancelled) {
          return
        }

        setReceipt(data)

        if (!data) {
          setError(
            "No official receipt was found for this order."
          )
        }
      } catch (err) {
        if (cancelled) {
          return
        }

        console.error("Failed to load official receipt:", err)

        setReceipt(null)

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load the official receipt."
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadReceipt()

    return () => {
      cancelled = true
    }
  }, [open, orderId])

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen)

    if (!nextOpen) {
      setError(null)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-h-[90vh] !max-w-5xl overflow-y-auto p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2">
            <ReceiptText className="size-5" />
            Official Receipt
          </DialogTitle>

          <DialogDescription>
            View the official receipt issued after full payment and
            successful delivery of your order.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex min-h-[400px] items-center justify-center p-6">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="size-7 animate-spin" />

              <p className="text-sm">
                Loading official receipt...
              </p>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="p-6">
            <Alert variant="destructive">
              <AlertCircle className="size-4" />

              <AlertTitle>
                Unable to load receipt
              </AlertTitle>

              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {!isLoading && !error && receipt && (
          <div className="bg-muted/30 p-4 sm:p-6">
            <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
              <OfficialReceiptDocument receipt={receipt} />
            </div>

            <div className="receipt-dialog-actions mt-4 flex justify-end gap-2">
  <Button
    type="button"
    variant="outline"
    onClick={handlePrint}
  >
    <Printer className="mr-2 size-4" />
    Print Receipt
  </Button>

<Button
  type="button"
  variant="outline"
  onClick={handlePrint}
>
  <Printer className="mr-2 size-4" />
  Print / Save as PDF
</Button>
</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}