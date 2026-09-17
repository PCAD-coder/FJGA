"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { Delivery } from "../types/delivery"
import type { PaymentMethod } from "@/app/(admin)/dashboard/sales/types/sales"

interface DeliveryFinalPaymentDialogProps {
  delivery: Delivery | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCompleted: () => void
}

export default function DeliveryFinalPaymentDialog({
  delivery,
  open,
  onOpenChange,
  onCompleted,
}: DeliveryFinalPaymentDialogProps) {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash_on_delivery")
  const [paymentDate, setPaymentDate] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [receivedByEmployee, setReceivedByEmployee] = useState("")
  const [notes, setNotes] = useState("")

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /*
   * The actual remaining balance will be supplied by the
   * delivery module after we add it to the Delivery type.
   */

  useEffect(() => {
    if (!open) {
      return
    }

    setAmount(
      delivery?.remainingBalance ? delivery.remainingBalance.toFixed(2) : ""
    )
    setPaymentMethod("cash_on_delivery")
    setPaymentDate(new Date().toISOString().split("T")[0])
    setReferenceNumber("")
    setReceivedByEmployee("")
    setNotes("")
    setError(null)
  }, [open, delivery])

  if (!delivery) {
    return null
  }

  const requiresReference =
    paymentMethod === "gcash" || paymentMethod === "card"

  const requiresEmployee = paymentMethod === "cash_on_delivery"

  const handleSubmit = async () => {
    setError(null)

    if (Number(amount) !== delivery.remainingBalance) {
      setError(
        `The final payment must be exactly ₱${delivery.remainingBalance.toLocaleString(
          "en-PH",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}.`
      )

      return
    }
    if (Number(amount) > delivery.remainingBalance) {
      setError(
        `Payment cannot exceed the remaining balance of ₱${delivery.remainingBalance.toLocaleString(
          "en-PH",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        )}.`
      )

      return
    }

    if (requiresReference && !referenceNumber.trim()) {
      setError("A reference number is required for GCash or Card payments.")
      return
    }

    if (requiresEmployee && !receivedByEmployee.trim()) {
      setError(
        "The name of the employee who received the cash payment is required."
      )
      return
    }

    try {
      setSaving(true)

      /*
       * This will call the server action created in the next step.
       */

      const { completeDeliveryWithPayment } =
        await import("../services/delivery-payment-actions")

      await completeDeliveryWithPayment({
        deliveryId: delivery.id,
        amount: Number(amount),
        paymentMethod,
        paymentDate,
        referenceNumber: referenceNumber.trim() || null,
        receivedByEmployee: receivedByEmployee.trim() || null,
        notes: notes.trim() || null,
      })

      onOpenChange(false)
      onCompleted()
    } catch (err) {
      console.error("Failed to complete delivery payment:", err)

      setError(
        err instanceof Error ? err.message : "Failed to record final payment"
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete Delivery</DialogTitle>

          <DialogDescription>
            Record the customer's remaining payment before completing delivery
            for order{" "}
            <span className="font-medium">{delivery.orderNumber}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">Final Payment Required</p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Order Total</p>

              <p className="font-semibold">
                ₱
                {delivery.totalAmount.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Amount Paid</p>

              <p className="font-semibold">
                ₱
                {delivery.amountPaid.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Remaining Balance</p>

              <p className="text-lg font-bold">
                ₱
                {delivery.remainingBalance.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Amount</label>

            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter remaining balance"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>

            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as PaymentMethod)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="cash_on_delivery">Cash</SelectItem>

                <SelectItem value="card">Card</SelectItem>

                <SelectItem value="gcash">GCash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Date</label>

            <Input
              type="date"
              value={paymentDate}
              onChange={(event) => setPaymentDate(event.target.value)}
            />
          </div>

          {requiresReference && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reference Number
                <span className="ml-1 text-destructive">*</span>
              </label>

              <Input
                value={referenceNumber}
                onChange={(event) => setReferenceNumber(event.target.value)}
                placeholder="Enter payment reference number"
              />

              <p className="text-xs text-muted-foreground">
                Required as proof of the electronic payment.
              </p>
            </div>
          )}

          {requiresEmployee && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Received By
                <span className="ml-1 text-destructive">*</span>
              </label>

              <Input
                value={receivedByEmployee}
                onChange={(event) => setReceivedByEmployee(event.target.value)}
                placeholder="Employee who received the cash"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>

            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional payment or delivery notes..."
              rows={3}
            />
          </div>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="button" disabled={saving} onClick={handleSubmit}>
            {saving ? "Completing..." : "Record Payment & Deliver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
