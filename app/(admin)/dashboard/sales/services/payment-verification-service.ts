import { createClient } from "@/lib/supabase/client"

import type {
  PaymentMethod,
  PaymentSubmission,
} from "../types/sales"

const supabase = createClient()

export async function getPendingPaymentSubmissions(): Promise<
  PaymentSubmission[]
> {
  const { data, error } = await supabase
    .from("order_payment_submissions")
    .select(
      `
      id,
      order_id,
      amount,
      payment_method,
      payment_date,
      reference_number,
      proof_image_path,
      notes,
      verification_status,
      submitted_at,
      verified_at,
      verified_by,
      rejection_reason,
      created_at,
      updated_at,

      orders (
        id,
        order_number,
        customer_id,
        customer_contact_number,

        profiles (
          id,
          first_name,
          last_name
        )
      )
    `
    )
    .eq("verification_status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(
      error.message || "Failed to load payment submissions"
    )
  }

  return (data ?? []).map((submission: any) => {
    const order = Array.isArray(submission.orders)
      ? (submission.orders[0] ?? null)
      : submission.orders

    const profile = order
      ? Array.isArray(order.profiles)
        ? (order.profiles[0] ?? null)
        : order.profiles
      : null

    const customerName = profile
      ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
      : "Unknown Customer"

    return {
      id: submission.id,
      orderId: submission.order_id,
      orderNumber: order?.order_number ?? "—",

      customerId: order?.customer_id ?? "",
      customerName,
      contactNumber: order?.customer_contact_number ?? null,

      amount: Number(submission.amount ?? 0),
      paymentMethod: submission.payment_method as PaymentMethod,
      paymentDate: submission.payment_date,

      referenceNumber: submission.reference_number,
      proofImagePath: submission.proof_image_path,
      notes: submission.notes,

      verificationStatus: submission.verification_status,

      submittedAt: submission.submitted_at,
      verifiedAt: submission.verified_at,
      verifiedBy: submission.verified_by,
      rejectionReason: submission.rejection_reason,

      createdAt: submission.created_at,
      updatedAt: submission.updated_at,
    }
  })
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