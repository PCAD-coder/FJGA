import { createClient } from "@/lib/supabase/client"

import type {
  ClientNotification,
  ProjectStatus,
  RecentOrder,
} from "../types/client-dashboard"

const supabase = createClient()

export interface ClientDashboardSummary {
  readyForDelivery: number
  ordersInProduction: number
  totalBalance: number
}
interface RecentOrderQueryResult {
  id: string
  order_number: string
  created_at: string
  status: string
  order_items: {
    id: string
    products:
      | {
          product_name: string | null
        }
      | {
          product_name: string | null
        }[]
      | null
  }[] | null
}

async function getClientProfileId(): Promise<string> {
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

  return profile.id
}

export async function getClientDashboardSummary(): Promise<ClientDashboardSummary> {
  const customerId = await getClientProfileId()

  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select(
      `
        id,
        status,
        total_amount,

        order_payments (
          id,
          amount
        )
      `
    )
    .eq("customer_id", customerId)

  if (ordersError) {
    console.error("CLIENT DASHBOARD ORDERS QUERY ERROR:", {
      message: ordersError.message,
      details: ordersError.details,
      hint: ordersError.hint,
      code: ordersError.code,
    })

    throw new Error(
      ordersError.message || "Failed to load dashboard information"
    )
  }

  let readyForDelivery = 0
  let ordersInProduction = 0
  let totalBalance = 0

  for (const order of orders ?? []) {
    if (order.status === "ready_for_delivery") {
      readyForDelivery += 1
    }

    if (order.status === "in_production") {
      ordersInProduction += 1
    }

    const totalAmount = Number(order.total_amount ?? 0)

    const amountPaid = (order.order_payments ?? []).reduce(
      (sum, payment) => sum + Number(payment.amount ?? 0),
      0
    )

    const remainingBalance = Math.max(totalAmount - amountPaid, 0)

    if (order.status !== "cancelled" && order.status !== "denied") {
      totalBalance += remainingBalance
    }
  }

  return {
    readyForDelivery,
    ordersInProduction,
    totalBalance,
  }
}

export async function getClientProjectStatus(): Promise<
  ProjectStatus[]
> {
  const customerId = await getClientProfileId()

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, status")
    .eq("customer_id", customerId)

  if (error) {
    console.error("CLIENT PROJECT STATUS QUERY ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })

    throw new Error(error.message || "Failed to load project status")
  }

  let completed = 0
  let inProgress = 0
  let pending = 0

  for (const order of orders ?? []) {
    switch (order.status) {
      case "delivered":
        completed += 1
        break

      case "in_production":
      case "ready_for_delivery":
        inProgress += 1
        break

      case "pending":
      case "quoted":
      case "approved":
        pending += 1
        break

      /*
       * Cancelled and denied orders are intentionally
       * excluded from the project status chart.
       */
      case "cancelled":
      case "denied":
        break
    }
  }

  return [
    {
      name: "Completed",
      value: completed,
    },
    {
      name: "In Production",
      value: inProgress,
    },
    {
      name: "Pending",
      value: pending,
    },
  ]
}

function formatOrderStatus(status: string): RecentOrder["status"] {
  switch (status) {
    case "pending":
      return "Pending"

    case "quoted":
      return "Quoted"

    case "approved":
      return "Approved"

    case "in_production":
      return "In Production"

    case "ready_for_delivery":
      return "Ready for Delivery"

    case "delivered":
      return "Delivered"

    case "cancelled":
      return "Cancelled"

    case "denied":
      return "Denied"

    default:
      return "Pending"
  }
}

export async function getClientRecentOrders(): Promise<
  RecentOrder[]
> {
  const customerId = await getClientProfileId()

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        created_at,
        status,

        order_items (
          id,
          products (
            product_name
          )
        )
      `
    )
    .eq("customer_id", customerId)
    .order("created_at", {
      ascending: false,
    })
    .limit(5)

  if (error) {
    console.error(
      "CLIENT RECENT ORDERS QUERY ERROR:",
      {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      }
    )

    throw new Error(
      error.message ||
        "Failed to load recent orders"
    )
  }
  const orders = (data ?? []) as unknown as RecentOrderQueryResult[]

  return (orders ?? []).map((order) => {
    const firstItem = order.order_items?.[0]

    let productName = "Custom Order"

    if (firstItem) {
      const products = firstItem.products

      if (Array.isArray(products)) {
        productName =
          products[0]?.product_name ??
          "Custom Order"
      } else if (products) {
        productName =
          products.product_name ??
          "Custom Order"
      }
    }

    const status = formatOrderStatus(
      order.status
    )

    return {
      id: order.id,

      orderNumber:
        order.order_number,

      productName,

      product: productName,

      date: new Date(
        order.created_at
      ).toLocaleDateString(
        "en-PH",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      ),

      status,
    }
  })
}
export async function getClientRecentNotifications(): Promise<
  ClientNotification[]
> {
  const customerId = await getClientProfileId()

  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
        id,
        type,
        title,
        message,
        link,
        is_read,
        created_at
      `
    )
    .eq("recipient_profile_id", customerId)
    .order("created_at", {
      ascending: false,
    })
    .limit(5)

  if (error) {
    console.error("CLIENT RECENT NOTIFICATIONS QUERY ERROR:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })

    throw new Error(
      error.message || "Failed to load recent notifications"
    )
  }

  return (data ?? []).map((notification) => ({
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    link: notification.link,
    isRead: notification.is_read,
    createdAt: notification.created_at,
  }))
}
