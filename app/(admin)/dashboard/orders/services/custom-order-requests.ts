import { createClient } from "@/lib/supabase/client"
import type { CustomOrder, Quotation } from "../types/custom-order"

const supabase = createClient()

export async function getCustomOrderRequests(): Promise<CustomOrder[]> {
  const { data, error } = await supabase
    .from("custom_order_requests")
    .select(
      `
        *,
        profiles (
          id,
          full_name
        )
      `
    )
    .order("created_at", {
      ascending: false,
    })

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    customerId: row.customer_id,
    clientName: row.profiles?.full_name ?? "Unknown Client",
    projectName: row.project_name,
    image: row.image_url,
    width: row.width,
    height: row.height,
    notes: row.notes,
    status: row.status,
    quotation: (row.quotation as Quotation | null) ?? undefined,
    denialReason: row.denial_reason,
    submittedAt: new Date(row.created_at).toLocaleDateString(),
  }))
}

export async function saveQuotation(requestId: string, quotation: Quotation) {
  const { error } = await supabase
    .from("custom_order_requests")
    .update({
      quotation,
      status: "quoted",
    })
    .eq("id", requestId)

  if (error) throw error
}

export async function denyCustomOrderRequest(
  requestId: string,
  reason: string
) {
  const { error } = await supabase
    .from("custom_order_requests")
    .update({
      status: "denied",
      denial_reason: reason,
    })
    .eq("id", requestId)

  if (error) throw error
}

/**
 * Approves a custom request.
 *
 * For now this only updates the request status.
 *
 * In the next step we will also create an
 * official order in the orders and order_items tables.
 */

async function generateOrderNumber() {
  const supabase = createClient()

  const { count } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  const nextNumber = (count ?? 0) + 1

  return `ORD-${String(nextNumber).padStart(6, "0")}`
}
export async function approveCustomOrderRequest(id: string) {
  const supabase = createClient()

  const { data: request, error: requestError } = await supabase
    .from("custom_order_requests")
    .select("*")
    .eq("id", id)
    .single()

  if (requestError) throw requestError

  if (!request.quotation) {
    throw new Error("Quotation must be generated first.")
  }

  const orderNumber = await generateOrderNumber()

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_id: request.customer_id,
      order_type: "custom",
      status: "pending",
      total_amount: request.quotation,

      source_request_id: request.id,
    })
    .select()
    .single()

  if (orderError) throw orderError

  const { error: itemError } = await supabase.from("order_items").insert({
    order_id: order.id,

    product_id: null,

    product_name_snapshot: request.project_name,

    quantity: 1,

    unit_price_snapshot: request.quotation,

    line_total: request.quotation,

    material_snapshot: [],

    labor_snapshot: [],
  })

  if (itemError) throw itemError

  const { error: approveError } = await supabase
    .from("custom_order_requests")
    .update({
      status: "approved",
    })
    .eq("id", id)

  if (approveError) throw approveError

  return order
}
