import { createClient } from "@/lib/supabase/client"

import type {
  Order,
  OrderStatus,
  OrderPaymentSubmission,
  PaymentSubmissionStatus,
} from "../types/order"

const supabase = createClient()

function mapOrderStatus(status: string): OrderStatus {
  switch (status) {
    case "pending":
      return "Pending"

    case "quoted":
      return "Quoted"

    case "approved":
      return "Approved"

    case "in_production":
      return "Production"

    case "ready_for_delivery":
      return "Ready for Delivery"

    case "delivered":
      return "Completed"

    case "denied":
      return "Declined"

    case "cancelled":
      return "Cancelled"

    default:
      return "Pending"
  }
}

function formatProductionStage(stage: string | null): string {
  if (!stage) {
    return "Production"
  }

  switch (stage) {
    case "material_prep":
      return "Material Prep"

    case "glass_cutting":
      return "Glass Cutting"

    case "frame_fabrication":
      return "Frame Fabrication"

    case "assembly":
      return "Assembly"

    case "finishing":
      return "Finishing"

    case "quality_check":
      return "Quality Check"

    case "ready_for_delivery":
      return "Ready for Delivery"

    case "pending":
      return "Pending"

    default:
      return stage
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
  }
}

function getCurrentStage(
  status: string,
  productionStage: string | null
): string {
  if (status === "pending") {
    return "Quotation"
  }

  if (status === "quoted") {
    return "Quoted"
  }

  if (status === "approved") {
    return "Approved"
  }

  if (status === "denied") {
    return "Declined"
  }

  if (status === "cancelled") {
    return "Cancelled"
  }

  if (status === "delivered") {
    return "Completed"
  }

  switch (productionStage) {
    case "material_prep":
      return "Material Prep"

    case "glass_cutting":
      return "Glass Cutting"

    case "frame_fabrication":
      return "Frame Fabrication"

    case "assembly":
      return "Assembly"

    case "finishing":
      return "Finishing"

    case "quality_check":
      return "Quality Check"

    case "ready_for_delivery":
      return "Ready for Delivery"

    default:
      return "Production"
  }
}

function getProgressPercentage(
  status: string,
  productionStage: string | null
): number {
  if (status === "pending") return 10
  if (status === "quoted") return 20
  if (status === "approved") return 25
  if (status === "denied") return 0
  if (status === "cancelled") return 0
  if (status === "delivered") return 100

  switch (productionStage) {
    case "material_prep":
      return 35

    case "glass_cutting":
      return 45

    case "frame_fabrication":
      return 60

    case "assembly":
      return 70

    case "finishing":
      return 80

    case "quality_check":
      return 90

    case "ready_for_delivery":
      return 95

    default:
      return 25
  }
}

function getProgress(status: string) {
  const quotation = [
    "quoted",
    "approved",
    "in_production",
    "ready_for_delivery",
    "delivered",
  ].includes(status)

  const production = [
    "in_production",
    "ready_for_delivery",
    "delivered",
  ].includes(status)

  const delivery = ["ready_for_delivery", "delivered"].includes(status)

  const completed = status === "delivered"

  return {
    quotation,
    production,
    delivery,
    completed,
  }
}

function mapPaymentSubmission(submission: any): OrderPaymentSubmission {
  return {
    id: submission.id,
    amount: Number(submission.amount ?? 0),
    paymentMethod: submission.payment_method,
    paymentDate: submission.payment_date,
    referenceNumber: submission.reference_number ?? null,
    proofImagePath: submission.proof_image_path ?? null,
    verificationStatus:
      submission.verification_status as PaymentSubmissionStatus,
    submittedAt: submission.submitted_at,
    verifiedAt: submission.verified_at ?? null,
    rejectionReason: submission.rejection_reason ?? null,
  }
}

function getPaymentDaysRemaining(deadline: string | null): number | null {
  if (!deadline) {
    return null
  }

  const deadlineTime = new Date(deadline).getTime()
  const now = Date.now()

  const difference = deadlineTime - now

  if (difference <= 0) {
    return 0
  }

  return Math.ceil(difference / (1000 * 60 * 60 * 24))
}

