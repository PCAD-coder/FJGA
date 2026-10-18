import { createClient } from "@/lib/supabase/client"
import type { PaymentMethod } from "../types/sales"

const supabase = createClient()

interface RecordPaymentInput {
  orderId: string
  amount: number
  paymentMethod: PaymentMethod
  paymentDate: string
  referenceNumber?: string | null
  receivedByEmployee?: string | null
  notes?: string | null

  /**
   * Required when the admin records a cash/COD payment.
   * The file is uploaded to the private payment-proofs bucket
   * before record_cash_payment() is called.
   */
  proofFile?: File | null
}

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
}

function validatePaymentProof(file: File) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ]

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      "Payment proof must be a JPG, PNG, or WebP image"
    )
  }

  const maxFileSize = 5 * 1024 * 1024

  if (file.size > maxFileSize) {
    throw new Error("Payment proof must not exceed 5 MB")
  }
}

async function recordCashPayment(input: RecordPaymentInput) {
  if (!input.receivedByEmployee?.trim()) {
    throw new Error("Received by employee is required")
  }

  if (!input.proofFile) {
    throw new Error("Payment proof or receipt is required")
  }

  validatePaymentProof(input.proofFile)

  const safeFileName = sanitizeFileName(input.proofFile.name)

  const uniqueFileName =
    `${crypto.randomUUID()}-${safeFileName}`

  const proofImagePath =
    `${input.orderId}/cash/${uniqueFileName}`

  /*
   * Storage and PostgreSQL are separate systems.
   *
   * Upload the receipt first. If the authoritative payment RPC
   * subsequently fails, remove the uploaded object so we do not
   * leave an orphaned payment proof in Storage.
   */
  const { error: uploadError } = await supabase.storage
    .from("payment-proofs")
    .upload(proofImagePath, input.proofFile, {
      cacheControl: "3600",
      upsert: false,
      contentType: input.proofFile.type,
    })

  if (uploadError) {
    throw new Error(
      uploadError.message || "Failed to upload payment proof"
    )
  }

  try {
    const { data, error } = await supabase.rpc(
      "record_cash_payment",
      {
        p_order_id: input.orderId,
        p_amount: input.amount,
        p_payment_date: input.paymentDate
          ? new Date(input.paymentDate).toISOString()
          : new Date().toISOString(),
        p_received_by_employee:
          input.receivedByEmployee.trim(),
        p_proof_image_path: proofImagePath,
        p_notes: input.notes?.trim() || null,
      }
    )

    if (error) {
      throw new Error(
        error.message || "Failed to record cash payment"
      )
    }

    return data
  } catch (error) {
    /*
     * The payment was not successfully recorded, so attempt to
     * clean up the receipt that was uploaded immediately before
     * the RPC call.
     */
    const { error: cleanupError } = await supabase.storage
      .from("payment-proofs")
      .remove([proofImagePath])

    if (cleanupError) {
      console.error(
        "PAYMENT PROOF CLEANUP ERROR:",
        cleanupError
      )
    }

    throw error
  }
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

  /*
   * Cash/COD payments use the protected database RPC because
   * they require an admin-uploaded receipt and authoritative
   * remaining-balance validation.
   */
  if (input.paymentMethod === "cash_on_delivery") {
    return recordCashPayment(input)
  }

  /*
   * Preserve the existing behavior for the other payment methods
   * for now. We will not change unrelated payment flows as part
   * of the cash-receipt implementation.
   */
  const { data, error } = await supabase
    .from("order_payments")
    .insert({
      order_id: input.orderId,
      amount: input.amount,
      payment_method: input.paymentMethod,
      payment_date: input.paymentDate
        ? new Date(input.paymentDate).toISOString()
        : new Date().toISOString(),
      reference_number:
        input.referenceNumber?.trim() || null,
      received_by_employee:
        input.receivedByEmployee?.trim() || null,
      notes: input.notes?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(
      error.message || "Failed to record payment"
    )
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
      error?.message ||
        "Failed to generate payment proof URL"
    )
  }

  return data.signedUrl
}