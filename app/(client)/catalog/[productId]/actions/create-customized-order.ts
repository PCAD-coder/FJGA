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

export async function createCustomizedOrder(input: {
  productId: string
  width: number
  height: number
  depth: number
  quantity: number
  notes?: string
  address:OrderAddressFormInput
  customerContactNumber: string
  paymentMethod: PaymentMethod
  aluminumVariantId?: string | null
  glassVariantId?: string | null

}) {
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

  const result = await createOrderServer({
    customer_id: profile.id,
    customer_contact_number: input.customerContactNumber.trim(),
    payment_method: input.paymentMethod,
    order_type: "custom",
    notes: input.notes ?? "",
    address: mapAddressToCreateOrderAddress(input.address),
    items: [
      {
        product_id: input.productId,
        quantity: input.quantity,
        width: input.width,
        height: input.height,
        depth: input.depth,
        dimension_unit: "cm",
        aluminum_variant_id: input.aluminumVariantId ?? null,
        glass_variant_id: input.glassVariantId ?? null,
      },
    ],
  })

  if (result.error) {
    throw new Error(result.error)
  }

  redirect("/my-orders")
}