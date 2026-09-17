"use client"

import { useState } from "react"

import type { Invoice } from "../types/payment"

import { createPayMongoCheckoutSession } from "../services/paymongo-service"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

interface Props {
  invoice: Invoice
  onSubmitted?: () => void
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

      window.location.href = checkoutUrl
    } catch (error) {
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
        <Button className="w-full">Pay Now</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Information */}
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Invoice No.</span>

              <span className="font-medium">{invoice.invoiceId}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Order ID</span>

              <span className="font-medium">{invoice.orderNumber}</span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Amount Due</span>

              <span className="font-bold">
                ₱{invoice.amountDue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Information */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-medium">Secure Online Payment</p>

            <p className="mt-1 text-sm text-muted-foreground">
              You will be redirected to PayMongo's secure checkout page to
              complete your payment.
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              Available payment methods will be shown on the PayMongo checkout
              page.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Pay Button */}
          <Button
            className="w-full"
            onClick={handlePayment}
            disabled={submitting}
          >
            {submitting ? "Opening Secure Checkout..." : "Continue to Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
