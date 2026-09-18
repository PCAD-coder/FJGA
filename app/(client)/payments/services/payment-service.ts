import { createClient } from "@/lib/supabase/client"

import type { Invoice, PaymentHistory, PaymentSummary } from "../types/payment"

const supabase = createClient()

function formatPaymentMethod(method: string): string {
  switch (method) {
    case "gcash":
      return "GCash"
    case "online_banking":
      return "Online Banking"
    case "card":
      return "Card"
    case "cash":
    case "cash_on_delivery":
      return "Cash"
    default:
      return method
  }
}

function formatDate(date: string | null): string {
  if (!date) return "—"

  return new Date(date).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export interface PaymentPageData {
  summary: PaymentSummary
  invoices: Invoice[]
  history: PaymentHistory[]
}

export async function getPaymentPageData(): Promise<PaymentPageData> {
  /*
   * Get authenticated user
   */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    throw new Error(authError.message)
  }

  if (!user) {
    throw new Error("Authentication required")
  }

  /*
   * Resolve auth.users.id -> profiles.id
   *
   * orders.customer_id references profiles.id.
   */
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single()

  if (profileError) {
    throw new Error(profileError.message || "Failed to load customer profile")
  }

  if (!profile) {
    throw new Error("Customer profile not found")
  }

  /*
   * Get ONLY this client's orders.
   */
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        status,
        total_amount,
        approved_at,
        created_at,

        order_items (
          id,
          product_name_snapshot,
          quantity,
          line_total
        ),

        order_payments (
          id,
          amount,
          payment_method,
          payment_date,
          reference_number,
          notes,
          created_at
        ),

        order_payment_submissions (
          id,
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
          updated_at
        )
      `
    )
    .eq("customer_id", profile.id)
    .order("created_at", { ascending: false })

  if (ordersError) {
    console.error("PAYMENTS ORDERS QUERY ERROR:", {
      message: ordersError.message,
      details: ordersError.details,
      hint: ordersError.hint,
      code: ordersError.code,
    })

    throw new Error(ordersError.message || "Failed to load payment information")
  }

  const invoices: Invoice[] = []
  const history: PaymentHistory[] = []

  let totalPending = 0
  let paidThisMonth = 0

  const now = new Date()

  for (const order of orders ?? []) {
    const payments = order.order_payments ?? []

    /*
     * Calculate the amount that has actually been recorded
     * as paid for this order.
     */
    const amountPaid = payments.reduce(
      (sum, payment) => sum + Number(payment.amount ?? 0),
      0
    )

    const totalAmount = Number(order.total_amount ?? 0)

    const paidAmount = (order.order_payments ?? []).reduce(
      (sum, payment) => sum + Number(payment.amount ?? 0),
      0
    )

    // 50% of the order total is required before production can start.
    const requiredPayment = totalAmount * 0.5

    const remainingAmount = Math.max(totalAmount - amountPaid, 0)

    // Only show the amount still needed to reach the 50% requirement.
    const remainingPayment = Math.max(requiredPayment - paidAmount, 0)

    /*
     * Payment deadline:
     * 7 days after admin approval.
     */
    const dueDate = order.approved_at
      ? new Date(
          new Date(order.approved_at).getTime() + 7 * 24 * 60 * 60 * 1000
        )
      : null

    /*
     * Only approved orders with an outstanding balance
     * are displayed as invoices requiring payment.
     */
    if (order.status === "approved" && remainingPayment > 0) {
      const firstItem = order.order_items?.[0]

      let status: Invoice["status"] = "Pending"

      if (dueDate && dueDate.getTime() < now.getTime()) {
        status = "Overdue"
      } else if (amountPaid > 0) {
        status = "Partial"
      }

      invoices.push({
        invoiceId: order.order_number,
        orderId: order.id,
        orderNumber: order.order_number,
        productName: firstItem?.product_name_snapshot ?? "Furniture Order",
        dueDate: formatDate(dueDate?.toISOString() ?? null),
        amountDue: remainingPayment,
        status,
      })

      totalPending += remainingAmount
    }

    /*
     * Convert actual recorded payments into payment history.
     */
    for (const payment of payments) {
      const paymentAmount = Number(payment.amount ?? 0)

      const paymentDate = new Date(payment.payment_date)

      if (
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear()
      ) {
        paidThisMonth += paymentAmount
      }

      history.push({
        paymentId: payment.id,
        invoiceId: order.order_number,
        amount: paymentAmount,
        method: formatPaymentMethod(payment.payment_method),
        paymentDate: formatDate(payment.payment_date),
        status: "Completed",
      })
    }
  }

  /*
   * Newest payment first.
   */
  history.sort((a, b) => {
    return new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
  })

  const summary: PaymentSummary = {
    totalPending,
    paidThisMonth,
    outstandingInvoices: invoices.length,
  }

  return {
    summary,
    invoices,
    history,
  }
}
