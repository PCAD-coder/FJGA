"use server"

import { createClient } from "@/lib/supabase/server"

import type { DeliveryStatus, DeliveryType } from "../types/delivery"
import { logActivity } from "../../activity-logs/services/activity-logger.service"
export async function updateDeliveryStatus(
  deliveryId: string,
  status: DeliveryStatus,
  notes?: string,
  deliveryType: DeliveryType = "order"
) {
  const supabase = await createClient()

  if (deliveryType === "return") {
    if (status === "delivered") {
      throw new Error(
        "Return delivery completion must use the return delivery completion flow."
      )
    }

    const { data, error } = await supabase.rpc(
      "update_return_delivery_status",
      {
        p_return_delivery_id: deliveryId,
        p_status: status,
        p_notes: notes?.trim() || null,
      }
    )

    if (error) {
      throw new Error(
        error.message || "Failed to update return delivery status"
      )
    }

    return data
  }

  /*
   * ----------------------------------------------------------
   * NORMAL ORDER DELIVERY
   * ----------------------------------------------------------
   */

  const { data: delivery, error: deliveryError } = await supabase
    .from("deliveries")
    .select(`
      order_id,
      delivery_status,
      orders (
        order_number
      )
    `)
    .eq("id", deliveryId)
    .single()

  if (deliveryError) {
    throw new Error(deliveryError.message || "Failed to find delivery")
  }

  /*
   * Delivery completion is handled separately by
   * completeDeliveryWithPayment().
   */

  if (status === "delivered") {
    throw new Error("Delivery completion requires recording the final payment.")
  }

  const updateData: {
    delivery_status: DeliveryStatus
    delivered_at: string | null
    delivery_notes: string | null
  } = {
    delivery_status: status,
    delivered_at: null,
    delivery_notes: notes?.trim() || null,
  }

  const { data, error } = await supabase
    .from("deliveries")
    .update(updateData)
    .eq("id", deliveryId)
    .select(
      `
      id,
      order_id,
      delivery_status,
      scheduled_date,
      scheduled_time,
      assigned_driver,
      assigned_truck,
      delivered_at,
      delivery_notes,
      created_at,
      updated_at
    `
    )
    .single()

  if (error) {
    throw new Error(error.message || "Failed to update delivery status")
  }

  /*
   * Keep the existing normal order synchronization.
   */

  let orderStatus: string | null = null

  if (status === "cancelled") {
    orderStatus = "cancelled"
  } else if (status === "scheduled" || status === "out_for_delivery") {
    orderStatus = "ready_for_delivery"
  }

 if (orderStatus) {
  const { error: orderError } = await supabase
    .from("orders")
    .update({
      status: orderStatus,
    })
    .eq("id", delivery.order_id)

  if (orderError) {
    throw new Error(
      orderError.message ||
        "Delivery was updated, but the order status could not be synchronized"
    )
  }
}

/*
 * Notify the client only after the delivery and related order
 * have both been successfully updated.
 *
 * Delivered is intentionally excluded here because delivery
 * completion is handled atomically by complete_delivery_with_payment().
 */
if (status === "out_for_delivery") {
  const { error: notificationError } = await supabase.rpc(
    "notify_order_delivery_status",
    {
      p_delivery_id: deliveryId,
      p_status: status,
    }
  )

  if (notificationError) {
    console.error(
      "Failed to create delivery notification:",
      notificationError
    )
  }
}

const order = Array.isArray(delivery.orders)
  ? delivery.orders[0]
  : delivery.orders

const formatStatus = (value: string) =>
  value
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ")

await logActivity({
  action: "Updated Delivery Status",
  module: "Delivery",
  description: `Changed delivery status for ${
    order?.order_number ?? "Unknown Order"
  } from "${formatStatus(
    delivery.delivery_status
  )}" to "${formatStatus(status)}".`,
  severity: status === "cancelled" ? "warning" : "info",
})

return data
}
