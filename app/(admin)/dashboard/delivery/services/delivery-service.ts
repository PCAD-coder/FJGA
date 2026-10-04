import { createClient } from "@/lib/supabase/server"

import type {
  DeliveryQueryResult,
  ReturnDeliveryQueryResult,
} from "./delivery-mapper"

import type { GetDeliveriesResult } from "../actions/get-deliveries"

export async function getDeliveries(): Promise<GetDeliveriesResult> {
  const supabase = await createClient()

  const [
    { data: orderDeliveries, error: orderError },
    { data: returnDeliveries, error: returnError },
  ] = await Promise.all([
    supabase
      .from("deliveries")
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
        orders!inner (
          id,
          order_number,
          customer_id,
          delivery_fee,
          total_amount,
          status,
          order_payments (
            amount
          ),
          profiles (
            id,
            first_name,
            last_name
          ),
          order_addresses (
            house_building_number,
            street,
            building_subdivision,
            unit_floor,
            region_name,
            province_name,
            city_name,
            barangay_name,
            postal_code,
            landmark
          ),
          order_items (
            id,
            product_name_snapshot,
            quantity
          )
        )
      `
      )
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("return_deliveries")
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

  return_requests!inner (
    id,
    return_number,
    order_id,
    status,

    return_resolutions (
      id,
      resolution_type
    ),

    orders!inner (
      id,
      order_number,
      customer_id,
      delivery_fee,
      total_amount,
      status,
      order_payments (
        amount
      ),
      profiles (
        id,
        first_name,
        last_name
      ),
      order_addresses (
        house_building_number,
        street,
        building_subdivision,
        unit_floor,
        region_name,
        province_name,
        city_name,
        barangay_name,
        postal_code,
        landmark
      ),
      order_items (
        id,
        product_name_snapshot,
        quantity
      )
    )
  ),

  return_production_jobs (
    id,
    resolution_id,
    return_resolutions (
      resolution_type
    )
  )
  `
      )
      .order("created_at", {
        ascending: false,
      }),
  ])

  if (orderError) {
    throw new Error(orderError.message || "Failed to load order deliveries")
  }

  if (returnError) {
    throw new Error(returnError.message || "Failed to load return deliveries")
  }

  return {
    orderDeliveries: (orderDeliveries ?? []) as DeliveryQueryResult[],
    returnDeliveries: (returnDeliveries ?? []) as ReturnDeliveryQueryResult[],
  }
}

export async function getDeliveryDetails(
  deliveryId: string,
  deliveryType: "order" | "return" = "order"
) {
  const supabase = await createClient()

  if (deliveryType === "return") {
    const { data, error } = await supabase
      .from("return_deliveries")
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

  return_requests!inner (
    id,
    return_number,
    order_id,
    status,

    return_resolutions (
      id,
      resolution_type
    ),

    orders!inner (
      id,
      order_number,
      customer_id,
      delivery_fee,
      total_amount,
      status,
      order_payments (
        amount
      ),
      profiles (
        id,
        first_name,
        last_name
      ),
      order_addresses (
        house_building_number,
        street,
        building_subdivision,
        unit_floor,
        region_name,
        province_name,
        city_name,
        barangay_name,
        postal_code,
        landmark
      ),
      order_items (
        id,
        product_name_snapshot,
        quantity
      )
    )
  ),

  return_production_jobs (
    id,
    resolution_id,
    return_resolutions (
      resolution_type
    )
  )
  `
      )

      .eq("id", deliveryId)
      .maybeSingle()

    if (error) {
      throw new Error(error.message || "Failed to load return delivery details")
    }

    if (!data) {
      throw new Error("Return delivery record not found")
    }

    return data
  }

  const { data, error } = await supabase
    .from("deliveries")
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
      orders!inner (
        id,
        order_number,
        customer_id,
        delivery_fee,
        total_amount,
        status,
        order_payments (
          amount
        ),
        profiles (
          id,
          first_name,
          last_name
        ),
        order_addresses (
          house_building_number,
          street,
          building_subdivision,
          unit_floor,
          region_name,
          province_name,
          city_name,
          barangay_name,
          postal_code,
          landmark
        ),
        order_items (
          id,
          product_name_snapshot,
          quantity
        )
      )
    `
    )
    .eq("id", deliveryId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message || "Failed to load delivery details")
  }

  if (!data) {
    throw new Error("Delivery record not found")
  }

  return data
}
