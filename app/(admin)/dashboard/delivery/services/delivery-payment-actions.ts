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
}

export async function completeDeliveryWithPayment(
  input: CompleteDeliveryWithPaymentInput
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  const { data, error } = await supabase.rpc(
    "complete_delivery_with_payment",
    {
      p_delivery_id: input.deliveryId,
      p_payment_amount: input.amount,
      p_payment_method: input.paymentMethod,
      p_payment_date: input.paymentDate
        ? `${input.paymentDate}T00:00:00`
        : null,
      p_reference_number:
        input.referenceNumber,
      p_received_by_employee:
        input.receivedByEmployee,
      p_notes: input.notes,
    }
  )

  if (error) {
    throw new Error(
      error.message ||
        "Failed to complete delivery"
    )
  }

  return data
}