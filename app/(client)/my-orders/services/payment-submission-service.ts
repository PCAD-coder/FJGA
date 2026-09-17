"use server"

import { createClient } from "@/lib/supabase/server"

import type { PaymentMethod } from "@/app/(admin)/dashboard/sales/types/sales"

interface SubmitPaymentProofInput {
  orderId: string
  amount: number
  paymentMethod: PaymentMethod
  paymentDate: string
  referenceNumber: string
  notes: string | null
  proofFile: File
}

export async function submitPaymentProof(input: SubmitPaymentProofInput) {
  const supabase = await createClient()

  /*
   * ============================================================
   * AUTHENTICATION
   * ============================================================
   */

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  /*
   * ============================================================
   * GET CLIENT PROFILE
   * ============================================================
   *
   * orders.customer_id references profiles.id.
   * profiles.auth_user_id references auth.users.id.
   */

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single()

  if (profileError || !profile) {
    throw new Error("Customer profile not found")
  }

  /*
   * ============================================================
   * VALIDATE PAYMENT METHOD
   * ============================================================
   */

  if (
    input.paymentMethod !== "gcash" &&
    input.paymentMethod !== "card" &&
    input.paymentMethod !== "online_banking" &&
    input.paymentMethod !== "cash"
  ) {
    throw new Error("Invalid payment method")
  }

  /*
   * ============================================================
   * VALIDATE PAYMENT AMOUNT
   * ============================================================
   */

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Payment amount must be greater than zero")
  }

  /*
   * ============================================================
   * VALIDATE PAYMENT DATE
   * ============================================================
   */

  if (!input.paymentDate) {
    throw new Error("Payment date is required")
  }

  /*
   * ============================================================
   * VALIDATE REFERENCE NUMBER
   * ============================================================
   *
   * Electronic payments require a reference number.
   * Cash payments are handled by the admin and do not require one.
   */

  const requiresReference =
    input.paymentMethod === "gcash" ||
    input.paymentMethod === "card" ||
    input.paymentMethod === "online_banking"

  if (requiresReference && !input.referenceNumber.trim()) {
    throw new Error("A reference number is required for electronic payments")
  }

  /*
   * ============================================================
   * VALIDATE PAYMENT PROOF
   * ============================================================
   *
   * Proof is required for electronic payments.
   * Cash payments are recorded by the admin.
   */

  if (requiresReference && !input.proofFile) {
    throw new Error("Payment proof is required for electronic payments")
  }

  if (input.proofFile) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ]

    if (!allowedTypes.includes(input.proofFile.type)) {
      throw new Error("Payment proof must be a JPG, PNG, WEBP, or PDF file")
    }

    const maxFileSize = 5 * 1024 * 1024

    if (input.proofFile.size > maxFileSize) {
      throw new Error("Payment proof must not exceed 5 MB")
    }
  }

  /*
   * ============================================================
   * GET ORDER
   * ============================================================
   */

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, customer_id, total_amount, status")
    .eq("id", input.orderId)
    .single()

  if (orderError || !order) {
    throw new Error("Order not found")
  }

  /*
   * ============================================================
   * VERIFY ORDER OWNERSHIP
   * ============================================================
   */

  if (order.customer_id !== profile.id) {
    throw new Error("You are not authorized to submit payment for this order")
  }

  /*
   * ============================================================
   * VERIFY ORDER STATUS
   * ============================================================
   */

  if (order.status !== "approved") {
    throw new Error(
      "Payment can only be submitted after the order has been approved and before production starts"
    )
  }

  /*
   * ============================================================
   * PREVENT DUPLICATE PENDING SUBMISSIONS
   * ============================================================
   */

  const { data: existingSubmission, error: existingError } = await supabase
    .from("order_payment_submissions")
    .select("id")
    .eq("order_id", input.orderId)
    .eq("verification_status", "pending")
    .maybeSingle()

  if (existingError) {
    throw new Error(
      existingError.message || "Failed to check existing payment submission"
    )
  }

  if (existingSubmission) {
    throw new Error(
      "This order already has a payment submission waiting for admin verification"
    )
  }

  /*
   * ============================================================
   * CREATE PAYMENT SUBMISSION
   * ============================================================
   */

  const { data: submission, error: submissionError } = await supabase
    .from("order_payment_submissions")
    .insert({
      order_id: input.orderId,
      amount: input.amount,
      payment_method: input.paymentMethod,
      payment_date: input.paymentDate,
      reference_number: input.referenceNumber.trim() || null,
      notes: input.notes?.trim() || null,
    })
    .select("id")
    .single()

  if (submissionError || !submission) {
    throw new Error(
      submissionError?.message || "Failed to create payment submission"
    )
  }

  /*
   * ============================================================
   * CASH PAYMENT
   * ============================================================
   *
   * Cash payments do not require a proof upload.
   * The admin will handle the actual cash payment recording.
   */

  if (!input.proofFile) {
    return submission
  }

  /*
   * ============================================================
   * UPLOAD PAYMENT PROOF
   * ============================================================
   */

  const fileExtension =
    input.proofFile.name.split(".").pop()?.toLowerCase() || "file"

  const filePath = `${input.orderId}/${submission.id}/proof.${fileExtension}`

  const { error: uploadError } = await supabase.storage
    .from("payment-proofs")
    .upload(filePath, input.proofFile, {
      contentType: input.proofFile.type,
      upsert: false,
    })

  /*
   * ============================================================
   * ROLLBACK IF UPLOAD FAILS
   * ============================================================
   */

  if (uploadError) {
    await supabase
      .from("order_payment_submissions")
      .delete()
      .eq("id", submission.id)

    throw new Error(uploadError.message || "Failed to upload payment proof")
  }

  /*
   * ============================================================
   * SAVE STORAGE PATH
   * ============================================================
   */

const { data: updatedSubmission, error: updateError } =
  await supabase.rpc("attach_payment_proof", {
    p_submission_id: submission.id,
    p_proof_image_path: filePath,
  })

if (updateError || !updatedSubmission) {
  await supabase.storage.from("payment-proofs").remove([filePath])

  await supabase
    .from("order_payment_submissions")
    .delete()
    .eq("id", submission.id)

  throw new Error(
    updateError?.message || "Failed to save payment proof"
  )
}

return updatedSubmission
}
