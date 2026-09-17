"use server"

import { createClient } from "@/lib/supabase/server"

export interface ScheduleDeliveryInput {
  deliveryId: string
  scheduledDate: string | null
  scheduledTime: string | null
  assignedDriver: string | null
  assignedTruck: string | null
  deliveryNotes: string | null
}

export async function scheduleDelivery(
  input: ScheduleDeliveryInput
) {
  const supabase = await createClient()

  const {
    deliveryId,
    scheduledDate,
    scheduledTime,
    assignedDriver,
    assignedTruck,
    deliveryNotes,
  } = input

  const { data, error } = await supabase
    .from("deliveries")
    .update({
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      assigned_driver: assignedDriver,
      assigned_truck: assignedTruck,
      delivery_notes: deliveryNotes,
    })
    .eq("id", deliveryId)
    .select(`
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
    `)
    .single()

  if (error) {
    throw new Error(
      error.message ||
        "Failed to schedule delivery"
    )
  }

  return data
}