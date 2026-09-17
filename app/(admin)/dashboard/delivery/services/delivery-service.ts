import { createClient } from "@/lib/supabase/server"

export async function getDeliveries() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("deliveries")
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
    `)
    .order("created_at", {
      ascending: false,
    })

  if (error) {
    throw new Error(
      error.message || "Failed to load deliveries"
    )
  }

  console.log(
    "DELIVERY QUERY RESULT:",
    JSON.stringify(data, null, 2)
  )

  return data ?? []
}

export async function getDeliveryDetails(
  deliveryId: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("deliveries")
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
    `)
    .eq("id", deliveryId)
    .maybeSingle()

  if (error) {
    throw new Error(
      error.message ||
        "Failed to load delivery details"
    )
  }

  if (!data) {
    throw new Error(
      "Delivery record not found"
    )
  }

  return data
}