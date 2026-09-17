import { createClient } from "@/lib/supabase/client"

import type {
  PaymentMethod,
  SalesPayment,
  SalesPaymentStatus,
  SalesRecord,
} from "../types/sales"

const supabase = createClient()

function getPaymentStatus(
  totalAmount: number,
  amountPaid: number
): SalesPaymentStatus {
  if (amountPaid <= 0) {
    return "unpaid"
  }

  if (amountPaid >= totalAmount) {
    return "paid"
  }

  return "partial"
}

function mapPayment(payment: any): SalesPayment {
  return {
    id: payment.id,
    orderId: payment.order_id,
    amount: Number(payment.amount ?? 0),
    paymentDate: payment.payment_date,
    paymentMethod: payment.payment_method as PaymentMethod,
    nextPaymentDue: payment.next_payment_due,
    referenceNumber: payment.reference_number,
    receivedByEmployee: payment.received_by_employee,
    notes: payment.notes,
    createdAt: payment.created_at,
    updatedAt: payment.updated_at,
  }
}

export async function getSalesRecords(): Promise<SalesRecord[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      customer_id,
      order_type,
      status,
      total_amount,
      customer_contact_number,
      payment_method,
      created_at,

      profiles (
        id,
        first_name,
        last_name
      ),

      order_payments (
        id,
        order_id,
        amount,
        payment_date,
        payment_method,
        next_payment_due,
        reference_number,
        received_by_employee,
        notes,
        created_at,
        updated_at
      )
    `
    )
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map((order: any) => {
    const profile = Array.isArray(order.profiles)
      ? (order.profiles[0] ?? null)
      : order.profiles

    const payments: SalesPayment[] = Array.isArray(order.order_payments)
      ? order.order_payments.map(mapPayment)
      : []

    const totalAmount = Number(order.total_amount ?? 0)

    const requiredDownPayment = totalAmount * 0.5

    const amountPaid = payments.reduce(
      (total, payment) => total + payment.amount,
      0
    )

    const balance = Math.max(totalAmount - amountPaid, 0)

    const downPaymentRemaining = Math.max(requiredDownPayment - amountPaid, 0)

    const productionPaymentComplete = amountPaid >= requiredDownPayment

    const sortedPayments = [...payments].sort(
      (a, b) =>
        new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    )

    const latestPayment = sortedPayments[0] ?? null

    const customerName = profile
      ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim()
      : "Unknown Customer"

    return {
      orderId: order.id,
      orderNumber: order.order_number,

      customerId: order.customer_id,
      customerName,
      contactNumber: order.customer_contact_number ?? null,

      orderType: order.order_type,
      orderStatus: order.status,

      paymentMethod: order.payment_method as PaymentMethod | null,

      totalAmount,

      requiredDownPayment,

      downPaymentRemaining,

      amountPaid,

      balance,

      productionPaymentComplete,

      paymentStatus: getPaymentStatus(totalAmount, amountPaid),

      lastPaymentDate: latestPayment?.paymentDate ?? null,
      nextPaymentDue: latestPayment?.nextPaymentDue ?? null,

      createdAt: order.created_at,

      payments,
    }
  })
}
