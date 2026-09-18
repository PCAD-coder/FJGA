"use server"

import { createClient } from "@/lib/supabase/server"

interface CreateCheckoutSessionInput {
  orderId: string
}

interface PayMongoCheckoutResponse {
  id: string
  checkoutUrl: string
}

export async function createPayMongoCheckoutSession(
  input: CreateCheckoutSessionInput
): Promise<PayMongoCheckoutResponse> {
  const secretKey = process.env.PAYMONGO_SECRET_KEY

  if (!secretKey) {
    throw new Error("PayMongo secret key is not configured")
  }

  if (!input.orderId) {
    throw new Error("Order ID is required")
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SITE_URL is not configured")
  }

  const supabase = await createClient()

  /*
   * Get authenticated customer
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

  if (profileError || !profile) {
    throw new Error("Customer profile not found")
  }

  /*
   * Load ONLY the order belonging to the
   * authenticated customer.
   */
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        status,
        total_amount,
        approved_at,

        order_items (
          product_name_snapshot
        ),

        order_payments (
          amount
        )
      `
    )
    .eq("id", input.orderId)
    .eq("customer_id", profile.id)
    .single()

  if (orderError || !order) {
    throw new Error("Order not found")
  }

  /*
   * Payment is only available after
   * administrator approval.
   */
  if (order.status !== "approved") {
    throw new Error(
      "Payment can only be made after the order has been approved"
    )
  }

  /*
   * Calculate the amount already recorded
   * as paid for this order.
   */
  const amountPaid = (order.order_payments ?? []).reduce(
    (sum, payment) => sum + Number(payment.amount ?? 0),
    0
  )

  const totalAmount = Number(order.total_amount ?? 0)

  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    throw new Error("Invalid order total")
  }

  /*
   * FJGA requires 50% of the order total
   * before production can begin.
   */
  const requiredPayment = totalAmount * 0.5

  /*
   * Calculate the exact amount that still
   * needs to be paid.
   */
  const amountDue = Math.max(requiredPayment - amountPaid, 0)

  if (amountDue <= 0) {
    throw new Error(
      "The required production payment has already been completed"
    )
  }

  const firstItem = order.order_items?.[0]

  const productName = firstItem?.product_name_snapshot ?? "Furniture Order"

  const amountInCentavos = Math.round(amountDue * 100)

  /*
   * Create PayMongo Checkout Session.
   */
  const response = await fetch(
    "https://api.paymongo.com/v2/checkout_sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString(
          "base64"
        )}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `fjga-order-${order.id}-${amountInCentavos}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: [
              {
                name: productName,
                amount: amountInCentavos,
                currency: "PHP",
                quantity: 1,
              },
            ],

            payment_method_types: ["card", "gcash", "qrph"],

            success_url: `${baseUrl}/payments?payment=success&order=${encodeURIComponent(order.id)}`,
            cancel_url: `${baseUrl}/payments?payment=cancelled&order=${encodeURIComponent(order.id)}`,

            reference_number: order.order_number,

            metadata: {
              order_id: order.id,
              order_number: order.order_number,
            },

            billing: {
              email: user.email ?? undefined,
            },
          },
        },
      }),
    }
  )

  const json = await response.json()

  if (!response.ok) {
    console.error("PAYMONGO CHECKOUT ERROR:", json)

    throw new Error(
      json?.errors?.[0]?.detail || "Failed to create PayMongo checkout session"
    )
  }

  const checkoutUrl = json?.data?.attributes?.checkout_url

  if (!checkoutUrl) {
    throw new Error("PayMongo did not return a checkout URL")
  }

  return {
    id: json.data.id,
    checkoutUrl,
  }
}
