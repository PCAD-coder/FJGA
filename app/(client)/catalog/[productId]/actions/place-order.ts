"use server"

import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

import { createOrderServer } from "@/app/(admin)/dashboard/orders/actions/create-order"
import type { OrderAddressFormInput } from "../../types/address"
import type { PaymentMethod } from "@/app/(admin)/dashboard/orders/types/order"

function mapAddressToCreateOrderAddress(
  address: OrderAddressFormInput
) {
  return {
    house_building_number: address.houseBuildingNumber,
    street: address.street,

    building_subdivision:
      address.buildingSubdivision.trim() || null,

    unit_floor:
      address.unitFloor.trim() || null,

    region_psgc_code: address.regionPsgcCode,
    region_name: address.regionName,

    province_psgc_code: address.provincePsgcCode,
    province_name: address.provinceName,

    city_psgc_code: address.cityPsgcCode,
    city_name: address.cityName,

    barangay_psgc_code: address.barangayPsgcCode,
    barangay_name: address.barangayName,

    postal_code:
      address.postalCode.trim() || null,

    landmark:
      address.landmark.trim() || null,
  }
}

export async function placeProductOrder(
  productId: string,
  quantity: number,
  address: OrderAddressFormInput,
  customerContactNumber: string,
  paymentMethod: PaymentMethod,
  notes?: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }
  const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("id")
  .eq("auth_user_id", user.id)
  .single()

if (profileError || !profile) {
  throw new Error("Profile not found")
}

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
        id,
        product_name,
        width,
        height,
        depth
      `
    )
    .eq("id", productId)
    .single()

  if (error || !product) {
    throw new Error("Product not found")
  }

  const result = await createOrderServer({
  customer_id: profile.id,
  customer_contact_number: customerContactNumber.trim(),
  payment_method: paymentMethod,
  order_type: "standard",
  notes: notes ?? "",
  address: mapAddressToCreateOrderAddress(address),
  items: [
    {
      product_id: product.id,
      quantity,

      width: product.width,
      height: product.height,
      depth: product.depth,

      dimension_unit: "cm",
    },
  ],
})

  redirect("/my-orders")
}