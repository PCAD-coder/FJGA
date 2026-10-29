"use server"

import { createClient } from "@/lib/supabase/server"

import type { DeliveryType } from "../types/delivery"

import { logActivity } from "../../activity-logs/services/activity-logger.service"

export interface ScheduleDeliveryInput {
  deliveryId: string
  deliveryType?: DeliveryType
  scheduledDate: string | null
  scheduledTime: string | null
  assignedDriver: string | null
  assignedTruck: string | null
  deliveryNotes: string | null
}

export async function scheduleDelivery(input: ScheduleDeliveryInput) {
  const supabase = await createClient()

  const {
    deliveryId,
    deliveryType = "order",
    scheduledDate,
    scheduledTime,
    assignedDriver,
    assignedTruck,
    deliveryNotes,
  } = input

  const updateData = {
    scheduled_date: scheduledDate,
    scheduled_time: scheduledTime,
    assigned_driver: assignedDriver,
    assigned_truck: assignedTruck,
    delivery_notes: deliveryNotes,
  }

  if (deliveryType === "return") {
    const { data, error } = await supabase
      .from("return_deliveries")
      .update(updateData)
      .eq("id", deliveryId)
      .select(
        `
        id,
        return_request_id,
        production_job_id,
        delivery_status,
        scheduled_date,
        scheduled_time,
        assigned_driver,
        assigned_truck,
        delivered_at,
        delivery_notes,
        created_at,
        updated_at,
        return_requests (
          return_number
          )
        `
      )
      .single()

    if (error) {
      throw new Error(error.message || "Failed to schedule return delivery")
    }

    const returnRequest = Array.isArray(data.return_requests)
      ? data.return_requests[0]
      : data.return_requests

    const scheduleDescription =
      data.scheduled_date && data.scheduled_time
        ? `${data.scheduled_date} at ${data.scheduled_time}`
        : data.scheduled_date
          ? data.scheduled_date
          : "No date specified"

    await logActivity({
      action: "Scheduled Return Delivery",
      module: "Returns",
      description: `Scheduled delivery for return request ${
        returnRequest?.return_number ?? "Unknown Return"
      } on ${scheduleDescription}.`,
      severity: "info",
    })

    return data
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
      updated_at,
      orders (
        order_number
      )
      `
    )
    .single()

  if (error) {
    throw new Error(error.message || "Failed to schedule delivery")
  }

  const order = Array.isArray(data.orders) ? data.orders[0] : data.orders

  const scheduleDescription =
    data.scheduled_date && data.scheduled_time
      ? `${data.scheduled_date} at ${data.scheduled_time}`
      : data.scheduled_date
        ? data.scheduled_date
        : "No date specified"

  await logActivity({
    action: "Scheduled Delivery",
    module: "Delivery",
    description: `Scheduled delivery for ${
      order?.order_number ?? "Unknown Order"
    } on ${scheduleDescription}.`,
    severity: "info",
  })

  return data
}
