"use client"

import { useState } from "react"

import { Check, Eye, X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

import {
  approvePaymentSubmission,
  getPaymentProofUrl,
  rejectPaymentSubmission,
} from "../services/payment-service"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { PaymentSubmission } from "../types/sales"

interface PendingPaymentSubmissionsProps {
  submissions: PaymentSubmission[]
  onUpdated: () => void
}

function formatCurrency(value: number) {
  return `₱${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return new Date(value).toLocaleDateString()
}

function getPaymentMethodLabel(method: PaymentSubmission["paymentMethod"]) {
  switch (method) {
    case "gcash":
      return "GCash"

    case "card":
      return "Card"

    case "online_banking":
      return "Online Banking"

    case "cash":
      return "Cash"

    case "cash_on_delivery":
      return "Cash on Delivery"

    default:
      return "—"
  }
}

export default function PendingPaymentSubmissions({
  submissions,
  onUpdated,
}: PendingPaymentSubmissionsProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleViewProof = async (submission: PaymentSubmission) => {
    try {
      setError(null)

      if (!submission.proofImagePath) {
        throw new Error("No payment proof is available for this submission.")
      }

      const url = await getPaymentProofUrl(
        submission.proofImagePath
      )

      window.open(url, "_blank", "noopener,noreferrer")
    } catch (error) {
      console.error("PAYMENT PROOF ERROR:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to open payment proof."
      )
    }
  }

  const handleApprove = async (submission: PaymentSubmission) => {
    try {
      setProcessingId(submission.id)
      setError(null)

      await approvePaymentSubmission(submission.id)

      onUpdated()
    } catch (error) {
      console.error("PAYMENT APPROVAL ERROR:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to approve payment."
      )
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (submission: PaymentSubmission) => {
    try {
      setProcessingId(submission.id)
      setError(null)

      if (!rejectionReason.trim()) {
        setError("A rejection reason is required.")
        return
      }

      await rejectPaymentSubmission(
        submission.id,
        rejectionReason
      )

      setRejectingId(null)
      setRejectionReason("")

      onUpdated()
    } catch (error) {
      console.error("PAYMENT REJECTION ERROR:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to reject payment."
      )
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Pending Payment Submissions</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Review customer payment submissions before recording them as
              verified payments.
            </p>
          </div>

          <Badge variant="secondary">
            {submissions.length} pending
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No payment submissions are waiting for verification.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>

                  <TableHead>Customer</TableHead>

                  <TableHead>Amount</TableHead>

                  <TableHead>Method</TableHead>

                  <TableHead>Payment Date</TableHead>

                  <TableHead>Reference No.</TableHead>

                  <TableHead>Submitted</TableHead>

                  <TableHead className="text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      {submission.orderNumber}
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {submission.customerName}
                        </p>

                        {submission.contactNumber && (
                          <p className="text-xs text-muted-foreground">
                            {submission.contactNumber}
                          </p>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">
                      {formatCurrency(submission.amount)}
                    </TableCell>

                    <TableCell>
                      {getPaymentMethodLabel(
                        submission.paymentMethod
                      )}
                    </TableCell>

                    <TableCell>
                      {formatDate(submission.paymentDate)}
                    </TableCell>

                    <TableCell>
                      {submission.referenceNumber ?? "—"}
                    </TableCell>

                    <TableCell>
                      {formatDate(submission.submittedAt)}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleViewProof(submission)
                          }
                          disabled={!submission.proofImagePath}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Proof
                        </Button>

                        <Button
                          size="sm"
                          onClick={() =>
                            handleApprove(submission)
                          }
                          disabled={
                            processingId === submission.id
                          }
                        >
                          <Check className="mr-2 h-4 w-4" />

                          {processingId === submission.id
                            ? "Processing..."
                            : "Approve"}
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setError(null)
                            setRejectingId(submission.id)
                            setRejectionReason("")
                          }}
                          disabled={
                            processingId === submission.id
                          }
                        >
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {rejectingId && (
          <div className="mt-6 rounded-lg border p-4">
            <h3 className="font-semibold">
              Reject Payment Submission
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Please provide a reason for rejecting this payment.
            </p>

            <Textarea
              value={rejectionReason}
              onChange={(event) =>
                setRejectionReason(event.target.value)
              }
              placeholder="Enter rejection reason..."
              className="mt-4"
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectingId(null)
                  setRejectionReason("")
                  setError(null)
                }}
                disabled={processingId === rejectingId}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  const submission = submissions.find(
                    (item) => item.id === rejectingId
                  )

                  if (submission) {
                    handleReject(submission)
                  }
                }}
                disabled={processingId === rejectingId}
              >
                {processingId === rejectingId
                  ? "Rejecting..."
                  : "Confirm Rejection"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}