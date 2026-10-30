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

import type { Delivery } from "../types/delivery"
import type { PaymentMethod } from "@/app/(admin)/dashboard/sales/types/sales"
import { getActiveEmployees } from "../../user-management/services/personnel.service"
import type { Employee } from "../../user-management/types/personnel"

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
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
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
      delivery?.remainingBalance != null
        ? delivery.remainingBalance.toFixed(2)
        : ""
    )
    setPaymentMethod("cash_on_delivery")
    setPaymentDate(new Date().toISOString().split("T")[0])
    setReferenceNumber("")
    setReceivedByEmployee("")
    setProofFile(null)
    setNotes("")
    setError(null)
  }, [open, delivery])

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

  if (!delivery) {
    return null
  }

  const requiresReference = paymentMethod === "gcash"

  const requiresEmployee = paymentMethod === "cash_on_delivery"
  const remainingCentavos = Math.round(
    (delivery.remainingBalance + Number.EPSILON) * 100
  )

  const isFullyPaid = remainingCentavos <= 0

  const handleSubmit = async () => {
    setError(null)

    /*
     * ============================================================
     * FULLY PAID BEFORE DELIVERY
     * ============================================================
     *
     * No new payment should be created.
     * Only delivery proof is required.
     */
    if (isFullyPaid) {
      if (!proofFile) {
        setError("Please upload a delivery proof photo.")
        return
      }

      try {
        setSaving(true)

        const { completePaidDelivery } =
          await import("../services/delivery-payment-actions")

        const result = await completePaidDelivery({
          deliveryId: delivery.id,
          notes: notes.trim() || null,
          proofFile,
        })

        /*
         * Receipt emailing remains separate from the database
         * transaction. A failed email must not undo a successfully
         * completed delivery.
         */
        let receiptEmailSent = false

        try {
          const response = await fetch(
            `/api/official-receipts/${result.receipt_id}/email`,
            {
              method: "POST",
            }
          )

          const emailResult = await response.json()

          if (!response.ok || !emailResult.success) {
            throw new Error(
              emailResult.error ??
                "The official receipt email could not be sent."
            )
          }

          receiptEmailSent = true
        } catch (emailError) {
          console.error(
            "Official receipt email failed after delivery completion:",
            emailError
          )
        }

        if (receiptEmailSent) {
          toast.success(
            `Delivery completed successfully. Official receipt ${result.receipt_number} was emailed to the customer.`
          )
        } else {
          toast.warning(
            `Delivery completed successfully and official receipt ${result.receipt_number} was created, but the receipt email could not be sent.`
          )
        }

        onOpenChange(false)
        onCompleted()
      } catch (err) {
        toast.error(getErrorMessage(err, "Unable to complete delivery."))

        console.error("Failed to complete fully paid delivery:", err)

        setError(getErrorMessage(err, "Failed to complete delivery"))
      } finally {
        setSaving(false)
      }

      return
    }

    /*
     * ============================================================
     * FINAL PAYMENT REQUIRED
     * ============================================================
     */
    const paymentAmount = Number(amount)

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      setError("Enter a valid payment amount.")
      return
    }

    const paymentCentavos = Math.round((paymentAmount + Number.EPSILON) * 100)

    if (paymentCentavos !== remainingCentavos) {
      setError(
        `The final payment must be exactly ₱${(
          remainingCentavos / 100
        ).toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}.`
      )
      return
    }

    if (requiresReference && !referenceNumber.trim()) {
      setError("A reference number is required for GCash payments")
      return
    }

    if (requiresEmployee && !receivedByEmployee.trim()) {
      setError(
        "The name of the employee who received the cash payment is required."
      )
      return
    }

    if (paymentMethod === "cash_on_delivery" && !proofFile) {
      setError("Please upload a payment proof or receipt for the cash payment.")
      return
    }

    try {
      setSaving(true)

      const { completeDeliveryWithPayment } =
        await import("../services/delivery-payment-actions")

      const result = await completeDeliveryWithPayment({
        deliveryId: delivery.id,
        amount: paymentCentavos / 100,
        paymentMethod,
        paymentDate,
        referenceNumber:
          paymentMethod === "cash_on_delivery"
            ? null
            : referenceNumber.trim() || null,
        receivedByEmployee:
          paymentMethod === "cash_on_delivery"
            ? receivedByEmployee.trim()
            : null,
        notes: notes.trim() || null,
        proofFile: paymentMethod === "cash_on_delivery" ? proofFile : null,
      })

      let receiptEmailSent = false

      try {
        const response = await fetch(
          `/api/official-receipts/${result.receipt_id}/email`,
          {
            method: "POST",
          }
        )

        const emailResult = await response.json()

        if (!response.ok || !emailResult.success) {
          throw new Error(
            emailResult.error ?? "The official receipt email could not be sent."
          )
        }

        receiptEmailSent = true
      } catch (emailError) {
        console.error(
          "Official receipt email failed after delivery completion:",
          emailError
        )
      }

      if (receiptEmailSent) {
        toast.success(
          `Delivery completed successfully. Official receipt ${result.receipt_number} was emailed to the customer.`
        )
      } else {
        toast.warning(
          `Delivery completed successfully and official receipt ${result.receipt_number} was created, but the receipt email could not be sent.`
        )
      }

      onOpenChange(false)
      onCompleted()
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to save delivery changes."))

      console.error("Failed to complete delivery payment:", err)

      setError(getErrorMessage(err, "Failed to record final payment"))
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
            {isFullyPaid ? (
              <>
                Confirm the completed delivery for fully paid order{" "}
                <span className="font-medium">{delivery.orderNumber}</span>.
              </>
            ) : (
              <>
                Record the customer&apos;s remaining payment before completing
                delivery for order{" "}
                <span className="font-medium">{delivery.orderNumber}</span>.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border p-4">
          <p className="text-sm font-medium">
            {isFullyPaid ? "Order Fully Paid" : "Final Payment Required"}
          </p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Order Total</p>

              <p className="font-semibold">
                &#8369;
                {delivery.totalAmount.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Amount Paid</p>

              <p className="font-semibold">
                &#8369;
                {delivery.amountPaid.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Remaining Balance</p>

              <p className="text-lg font-bold">
                &#8369;
                {delivery.remainingBalance.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {isFullyPaid && (
            <div className="mt-4 rounded-md border bg-muted/30 p-3">
              <p className="text-sm font-medium">
                No additional payment is required.
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                This order has already been paid in full. Upload proof of the
                completed delivery to continue.
              </p>
            </div>
          )}
          {!isFullyPaid && (
            <>
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
                  onValueChange={(value) => {
                    const nextMethod = value as PaymentMethod

                    setPaymentMethod(nextMethod)
                    setError(null)

                    if (nextMethod !== "cash_on_delivery") {
                      setReceivedByEmployee("")
                      setProofFile(null)
                    }

                    if (nextMethod === "cash_on_delivery") {
                      setReferenceNumber("")
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="cash_on_delivery">Cash</SelectItem>
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Received By
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
                      Payment Proof / Receipt
                      <span className="ml-1 text-destructive">*</span>
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
                      Upload a JPG, PNG, or WebP image of the receipt or other
                      proof that the cash payment was received. Maximum file
                      size: 5 MB.
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
            </>
          )}
          {isFullyPaid && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Delivery Proof
                <span className="ml-1 text-destructive">*</span>
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
                Upload a JPG, PNG, or WebP photo confirming that the order was
                delivered. Maximum file size: 5 MB.
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
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {isFullyPaid ? "Delivery Notes" : "Notes"}
            </label>

            <Textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={
                isFullyPaid
                  ? "Optional delivery notes..."
                  : "Optional payment or delivery notes..."
              }
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

          <Button
            type="button"
            disabled={
              saving ||
              (isFullyPaid
                ? !proofFile
                : !amount ||
                  Number(amount) <= 0 ||
                  (paymentMethod === "cash_on_delivery" &&
                    (!receivedByEmployee.trim() || !proofFile)))
            }
            onClick={handleSubmit}
          >
            {saving
              ? "Completing..."
              : isFullyPaid
                ? "Complete Delivery"
                : "Record Payment & Deliver"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