export async function getMyOrders(): Promise<Order[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    throw authError
  }

  if (!user) {
    throw new Error("Authentication required")
  }

  /*
   * ============================================================
   * GET CLIENT PROFILE
   * ============================================================
   *
   * orders.customer_id references profiles.id.
   */

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single()

  if (profileError) {
    console.error("PROFILE ERROR:", {
      message: profileError.message,
      details: profileError.details,
      hint: profileError.hint,
      code: profileError.code,
    })

    throw new Error(profileError.message || "Failed to load profile")
  }

  if (!profile) {
    throw new Error("Profile not found")
  }

  /*
   * ============================================================
   * GET ORDERS
   * ============================================================
   */

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        customer_id,
        order_type,
        status,
        subtotal,
        labor_total,
        delivery_fee,
        total_amount,
        notes,
        created_at,
        updated_at,
        approved_at,
        production_stage,
        production_started_at,
        estimated_completion_date,

        order_items (
          id,
          product_id,
          product_name_snapshot,
          quantity,
          width,
          height,
          depth,
          dimension_unit,
          unit_price_snapshot,
          material_subtotal,
          labor_subtotal,
          markup_amount,
          line_total,
          materials_snapshot,
          labor_snapshot
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

  if (error) {
    console.error("MY ORDERS QUERY ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })

    throw new Error(error.message || "Failed to load orders")
  }

  /*
   * ============================================================
   * GET PRODUCTION HISTORY
   * ============================================================
   */

  const orderIds = (data ?? []).map((order) => order.id)

  let historyData: any[] = []

  if (orderIds.length > 0) {
    const { data: history, error: historyError } = await supabase
      .from("order_production_history")
      .select(
        `
          id,
          order_id,
          from_stage,
          to_stage,
          notes,
          changed_at,
          changed_by,
          profiles:changed_by (
            first_name,
            last_name
          )
        `
      )
      .in("order_id", orderIds)
      .order("changed_at", {
        ascending: true,
      })

    if (historyError) {
      console.error("MY ORDERS HISTORY ERROR:", {
        message: historyError.message,
        details: historyError.details,
        hint: historyError.hint,
        code: historyError.code,
      })

      throw new Error(
        historyError.message || "Failed to load production history"
      )
    }

    historyData = history ?? []
  }

  const historyByOrder = new Map<string, any[]>()

  for (const history of historyData) {
    if (!historyByOrder.has(history.order_id)) {
      historyByOrder.set(history.order_id, [])
    }

    historyByOrder.get(history.order_id)!.push(history)
  }

  /*
   * ============================================================
   * BUILD CLIENT ORDERS
   * ============================================================
   */

  const orders: Order[] = []

  for (const order of data ?? []) {
    const item = order.order_items?.[0]

    if (!item) {
      continue
    }

    /*
     * ==========================================================
     * PRODUCT IMAGE
     * ==========================================================
     */

    let image = "/placeholder.jpg"

    if (item.product_id) {
      const { data: productImage } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", item.product_id)
        .order("display_order", {
          ascending: true,
        })
        .limit(1)
        .maybeSingle()

      if (productImage?.image_url) {
        image = productImage.image_url
      }
    }

    /*
     * ==========================================================
     * ORDER STATUS / PROGRESS
     * ==========================================================
     */

    const status = mapOrderStatus(order.status)

    const currentStage = getCurrentStage(order.status, order.production_stage)

    const progressPercentage = getProgressPercentage(
      order.status,
      order.production_stage
    )

    /*
     * ==========================================================
     * PAYMENTS
     * ==========================================================
     */

    const payments = order.order_payments ?? []

    const amountPaid = payments.reduce(
      (total: number, payment: any) => total + Number(payment.amount ?? 0),
      0
    )

    const totalAmount = Number(order.total_amount ?? 0)

    const requiredDownPayment = totalAmount * 0.5

    const remainingDownPayment = Math.max(requiredDownPayment - amountPaid, 0)

    const productionPaymentComplete = amountPaid >= requiredDownPayment

    /*
     * ==========================================================
     * PAYMENT DEADLINE
     * ==========================================================
     */

    const paymentDeadline = order.approved_at
      ? new Date(
          new Date(order.approved_at).getTime() + 7 * 24 * 60 * 60 * 1000
        ).toISOString()
      : null

    const paymentDaysRemaining = getPaymentDaysRemaining(paymentDeadline)

    /*
     * ==========================================================
     * PAYMENT SUBMISSION
     * ==========================================================
     *
     * Prefer the latest pending submission.
     * Otherwise use the most recently created
     * submission.
     */

    const submissions = order.order_payment_submissions ?? []

    const sortedSubmissions = [...submissions].sort(
      (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    const latestPendingSubmission = sortedSubmissions.find(
      (submission: any) => submission.verification_status === "pending"
    )

    const latestSubmission =
      latestPendingSubmission ?? sortedSubmissions[0] ?? null

    /*
     * ==========================================================
     * TIMELINE
     * ==========================================================
     */

    const timeline = (historyByOrder.get(order.id) ?? []).map((history) => {
      const profile = Array.isArray(history.profiles)
        ? history.profiles[0]
        : history.profiles

      const changedBy =
        profile?.first_name || profile?.last_name
          ? `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim()
          : null

      return {
        id: history.id,

        fromStage: history.from_stage
          ? formatProductionStage(history.from_stage)
          : null,

        toStage: formatProductionStage(history.to_stage),

        notes: history.notes ?? null,

        changedAt: history.changed_at,

        changedBy,
      }
    })

    /*
     * ==========================================================
     * FINAL ORDER OBJECT
     * ==========================================================
     */

    orders.push({
      id: order.id,

      orderNumber: order.order_number,

      productName: item.product_name_snapshot,

      image,

      madeToOrder: order.order_type === "custom",

      quantity: Number(item.quantity ?? 0),

      width: item.width !== null ? Number(item.width) : null,

      height: item.height !== null ? Number(item.height) : null,

      depth: item.depth !== null ? Number(item.depth) : null,

      dimensionUnit: item.dimension_unit ?? "cm",

      orderedAt: new Date(order.created_at).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),

      estimatedDelivery: order.estimated_completion_date ?? null,

      total: totalAmount,

      currentStage,

      progressPercentage,

      status,

      progress: getProgress(order.status),

      timeline,

      /*
       * Payment information
       */

      amountPaid,

      requiredDownPayment,

      remainingDownPayment,

      paymentDeadline,

      paymentDaysRemaining,

      productionPaymentComplete,

      paymentSubmission: latestSubmission
        ? mapPaymentSubmission(latestSubmission)
        : null,
    })
  }

  return orders
}
