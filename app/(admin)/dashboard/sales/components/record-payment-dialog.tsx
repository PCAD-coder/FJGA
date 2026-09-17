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

import { recordPayment } from "../services/payment-service"

import type { PaymentMethod, SalesRecord } from "../types/sales"

interface RecordPaymentDialogProps {
  sale: SalesRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onPaymentRecorded: () => void
}

function formatCurrency(value: number) {
  return `₱${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function RecordPaymentDialog({
  sale,
  open,
  onOpenChange,
  onPaymentRecorded,
}: RecordPaymentDialogProps) {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash_on_delivery")
  const [paymentDate, setPaymentDate] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [receivedByEmployee, setReceivedByEmployee] = useState("")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    setAmount("")
    setPaymentMethod(sale?.paymentMethod ?? "cash_on_delivery")
    setPaymentDate(new Date().toISOString().split("T")[0])
    setReferenceNumber("")
    setReceivedByEmployee("")
    setNotes("")
    setError(null)
  }, [open, sale])

  if (!sale) {
    return null
  }

  const paymentAmount = Number(amount)

  const remainingBalance = Math.max(sale.balance, 0)

  const remainingDownPayment = Math.max(sale.downPaymentRemaining, 0)

  const handleSubmit = async () => {
    try {
      setError(null)

      if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
        setError("Please enter a valid payment amount.")
        return
      }

      if (paymentAmount > remainingBalance) {
        setError(
          `Payment cannot exceed the remaining balance of ${formatCurrency(
            remainingBalance
          )}.`
        )
        return
      }
      if (
        (paymentMethod === "gcash" || paymentMethod === "card") &&
        !referenceNumber.trim()
      ) {
        setError(
          `A reference number is required for ${
            paymentMethod === "gcash" ? "GCash" : "card"
          } payments.`
        )
        return
      }

      if (paymentMethod === "cash_on_delivery" && !receivedByEmployee.trim()) {
        setError(
          "Please enter the name of the employee who received the cash payment."
        )
        return
      }

      setSaving(true)

      await recordPayment({
        orderId: sale.orderId,
        amount: paymentAmount,
        paymentMethod,
        paymentDate,
        referenceNumber:
          paymentMethod === "cash_on_delivery" ? null : referenceNumber.trim(),
        receivedByEmployee:
          paymentMethod === "cash_on_delivery"
            ? receivedByEmployee.trim()
            : null,
        notes,
      })

      onOpenChange(false)
      onPaymentRecorded()
    } catch (err) {
      console.error("Failed to record payment:", err)

      setError(err instanceof Error ? err.message : "Failed to record payment.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>

          <DialogDescription>
            Record a payment received for order{" "}
            <span className="font-medium">{sale.orderNumber}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-lg border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Order Total</p>

                <p className="font-semibold">
                  {formatCurrency(sale.totalAmount)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Amount Paid</p>

                <p className="font-semibold">
                  {formatCurrency(sale.amountPaid)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Required Down Payment
                </p>

                <p className="font-semibold">
                  {formatCurrency(sale.requiredDownPayment)}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Down Payment Remaining
                </p>

                <p className="font-semibold">
                  {formatCurrency(remainingDownPayment)}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground">
                  Remaining Balance
                </p>

                <p className="text-lg font-bold">
                  {formatCurrency(remainingBalance)}
                </p>
              </div>
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
              placeholder="Enter payment amount"
            />

            {remainingDownPayment > 0 && (
              <p className="text-xs text-muted-foreground">
                At least{" "}
                <span className="font-medium">
                  {formatCurrency(remainingDownPayment)}
                </span>{" "}
                more is needed to satisfy the 50% production payment
                requirement.
              </p>
            )}
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
                <SelectItem value="cash_on_delivery">
                  Cash on Delivery
                </SelectItem>

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

          {(paymentMethod === "gcash" || paymentMethod === "card") && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Reference Number *</label>

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
          {paymentMethod === "cash_on_delivery" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Received By Employee *
              </label>

              <Input
                value={receivedByEmployee}
                onChange={(event) => setReceivedByEmployee(event.target.value)}
                placeholder="Enter employee name"
              />

              <p className="text-xs text-muted-foreground">
                Enter the name of the FJGA employee who received the cash
                payment.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>

            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional payment notes..."
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

          <Button
            type="button"
            disabled={
              saving || !amount || paymentAmount <= 0 || remainingBalance <= 0
            }
            onClick={handleSubmit}
          >
            {saving ? "Recording..." : "Record Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
