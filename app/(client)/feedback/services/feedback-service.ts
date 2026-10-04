import { createClient } from "@/lib/supabase/client"

import type {
  Feedback,
  FeedbackOrder,
} from "../types/feedback"

interface FeedbackQueryResult {
  id: string
  order_id: string
  rating: number
  comment: string
  status: "pending" | "published" | "archived"
  featured: boolean
  admin_reply: string | null
  replied_at: string | null
  created_at: string

  orders:
    | {
        order_number: string
        created_at: string
        order_items:
          | {
              product_name_snapshot: string
            }[]
          | null
      }
    | {
        order_number: string
        created_at: string
        order_items:
          | {
              product_name_snapshot: string
            }[]
          | null
      }[]
    | null
}

interface DeliveredOrderQueryResult {
  id: string
  order_number: string
  created_at: string

  order_items:
    | {
        product_name_snapshot: string
      }[]
    | null
}

function getFirstRelation<T>(
  relation: T | T[] | null
): T | null {
  if (Array.isArray(relation)) {
    return relation[0] ?? null
  }

  return relation
}

function getProjectName(
  orderItems:
    | {
        product_name_snapshot: string
      }[]
    | null
): string {
  if (!orderItems?.length) {
    return "Order Project"
  }

  const names = orderItems
    .map((item) => item.product_name_snapshot)
    .filter(Boolean)

  return names.length > 0
    ? names.join(", ")
    : "Order Project"
}

export async function getCustomerFeedbacks(): Promise<Feedback[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("feedback")
    .select(`
      id,
      order_id,
      rating,
      comment,
      status,
      featured,
      admin_reply,
      replied_at,
      created_at,
      orders!feedback_order_id_fkey (
        order_number,
        created_at,
        order_items (
          product_name_snapshot
        )
      )
    `)
    .order("created_at", {
      ascending: false,
    })

  if (error) {
    throw error
  }

  return (data ?? []).map(
    (row) => {
      const feedback =
        row as unknown as FeedbackQueryResult

      const order = getFirstRelation(feedback.orders)

      return {
        id: feedback.id,

        orderId: feedback.order_id,

        orderNumber:
          order?.order_number ?? "Unknown Order",

        projectName: getProjectName(
          order?.order_items ?? null
        ),

        rating: feedback.rating,

        comment: feedback.comment,

        submittedDate: feedback.created_at,

        status: feedback.status,

        featured: feedback.featured,

        adminReply: feedback.admin_reply,

        repliedAt: feedback.replied_at,
      }
    }
  )
}

export async function getOrdersAwaitingFeedback(): Promise<
  FeedbackOrder[]
> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      created_at,
      order_items (
        product_name_snapshot
      )
    `)
    .eq("status", "delivered")
    .order("created_at", {
      ascending: false,
    })

  if (error) {
    throw error
  }

  const deliveredOrders =
    (data ?? []) as unknown as DeliveredOrderQueryResult[]

  const { data: feedbackData, error: feedbackError } =
    await supabase
      .from("feedback")
      .select("order_id")

  if (feedbackError) {
    throw feedbackError
  }

  const feedbackOrderIds = new Set(
    (feedbackData ?? []).map(
      (feedback) => feedback.order_id
    )
  )

  return deliveredOrders
    .filter(
      (order) => !feedbackOrderIds.has(order.id)
    )
    .map((order) => ({
      id: order.id,

      orderNumber: order.order_number,

      projectName: getProjectName(
        order.order_items
      ),

      deliveredDate: order.created_at,
    }))
}
export async function submitFeedback(input: {
  orderId: string
  rating: number
  comment: string
}): Promise<void> {
  const supabase = createClient()

  if (
    !Number.isInteger(input.rating) ||
    input.rating < 1 ||
    input.rating > 5
  ) {
    throw new Error("Rating must be between 1 and 5 stars.")
  }

  const comment = input.comment.trim()

  if (!comment) {
    throw new Error("Please enter your feedback.")
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    throw authError
  }

  if (!user) {
    throw new Error("Authentication required.")
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .single()

  if (profileError || !profile) {
    throw new Error("Customer profile not found.")
  }

  const { error } = await supabase
    .from("feedback")
    .insert({
      order_id: input.orderId,
      customer_id: profile.id,
      rating: input.rating,
      comment,
    })

  if (error) {
    throw error
  }
}