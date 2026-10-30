"use client"

import { getErrorMessage } from "@/lib/error-message"

import { UploadedPhotoPreview } from "@/components/ui/uploaded-photo-preview"

import { toast } from "sonner"

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
import { getActiveEmployees } from "../../user-management/services/personnel.service"
import type { Employee } from "../../user-management/types/personnel"

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [paymentDate, setPaymentDate] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [receivedByEmployee, setReceivedByEmployee] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    setAmount("")
    setPaymentMethod("cash")
    setPaymentDate(new Date().toISOString().split("T")[0])
    setReferenceNumber("")
    setReceivedByEmployee("")
    setProofFile(null)
    setNotes("")
    setError(null)
  }, [open, sale])

  useEffect(() => {
    if (!open) return

    async function loadEmployees() {
      try {
        setLoadingEmployees(true)

        const data = await getActiveEmployees()
        setEmployees(data)
      } catch (error) {
        console.error("Failed to load employees:", error)
        toast.error(getErrorMessage(error, "Unable to load employees."))
      } finally {
        setLoadingEmployees(false)
      }
    }

    void loadEmployees()
  }, [open])

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

      if (paymentMethod === "cash" && !receivedByEmployee.trim()) {
        setError("Please select the employee who received the cash payment.")
        return
      }
      if (paymentMethod === "cash" && !proofFile) {
        setError(
          "Please upload a payment proof or receipt for the cash payment."
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
          paymentMethod === "cash" ? null : referenceNumber.trim(),

        receivedByEmployee:
          paymentMethod === "cash" ? receivedByEmployee.trim() : null,

        proofFile: paymentMethod === "cash" ? proofFile : null,
        notes,
      })

      toast.success("Payment recorded successfully.")
      onOpenChange(false)
      onPaymentRecorded()
    } catch (err) {
      console.error("Failed to record payment:", err)
      toast.error(getErrorMessage(err, "Failed to record payment."))

      setError(getErrorMessage(err, "Failed to record payment."))
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
              onValueChange={(value) => {
                const nextMethod = value as PaymentMethod

                setPaymentMethod(nextMethod)
                setError(null)

                if (nextMethod !== "cash") {
                  setReceivedByEmployee("")
                  setProofFile(null)
                }

                if (nextMethod === "cash") {
                  setReferenceNumber("")
                }
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
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

          {paymentMethod === "gcash" && (
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
          {paymentMethod === "cash" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Received By Employee
                  <span className="ml-1 text-destructive">*</span>
                </label>

                <Select
                  value={receivedByEmployee || undefined}
                  onValueChange={(value) => {
                    setReceivedByEmployee(value)
                    setError(null)
                  }}
                  disabled={loadingEmployees || saving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingEmployees
                          ? "Loading employees..."
                          : "Select an employee"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.name}>
                        {employee.position
                          ? `${employee.name} — ${employee.position}`
                          : employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {!loadingEmployees && employees.length === 0 ? (
                  <p className="text-xs text-destructive">
                    No active employees are available.
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Select the FJGA employee who received the cash payment.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Payment Proof / Receipt *
                </label>

                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={saving}
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null
                    setProofFile(file)
                    setError(null)
                  }}
                />

                <p className="text-xs text-muted-foreground">
                  Upload a JPG, PNG, or WebP image of the receipt or other proof
                  that the cash payment was received. Maximum file size: 5 MB.
                </p>

                {proofFile && <UploadedPhotoPreview file={proofFile} />}

                {proofFile && (
                  <div className="rounded-md border bg-muted/30 px-3 py-2">
                    <p className="truncate text-sm font-medium">
                      {proofFile.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {(proofFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
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
              saving ||
              !amount ||
              paymentAmount <= 0 ||
              remainingBalance <= 0 ||
              (paymentMethod === "cash" &&
                (!receivedByEmployee.trim() || !proofFile))
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
