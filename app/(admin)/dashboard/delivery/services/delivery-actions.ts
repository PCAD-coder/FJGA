"use server"

import { createClient } from "@/lib/supabase/server"

import type { DeliveryStatus } from "../types/delivery"

export async function updateDeliveryStatus(
  deliveryId: string,
  status: DeliveryStatus,
  notes?: string
) {
  const supabase = await createClient()

  /*
   * First get the order_id associated
   * with this delivery.
   */
  const { data: delivery, error: deliveryError } = await supabase
    .from("deliveries")
    .select("order_id")
    .eq("id", deliveryId)
    .single()

  if (deliveryError) {
    throw new Error(deliveryError.message || "Failed to find delivery")
  }

  /*
   * Delivery completion is handled separately by
   * completeDeliveryWithPayment().
   *
   * This prevents a delivery from being marked
   * as delivered without recording the final payment.
   */
  if (status === "delivered") {
    throw new Error("Delivery completion requires recording the final payment.")
  }

  /*
   * Prepare delivery update.
   *
   * Since "delivered" is handled by the dedicated
   * final-payment flow above, this function only
   * updates the non-delivered delivery statuses.
   */
  const updateData: {
    delivery_status: DeliveryStatus
    delivered_at: string | null
    delivery_notes: string | null
  } = {
    delivery_status: status,
    delivered_at: null,
    delivery_notes: notes?.trim() || null,
  }

  /*
   * Update delivery record.
   */
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
   * Keep the related order status synchronized
   * with the delivery status.
   */
  let orderStatus: string | null = null

  if (status === "cancelled") {
    orderStatus = "cancelled"
  } else if (status === "scheduled" || status === "out_for_delivery") {
    orderStatus = "ready_for_delivery"
  }

  /*
   * Update the related order status when necessary.
   */
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

  return data
}
