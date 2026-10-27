"use server"

import { createClient } from "@/lib/supabase/server"

import type { PaymentMethod } from "@/app/(admin)/dashboard/sales/types/sales"

interface CompleteDeliveryWithPaymentInput {
  deliveryId: string
  amount: number
  paymentMethod: PaymentMethod
  paymentDate: string
  referenceNumber: string | null
  receivedByEmployee: string | null
  notes: string | null
  proofFile?: File | null
}
interface CompleteDeliveryWithPaymentResult {
  receipt_id: string
  receipt_number: string
  receipt_payment_status: string
  receipt_email_status: string
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

function parseCompleteDeliveryResult(
  data: unknown
): CompleteDeliveryWithPaymentResult {
  if (
    !data ||
    typeof data !== "object" ||
    !("receipt_id" in data) ||
    !("receipt_number" in data) ||
    !("receipt_payment_status" in data) ||
    !("receipt_email_status" in data)
  ) {
    throw new Error(
      "Delivery completed, but the official receipt result was not returned correctly."
    )
  }

  const receiptId = data.receipt_id
  const receiptNumber = data.receipt_number
  const receiptPaymentStatus =
    data.receipt_payment_status
  const receiptEmailStatus =
    data.receipt_email_status

  if (
    typeof receiptId !== "string" ||
    typeof receiptNumber !== "string" ||
    typeof receiptPaymentStatus !== "string" ||
    typeof receiptEmailStatus !== "string"
  ) {
    throw new Error(
      "Delivery completed, but the official receipt result was invalid."
    )
  }

  return {
    receipt_id: receiptId,
    receipt_number: receiptNumber,
    receipt_payment_status: receiptPaymentStatus,
    receipt_email_status: receiptEmailStatus,
  }
}

export async function completeDeliveryWithPayment(
  input: CompleteDeliveryWithPaymentInput
): Promise<CompleteDeliveryWithPaymentResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  /*
   * Electronic payments do not use an uploaded cash receipt.
   */
  if (input.paymentMethod !== "cash_on_delivery") {
    const { data, error } = await supabase.rpc(
      "complete_delivery_with_payment",
      {
        p_delivery_id: input.deliveryId,
        p_payment_amount: input.amount,
        p_payment_method: input.paymentMethod,
        p_payment_date: input.paymentDate
          ? `${input.paymentDate}T00:00:00`
          : null,
        p_reference_number: input.referenceNumber,
        p_received_by_employee: input.receivedByEmployee,
        p_notes: input.notes,
        p_proof_image_path: null,
      }
    )

    if (error) {
      throw new Error(
        error.message || "Failed to complete delivery"
      )
    }

    return parseCompleteDeliveryResult(data)
  }

  /*
   * Cash payments require both the receiving employee and an
   * uploaded proof/receipt.
   */
  if (!input.receivedByEmployee?.trim()) {
    throw new Error(
      "Employee name is required for cash payments"
    )
  }

  if (!input.proofFile) {
    throw new Error(
      "Payment proof or receipt is required for cash payments"
    )
  }

  validatePaymentProof(input.proofFile)

  /*
   * Resolve the authoritative order ID from the delivery rather
   * than accepting an order ID supplied by the browser.
   */
  const { data: delivery, error: deliveryError } = await supabase
    .from("deliveries")
    .select("order_id")
    .eq("id", input.deliveryId)
    .single()

  if (deliveryError || !delivery?.order_id) {
    throw new Error(
      deliveryError?.message ||
        "Failed to resolve the delivery order"
    )
  }

  const safeFileName = sanitizeFileName(input.proofFile.name)

  const uniqueFileName =
    `${crypto.randomUUID()}-${safeFileName}`

  const proofImagePath =
    `${delivery.order_id}/cash/${uniqueFileName}`

  /*
   * Storage and PostgreSQL are separate systems.
   *
   * Upload the proof first. If the authoritative delivery RPC
   * fails afterward, remove the uploaded object so an orphaned
   * receipt is not left in Storage.
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
      uploadError.message ||
        "Failed to upload payment proof"
    )
  }

  try {
    const { data, error } = await supabase.rpc(
      "complete_delivery_with_payment",
      {
        p_delivery_id: input.deliveryId,
        p_payment_amount: input.amount,
        p_payment_method: input.paymentMethod,
        p_payment_date: input.paymentDate
          ? `${input.paymentDate}T00:00:00`
          : null,
        p_reference_number: null,
        p_received_by_employee:
          input.receivedByEmployee.trim(),
        p_notes: input.notes,
        p_proof_image_path: proofImagePath,
      }
    )

    if (error) {
      throw new Error(
        error.message || "Failed to complete delivery"
      )
    }

    return parseCompleteDeliveryResult(data)
  } catch (error) {
    /*
     * The database transaction did not complete, so clean up the
     * proof that was uploaded immediately before the RPC call.
     */
    const { error: cleanupError } = await supabase.storage
      .from("payment-proofs")
      .remove([proofImagePath])

    if (cleanupError) {
      console.error(
        "DELIVERY PAYMENT PROOF CLEANUP ERROR:",
        cleanupError
      )
    }

    throw error
  }
}

interface CompleteReturnDeliveryInput {
  deliveryId: string
  deliveryDate: string
  notes: string | null
}

export async function completeReturnDelivery(
  input: CompleteReturnDeliveryInput
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  const { data, error } = await supabase.rpc(
    "complete_return_delivery",
    {
      p_return_delivery_id: input.deliveryId,
      p_delivery_date: input.deliveryDate
        ? `${input.deliveryDate}T00:00:00`
        : null,
      p_notes: input.notes,
    }
  )

  if (error) {
    throw new Error(
      error.message || "Failed to complete return delivery"
    )
  }

  return data
}