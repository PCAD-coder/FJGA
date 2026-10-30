"use client"

import { toast } from "sonner"

import { useState } from "react"
import { QrCode, ExternalLink, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import type { Invoice } from "../types/payment"
import { createPayMongoCheckoutSession } from "../services/paymongo-service"

interface Props {
  invoice: Invoice
  onSubmitted?: () => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function PaymentDialog({ invoice, onSubmitted }: Props) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePayment() {
    try {
      setSubmitting(true)
      setError(null)

      const { checkoutUrl } = await createPayMongoCheckoutSession({
        orderId: invoice.orderId,
      })

      onSubmitted?.()

      toast.info(
        "Opening secure checkout. Payment will be confirmed after processing."
      )
      window.location.href = checkoutUrl
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to open payment checkout."
      )
      console.error("PAYMONGO PAYMENT ERROR:", error)

      setError(
        error instanceof Error ? error.message : "Failed to start payment."
      )

      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!submitting) {
          setOpen(value)

          if (!value) {
            setError(null)
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full">
          Pay {formatCurrency(invoice.amountDue)}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Review the payment details before continuing to secure checkout.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="overflow-hidden rounded-xl border">
            <div className="border-b bg-muted/30 p-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Order
              </p>
              <p className="mt-1 font-semibold">{invoice.orderNumber}</p>
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-muted-foreground">Product</span>

                <span className="text-right text-sm font-medium">
                  {invoice.productName}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-sm text-muted-foreground">
                  Payment Due
                </span>

                <span className="text-right text-sm font-medium">
                  {invoice.dueDate}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">
                      Required before production
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      50% production payment requirement
                    </p>
                  </div>

                  <p className="shrink-0 text-xl font-bold">
                    {formatCurrency(invoice.amountDue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-sm font-medium">Secure online payment</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  You will be redirected to PayMongo to complete your payment
                  securely.
                </p>

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <QrCode className="h-3.5 w-3.5" />
                  GCash and QR Ph
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handlePayment}
            disabled={submitting}
          >
            {submitting ? (
              "Opening Secure Checkout..."
            ) : (
              <>
                Continue to PayMongo
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Your order will be updated after the payment is confirmed.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
