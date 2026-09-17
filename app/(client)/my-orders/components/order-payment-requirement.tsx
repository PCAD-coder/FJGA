"use client"

import { AlertCircle, CheckCircle2, Clock, CreditCard } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type { Order } from "../types/order"

interface Props {
  order: Order
  onSubmitPayment?: () => void
}

export default function OrderPaymentRequirement({
  order,
  onSubmitPayment,
}: Props) {
  /*
   * Keep the payment submission in a local constant.
   * This allows TypeScript to safely narrow the value.
   */
  const paymentSubmission = order.paymentSubmission
  /*
   * ============================================================
   * PENDING ORDER
   * ============================================================
   *
   * The customer must wait for the administrator to approve
   * the order before making the required production payment.
   */
  if (order.status === "Pending") {
    return (
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-blue-900">
                Waiting for Order Approval
              </h3>

              <Badge
                variant="outline"
                className="border-blue-300 text-blue-700"
              >
                Pending Approval
              </Badge>
            </div>

            <p className="mt-1 text-sm text-blue-800">
              Your order has been successfully submitted and is currently
              waiting for the administrator to review and approve it.
            </p>

            <div className="mt-3 rounded-lg border border-blue-200 bg-white/60 p-3">
              <p className="text-sm font-medium text-blue-900">
                What happens next?
              </p>

              <p className="mt-1 text-sm text-blue-800">
                Once your order is approved, you will need to pay at least 50%
                of the order total before production can begin.
              </p>
            </div>

            <p className="mt-3 text-xs text-blue-700">
              Please wait for the administrator to approve your order. You will
              then be able to submit your required payment.
            </p>
          </div>
        </div>
      </div>
    )
  }
  /*
   * Payment requirement only applies after
   * the admin approves the order.
   
  if (order.status !== "Approved") {
    return null
  }*/

  /*
   * The required down payment has already
   * been satisfied.
   */
  if (order.productionPaymentComplete) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-green-800">
                Down Payment Complete
              </h3>

              <Badge
                variant="outline"
                className="border-green-300 text-green-700"
              >
                50% Paid
              </Badge>
            </div>

            <p className="mt-1 text-sm text-green-700">
              The required down payment has been recorded. Your order can
              proceed to production.
            </p>
          </div>
        </div>
      </div>
    )
  }

  /*
   * Check whether there is currently a payment
   * submission waiting for admin verification.
   */
  const pendingSubmission = paymentSubmission?.verificationStatus === "pending"

  if (pendingSubmission && paymentSubmission) {
    return (
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-yellow-800">
                Payment Verification Pending
              </h3>

              <Badge
                variant="outline"
                className="border-yellow-300 text-yellow-700"
              >
                Under Review
              </Badge>
            </div>

            <p className="mt-1 text-sm text-yellow-700">
              Your payment proof has been submitted and is waiting for admin
              verification.
            </p>

            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <span className="text-yellow-700">Submitted:</span>{" "}
                <span className="font-medium text-yellow-900">
                  ₱
                  {paymentSubmission.amount.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div>
                <span className="text-yellow-700">Method:</span>{" "}
                <span className="font-medium text-yellow-900">
                  {formatPaymentMethod(paymentSubmission.paymentMethod)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /*
   * A rejected submission means the client needs
   * to correct and submit the payment again.
   */
  const rejectedSubmission =
    paymentSubmission?.verificationStatus === "rejected"

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
      <div className="flex items-start gap-3">
        {rejectedSubmission ? (
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
        ) : (
          <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-orange-900">
              {rejectedSubmission
                ? "Payment Submission Rejected"
                : "50% Down Payment Required"}
            </h3>

            <Badge
              variant="outline"
              className="border-orange-300 text-orange-700"
            >
              {rejectedSubmission ? "Action Required" : "Payment Required"}
            </Badge>
          </div>

          <p className="mt-1 text-sm text-orange-800">
            {rejectedSubmission
              ? "Your previous payment submission was rejected. Please review the reason and submit the correct payment proof."
              : "Your order has been approved. A minimum payment of 50% of the order total is required before production can begin."}
          </p>

          {rejectedSubmission && paymentSubmission?.rejectionReason && (
            <div className="mt-3 rounded-lg border border-orange-200 bg-white/60 p-3">
              <p className="text-xs font-medium tracking-wide text-orange-700 uppercase">
                Rejection Reason
              </p>

              <p className="mt-1 text-sm text-orange-900">
                {paymentSubmission.rejectionReason}
              </p>
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs text-orange-700">Order Total</p>

              <p className="font-semibold text-orange-950">
                ₱
                {order.total.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div>
              <p className="text-xs text-orange-700">Required 50%</p>

              <p className="font-semibold text-orange-950">
                ₱
                {order.requiredDownPayment.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div>
              <p className="text-xs text-orange-700">Remaining</p>

              <p className="font-bold text-orange-950">
                ₱
                {order.remainingDownPayment.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {order.paymentDaysRemaining !== null && (
            <div className="mt-4 flex items-center gap-2 text-sm text-orange-800">
              <Clock className="h-4 w-4" />

              {order.paymentDaysRemaining > 0 ? (
                <span>
                  Please complete the required payment within{" "}
                  <strong>
                    {order.paymentDaysRemaining}{" "}
                    {order.paymentDaysRemaining === 1 ? "day" : "days"}
                  </strong>
                  .
                </span>
              ) : (
                <span className="font-medium">
                  The payment deadline has passed.
                </span>
              )}
            </div>
          )}

          {!rejectedSubmission && (
            <p className="mt-3 text-xs text-orange-700">
              GCash and online banking payments require payment proof. Cash
              payments can be handled directly by the administrator.
            </p>
          )}

          {onSubmitPayment && (
            <Button
              className="mt-4"
              onClick={onSubmitPayment}
              disabled={order.paymentDaysRemaining === 0}
            >
              {rejectedSubmission ? "Submit Payment Again" : "Submit Payment"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function formatPaymentMethod(method: string): string {
  switch (method) {
    case "gcash":
      return "GCash"

    case "online_banking":
      return "Online Banking"

    case "card":
      return "Card"
      
    case "cash":
      return "Cash"

    case "cash_on_delivery":
      return "Cash"

    default:
      return method
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
  }
}
