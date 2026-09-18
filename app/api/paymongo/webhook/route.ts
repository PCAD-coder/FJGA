import crypto from "crypto"

import { createClient } from "@supabase/supabase-js"

interface PayMongoPayment {
  id: string
  attributes?: {
    amount?: number
    currency?: string
    status?: string
    paid_at?: number
    source?: {
      type?: string
    }
  }
}

interface PayMongoCheckoutSession {
  id: string
  attributes?: {
    reference_number?: string | null
    metadata?: {
      order_id?: string
      order_number?: string
    } | null
    payments?: PayMongoPayment[]
  }
}

interface PayMongoWebhookEvent {
  data?: {
    id?: string
    type?: string
    attributes?: {
      type?: string
      livemode?: boolean
      data?: PayMongoCheckoutSession
    }
  }
}

function verifyPayMongoSignature(
  rawBody: string,
  signatureHeader: string,
  webhookSecret: string,
  livemode: boolean
): boolean {
  const parts = signatureHeader.split(",")
  const values: Record<string, string> = {}

  for (const part of parts) {
    const [key, value] = part.split("=")

    if (key && value) {
      values[key.trim()] = value.trim()
    }
  }

  const timestamp = values.t

  if (!timestamp) {
    return false
  }

  const providedSignature = livemode ? values.li : values.te

  if (!providedSignature) {
    return false
  }

  const signedPayload = `${timestamp}.${rawBody}`

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(signedPayload)
    .digest("hex")

  const expectedBuffer = Buffer.from(expectedSignature, "utf8")
  const providedBuffer = Buffer.from(providedSignature, "utf8")

  if (expectedBuffer.length !== providedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(expectedBuffer, providedBuffer)
}

function getPayMongoPaymentMethod(sourceType: string | undefined) {
  switch (sourceType) {
    case "gcash":
      return "gcash" as const

    case "card":
      return "card" as const

    case "qrph":
      return "qrph" as const

    default:
      return null
  }
}

export async function POST(request: Request) {
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("PAYMONGO_WEBHOOK_SECRET is not configured")

    return Response.json(
      { error: "Webhook configuration error" },
      { status: 500 }
    )
  }

  const rawBody = await request.text()

  const signatureHeader = request.headers.get("Paymongo-Signature")

  if (!signatureHeader) {
    return Response.json(
      { error: "Missing PayMongo signature" },
      { status: 401 }
    )
  }

  let event: PayMongoWebhookEvent

  try {
    event = JSON.parse(rawBody)
  } catch {
    return Response.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    )
  }

  const eventId = event.data?.id
  const eventAttributes = event.data?.attributes
  const eventType = eventAttributes?.type
  const livemode = eventAttributes?.livemode ?? false

  console.log("PAYMONGO WEBHOOK EVENT:", {
    eventId,
    eventType,
    livemode,
  })

  if (!eventId) {
    console.error("PAYMONGO WEBHOOK: Missing event ID")

    return Response.json(
      { error: "Missing event ID" },
      { status: 400 }
    )
  }

  const validSignature = verifyPayMongoSignature(
    rawBody,
    signatureHeader,
    webhookSecret,
    livemode
  )

  if (!validSignature) {
    console.error("PAYMONGO WEBHOOK: Invalid signature")

    return Response.json(
      { error: "Invalid PayMongo signature" },
      { status: 401 }
    )
  }

  /*
   * Ignore events that this endpoint does not handle.
   */
  if (eventType !== "checkout_session.payment.paid") {
    console.log(
      "PAYMONGO WEBHOOK: Ignored event",
      eventType
    )

    return Response.json({
      received: true,
      ignored: true,
      eventType,
    })
  }

  /*
   * Supabase service-role client.
   */
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "PAYMONGO WEBHOOK: Supabase server configuration missing"
    )

    return Response.json(
      { error: "Supabase configuration error" },
      { status: 500 }
    )
  }

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  /*
   * Event-level idempotency.
   *
   * If PayMongo sends the exact same event again,
   * we acknowledge it without processing it again.
   */
  const { data: existingEvent, error: existingEventError } =
    await supabase
      .from("paymongo_webhook_events")
      .select("id")
      .eq("event_id", eventId)
      .maybeSingle()

  if (existingEventError) {
    console.error(
      "PAYMONGO WEBHOOK: Event idempotency lookup failed",
      existingEventError
    )

    return Response.json(
      { error: "Webhook event lookup failed" },
      { status: 500 }
    )
  }

  if (existingEvent) {
    console.log(
      "PAYMONGO WEBHOOK: Duplicate event ignored",
      eventId
    )

    return Response.json({
      received: true,
      duplicate: true,
      eventId,
    })
  }

  /*
   * Get the checkout session.
   */
  const session = eventAttributes?.data

  if (!session?.id) {
    console.error(
      "PAYMONGO WEBHOOK: Missing checkout session"
    )

    return Response.json(
      { error: "Missing checkout session" },
      { status: 400 }
    )
  }

  const sessionAttributes = session.attributes

  /*
   * Find the successful payment inside the checkout session.
   */
  const payment = sessionAttributes?.payments?.find(
    (item) => item.attributes?.status === "paid"
  )

  if (!payment?.id) {
    console.error(
      "PAYMONGO WEBHOOK: Missing successful payment"
    )

    return Response.json(
      { error: "Missing payment" },
      { status: 400 }
    )
  }

  const paymentAttributes = payment.attributes

  const paymentMethod = getPayMongoPaymentMethod(
    paymentAttributes?.source?.type
  )

  if (!paymentMethod) {
    console.error(
      "PAYMONGO WEBHOOK: Unsupported payment method",
      paymentAttributes?.source?.type
    )

    return Response.json(
      { error: "Unsupported payment method" },
      { status: 400 }
    )
  }

  /*
   * Resolve FJGA order information from PayMongo metadata.
   */
  const metadata = sessionAttributes?.metadata

  const orderId = metadata?.order_id

  const orderNumber =
    metadata?.order_number ??
    sessionAttributes?.reference_number

  if (!orderId) {
    console.error(
      "PAYMONGO WEBHOOK: Missing order_id metadata",
      {
        eventId,
        sessionId: session.id,
        orderNumber,
      }
    )

    return Response.json(
      { error: "Missing order information" },
      { status: 400 }
    )
  }

  /*
   * Convert PayMongo centavos into PHP.
   */
  const amountInCentavos = Number(
    paymentAttributes?.amount ?? 0
  )

  const amount = amountInCentavos / 100

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    console.error(
      "PAYMONGO WEBHOOK: Invalid payment amount",
      amountInCentavos
    )

    return Response.json(
      { error: "Invalid payment amount" },
      { status: 400 }
    )
  }

  /*
   * Prevent duplicate payment records.
   *
   * This remains in addition to event-level
   * webhook idempotency.
   */
  const {
    data: existingPayment,
    error: existingPaymentError,
  } = await supabase
    .from("order_payments")
    .select("id")
    .eq("paymongo_payment_id", payment.id)
    .maybeSingle()

  if (existingPaymentError) {
    console.error(
      "PAYMONGO WEBHOOK: Payment idempotency lookup failed",
      existingPaymentError
    )

    return Response.json(
      { error: "Payment lookup failed" },
      { status: 500 }
    )
  }

  if (existingPayment) {
    console.log(
      "PAYMONGO WEBHOOK: Duplicate payment ignored",
      payment.id
    )

    /*
     * The payment already exists, so the webhook
     * can safely be marked as processed.
     */
    const { error: eventRecordError } = await supabase
      .from("paymongo_webhook_events")
      .insert({
        event_id: eventId,
        event_type: eventType,
        livemode,
      })

    if (
      eventRecordError &&
      eventRecordError.code !== "23505"
    ) {
      console.error(
        "PAYMONGO WEBHOOK: Failed to record duplicate event",
        eventRecordError
      )
    }

    return Response.json({
      received: true,
      duplicate: true,
      paymentId: payment.id,
      eventId,
    })
  }

  /*
   * Confirm that the order exists.
   */
  const { data: order, error: orderError } =
    await supabase
      .from("orders")
      .select(
        "id, order_number, status, total_amount"
      )
      .eq("id", orderId)
      .single()

  if (orderError || !order) {
    console.error(
      "PAYMONGO WEBHOOK: Order not found",
      {
        orderId,
        orderNumber,
        error: orderError,
      }
    )

    return Response.json(
      { error: "Order not found" },
      { status: 404 }
    )
  }

  /*
   * Make sure the PayMongo payment belongs
   * to the expected FJGA order.
   */
  if (order.order_number !== orderNumber) {
    console.error(
      "PAYMONGO WEBHOOK: Order reference mismatch",
      {
        orderId,
        databaseOrderNumber: order.order_number,
        paymongoOrderNumber: orderNumber,
      }
    )

    return Response.json(
      { error: "Order reference mismatch" },
      { status: 400 }
    )
  }

  /*
   * Record the verified PayMongo payment.
   */
  const {
    data: insertedPayment,
    error: insertError,
  } = await supabase
    .from("order_payments")
    .insert({
      order_id: order.id,
      amount,
      payment_date: new Date().toISOString(),
      payment_method: paymentMethod,
      reference_number: payment.id,
      notes:
        `PayMongo payment received. Checkout session: ${session.id}`,
      received_by_employee: null,
      paymongo_payment_id: payment.id,
      paymongo_checkout_session_id: session.id,
    })
    .select("id")
    .single()

  if (insertError) {
    /*
     * A duplicate can happen if two webhook
     * deliveries race each other.
     */
    if (insertError.code === "23505") {
      console.log(
        "PAYMONGO WEBHOOK: Duplicate payment detected",
        payment.id
      )

      /*
       * The payment already exists, so it is safe
       * to mark the webhook event as processed.
       */
      const { error: eventRecordError } =
        await supabase
          .from("paymongo_webhook_events")
          .insert({
            event_id: eventId,
            event_type: eventType,
            livemode,
          })

      if (
        eventRecordError &&
        eventRecordError.code !== "23505"
      ) {
        console.error(
          "PAYMONGO WEBHOOK: Failed to record duplicate event",
          eventRecordError
        )
      }

      return Response.json({
        received: true,
        duplicate: true,
        paymentId: payment.id,
        eventId,
      })
    }

    console.error(
      "PAYMONGO WEBHOOK: Payment insert failed",
      insertError
    )

    /*
     * Do NOT mark the event as processed here.
     *
     * PayMongo can retry the event because the payment
     * was not successfully recorded.
     */
    return Response.json(
      { error: "Failed to record payment" },
      { status: 500 }
    )
  }
  /*
 * Mark the local checkout session as paid.
 *
 * The payment has already been successfully recorded,
 * so the local active checkout session is no longer payable.
 */
