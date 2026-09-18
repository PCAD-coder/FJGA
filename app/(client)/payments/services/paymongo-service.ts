"use server"

import { createClient } from "@/lib/supabase/server"

interface CreateCheckoutSessionInput {
  orderId: string
}

interface PayMongoCheckoutResponse {
  id: string
  checkoutUrl: string
}

interface PayMongoCheckoutSessionResponse {
  data?: {
    id?: string
    attributes?: {
      status?: string
      checkout_url?: string
    }
  }
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
   * Get authenticated customer.
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
   * Resolve auth.users.id -> profiles.id.
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
   * Load only the customer's order.
   */
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
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
    `)
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
   * Calculate the amount already paid.
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
   * Calculate the exact amount still due.
   */
  const amountDue = Math.max(requiredPayment - amountPaid, 0)

  if (amountDue <= 0) {
    throw new Error(
      "The required production payment has already been completed"
    )
  }

  const amountInCentavos = Math.round(amountDue * 100)

  /*
   * Check for an existing Checkout Session
   * for this order.
   */
  const {
    data: existingSession,
    error: existingSessionError,
  } = await supabase
    .from("paymongo_checkout_sessions")
    .select(`
      id,
      checkout_session_id,
      checkout_url,
      amount,
      status
    `)
    .eq("order_id", order.id)
    .in("status", ["creating", "active"])
    .maybeSingle()

  if (existingSessionError) {
    throw new Error(
      existingSessionError.message ||
        "Failed to check existing payment session"
    )
  }

  /*
   * If an active session already exists for the
   * same amount, reuse it.
   */
  if (
    existingSession &&
    Number(existingSession.amount) === amountDue
  ) {
    /*
     * A session marked "creating" means another
     * request is currently creating the PayMongo
     * Checkout Session.
     */
    if (existingSession.status === "creating") {
      throw new Error(
        "A payment checkout is currently being created. Please try again in a moment."
      )
    }

    /*
     * Verify that the PayMongo session is still active.
     */
    const sessionResponse = await fetch(
      `https://api.paymongo.com/v1/checkout_sessions/${existingSession.checkout_session_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${secretKey}:`
          ).toString("base64")}`,
        },
      }
    )

    if (sessionResponse.ok) {
      const sessionJson =
        (await sessionResponse.json()) as PayMongoCheckoutSessionResponse

      const sessionStatus =
        sessionJson.data?.attributes?.status

      const checkoutUrl =
        sessionJson.data?.attributes?.checkout_url ??
        existingSession.checkout_url

      if (sessionStatus === "active" && checkoutUrl) {
        return {
          id: existingSession.checkout_session_id,
          checkoutUrl,
        }
      }

      /*
       * PayMongo reports that the session is no longer active.
       * Mark our local record as expired so a new one can be created.
       */
      await supabase
        .from("paymongo_checkout_sessions")
        .update({
          status: "expired",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSession.id)
    }
  }

  /*
   * If there is a stale "creating" record,
   * remove it before creating a fresh session.
   */
  if (
    existingSession &&
    existingSession.status === "creating"
  ) {
    await supabase
      .from("paymongo_checkout_sessions")
      .delete()
      .eq("id", existingSession.id)
  }

  /*
   * Reserve the order locally before calling PayMongo.
   *
   * The UNIQUE(order_id) constraint prevents two
   * simultaneous requests from creating two local
   * Checkout Session records.
   */
  const { data: reservation, error: reservationError } =
    await supabase
      .from("paymongo_checkout_sessions")
      .insert({
        order_id: order.id,
        checkout_session_id: `creating-${order.id}-${Date.now()}`,
        checkout_url: "",
        amount: amountDue,
        status: "creating",
      })
      .select("id")
      .single()

  if (reservationError) {
    /*
     * Another request may have created the session
     * between our SELECT and INSERT.
     */
    if (reservationError.code === "23505") {
      throw new Error(
        "A payment checkout is already being created. Please try again in a moment."
      )
    }

    throw new Error(
      reservationError.message ||
        "Failed to reserve payment checkout"
    )
  }

  const firstItem = order.order_items?.[0]

  const productName =
    firstItem?.product_name_snapshot ??
    "Furniture Order"

  /*
   * Create PayMongo Checkout Session.
   */
  let response: Response

  try {
    response = await fetch(
      "https://api.paymongo.com/v2/checkout_sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${secretKey}:`
          ).toString("base64")}`,
          "Content-Type": "application/json",

          /*
           * Protect repeated requests for the same
           * logical payment operation.
           */
          "Idempotency-Key":
            `fjga-order-${order.id}-${amountInCentavos}`,
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

              payment_method_types: [
                "card",
                "gcash",
                "qrph",
              ],

              success_url:
                `${baseUrl}/payments?payment=success&order=${encodeURIComponent(
                  order.id
                )}`,

              cancel_url:
                `${baseUrl}/payments?payment=cancelled&order=${encodeURIComponent(
                  order.id
                )}`,

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
  } catch (error) {
    /*
     * PayMongo request itself failed.
     * Remove the local reservation so the customer
     * can try again.
     */
    await supabase
      .from("paymongo_checkout_sessions")
      .delete()
      .eq("id", reservation.id)

    throw error
  }

  const json = await response.json()

  if (!response.ok) {
    console.error(
      "PAYMONGO CHECKOUT ERROR:",
      json
    )

    await supabase
      .from("paymongo_checkout_sessions")
      .delete()
      .eq("id", reservation.id)

    throw new Error(
      json?.errors?.[0]?.detail ||
        "Failed to create PayMongo checkout session"
    )
  }

  const checkoutSessionId = json?.data?.id
  const checkoutUrl =
    json?.data?.attributes?.checkout_url

  if (!checkoutSessionId || !checkoutUrl) {
    await supabase
      .from("paymongo_checkout_sessions")
      .delete()
      .eq("id", reservation.id)

    throw new Error(
      "PayMongo did not return a valid checkout session"
    )
  }

  /*
   * Save the real PayMongo Checkout Session.
   */
  const { error: updateError } = await supabase
    .from("paymongo_checkout_sessions")
    .update({
      checkout_session_id: checkoutSessionId,
      checkout_url: checkoutUrl,
      amount: amountDue,
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("id", reservation.id)

  if (updateError) {
    console.error(
      "PAYMONGO CHECKOUT SESSION SAVE ERROR:",
      updateError
    )

    /*
     * We do not delete the PayMongo session here because
     * it was successfully created. The database error
     * should be investigated rather than creating another
     * PayMongo session immediately.
     */
    throw new Error(
      "Checkout was created, but could not be saved locally. Please contact support."
    )
  }

  return {
    id: checkoutSessionId,
    checkoutUrl,
  }
}

