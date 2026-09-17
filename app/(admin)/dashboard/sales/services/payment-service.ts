import { createClient } from "@/lib/supabase/client"
import type {
  PaymentMethod,
  PaymentSubmission,
} from "../types/sales"

const supabase = createClient()

interface RecordPaymentInput {
  orderId: string
  amount: number
  paymentMethod: PaymentMethod
  paymentDate: string
  referenceNumber?: string | null
  receivedByEmployee?: string | null
  notes?: string | null
}

export async function recordPayment(input: RecordPaymentInput) {
  if (!input.orderId) {
    throw new Error("Order ID is required")
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Payment amount must be greater than zero")
  }

  if (!input.paymentMethod) {
    throw new Error("Payment method is required")
  }

  const { data, error } = await supabase
    .from("order_payments")
    .insert({
      order_id: input.orderId,
      amount: input.amount,
      payment_method: input.paymentMethod,
      payment_date: input.paymentDate
        ? new Date(input.paymentDate).toISOString()
        : new Date().toISOString(),
      reference_number: input.referenceNumber?.trim() || null,
      received_by_employee: input.receivedByEmployee ?? null,
      notes: input.notes?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message || "Failed to record payment")
  }

  return data
}

export async function approvePaymentSubmission(
  submissionId: string
) {
  if (!submissionId) {
    throw new Error("Payment submission ID is required")
  }

  const { data, error } = await supabase.rpc(
    "approve_payment_submission",
    {
      p_submission_id: submissionId,
    }
  )

  if (error) {
    throw new Error(
      error.message || "Failed to approve payment submission"
    )
  }

  return data
}

export async function rejectPaymentSubmission(
  submissionId: string,
  rejectionReason: string
) {
  if (!submissionId) {
    throw new Error("Payment submission ID is required")
  }

  if (!rejectionReason.trim()) {
    throw new Error("A rejection reason is required")
  }

  const { data, error } = await supabase.rpc(
    "reject_payment_submission",
    {
      p_submission_id: submissionId,
      p_rejection_reason: rejectionReason.trim(),
    }
  )

  if (error) {
    throw new Error(
      error.message || "Failed to reject payment submission"
    )
  }

  return data
}
export async function getPaymentProofUrl(
  proofImagePath: string
) {
  if (!proofImagePath) {
    throw new Error("Payment proof path is missing")
  }

  const { data, error } = await supabase.storage
    .from("payment-proofs")
    .createSignedUrl(proofImagePath, 60 * 5)

  if (error || !data?.signedUrl) {
    throw new Error(
      error?.message || "Failed to generate payment proof URL"
    )
  }

  return data.signedUrl
}
