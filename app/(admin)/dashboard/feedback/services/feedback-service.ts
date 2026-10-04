import { createClient } from "@/lib/supabase/client"

import type { Feedback, FeedbackStatus } from "../types/feedback"

interface FeedbackQueryResult {
  id: string
  order_id: string
  customer_id: string
  rating: number
  comment: string
  status: FeedbackStatus
  featured: boolean
  admin_reply: string | null
  replied_at: string | null
  created_at: string
  profiles:
    | {
        first_name: string | null
        last_name: string | null
      }
    | {
        first_name: string | null
        last_name: string | null
      }[]
    | null
  orders:
    | {
        order_number: string
        order_items:
          | {
              product_name_snapshot: string
            }[]
          | null
      }
    | {
        order_number: string
        order_items:
          | {
              product_name_snapshot: string
            }[]
          | null
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

function getClientName(
  profile: FeedbackQueryResult["profiles"]
): string {
  const customer = getFirstRelation(profile)

  if (!customer) {
    return "Unknown Client"
  }

  return [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ")
    .trim() || "Unknown Client"
}

function getProjectName(
  orders: FeedbackQueryResult["orders"]
): string {
  const order = getFirstRelation(orders)

  if (!order || !order.order_items?.length) {
    return "Order Project"
  }

  const productNames = order.order_items
    .map((item) => item.product_name_snapshot)
    .filter(Boolean)

  if (productNames.length === 0) {
    return "Order Project"
  }

  return productNames.join(", ")
}

function mapFeedback(row: FeedbackQueryResult): Feedback {
  const order = getFirstRelation(row.orders)

  return {
    id: row.id,

    orderId: row.order_id,
    customerId: row.customer_id,

    clientName: getClientName(row.profiles),

    orderNumber: order?.order_number ?? "Unknown Order",

    projectName: getProjectName(row.orders),

    rating: row.rating,
    comment: row.comment,

    submittedDate: row.created_at,

    status: row.status,

    featured: row.featured,

    adminReply: row.admin_reply,
    repliedAt: row.replied_at,
  }
}

export async function getFeedbacks(): Promise<Feedback[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("feedback")
    .select(`
      id,
      order_id,
      customer_id,
      rating,
      comment,
      status,
      featured,
      admin_reply,
      replied_at,
      created_at,
      profiles!feedback_customer_id_fkey (
        first_name,
        last_name
      ),
      orders!feedback_order_id_fkey (
        order_number,
        order_items (
          product_name_snapshot
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map((row) =>
    mapFeedback(row as FeedbackQueryResult)
  )
}
export async function approveFeedback(
  feedbackId: string
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("feedback")
    .update({
      status: "published",
    })
    .eq("id", feedbackId)

  if (error) {
    throw error
  }
}
export async function archiveFeedback(
  feedbackId: string
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("feedback")
    .update({
      status: "archived",
      featured: false,
    })
    .eq("id", feedbackId)

  if (error) {
    throw error
  }
}
export async function updateFeedbackFeatured(
  feedbackId: string,
  featured: boolean
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from("feedback")
    .update({
      featured,
    })
    .eq("id", feedbackId)

  if (error) {
    throw error
  }
}
export async function replyToFeedback(
  feedbackId: string,
  message: string
): Promise<void> {
  const supabase = createClient()

  const reply = message.trim()

  if (!reply) {
    throw new Error("Reply cannot be empty.")
  }

  const { error } = await supabase
    .from("feedback")
    .update({
      admin_reply: reply,
      replied_at: new Date().toISOString(),
    })
    .eq("id", feedbackId)

  if (error) {
    throw error
  }
}