const { error: checkoutSessionUpdateError } = await supabase
  .from("paymongo_checkout_sessions")
  .update({
    status: "paid",
    updated_at: new Date().toISOString(),
  })
  .eq("checkout_session_id", session.id)

if (checkoutSessionUpdateError) {
  console.error(
    "PAYMONGO WEBHOOK: Failed to update checkout session status",
    checkoutSessionUpdateError
  )
}

  /*
   * The payment was successfully recorded.
   *
   * Now record the PayMongo event itself as processed.
   */
  const { error: eventRecordError } = await supabase
    .from("paymongo_webhook_events")
    .insert({
      event_id: eventId,
      event_type: eventType,
      livemode,
    })

  if (
    eventRecordError &&
    eventRecordError.code !== "23505"
  ) {
    /*
     * The payment already exists, so a later retry
     * will still be protected by paymongo_payment_id.
     *
     * Log this rather than treating the successful
     * payment as failed.
     */
    console.error(
      "PAYMONGO WEBHOOK: Failed to record event",
      eventRecordError
    )
  }

  console.log(
    "PAYMONGO PAYMENT RECORDED",
    {
      eventId,
      paymentId: payment.id,
      checkoutSessionId: session.id,
      orderId: order.id,
      amount,
      paymentMethod,
      orderPaymentId: insertedPayment.id,
    }
  )

  return Response.json({
    received: true,
    paymentRecorded: true,
    eventId,
  })
}

