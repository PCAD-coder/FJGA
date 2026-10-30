"use server"


import { createClient } from "@/lib/supabase/server"
import { createOrderServer } from "@/app/(admin)/dashboard/orders/actions/create-order"
import type { OrderAddressFormInput } from "../../types/address"
import type { PaymentMethod } from "@/app/(admin)/dashboard/orders/types/order"

function mapAddressToCreateOrderAddress(address: OrderAddressFormInput) {
  return {
    house_building_number: address.houseBuildingNumber,
    street: address.street,

    building_subdivision: address.buildingSubdivision.trim() || null,

    unit_floor: address.unitFloor.trim() || null,

    region_psgc_code: address.regionPsgcCode,
    region_name: address.regionName,

    province_psgc_code: address.provincePsgcCode,
    province_name: address.provinceName,

    city_psgc_code: address.cityPsgcCode,
    city_name: address.cityName,

    barangay_psgc_code: address.barangayPsgcCode,
    barangay_name: address.barangayName,

    postal_code: address.postalCode.trim() || null,

    landmark: address.landmark.trim() || null,
  }
}

export async function createCustomizedOrder(input: {
  productId: string
  width: number
  height: number
  depth: number
  quantity: number
  notes?: string
  address: OrderAddressFormInput
  customerContactNumber: string
  paymentMethod: PaymentMethod
  aluminumVariantId?: string | null
glassVariantId?: string | null
handleVariantId?: string | null
lockVariantId?: string | null
hingeVariantId?: string | null
rollerVariantId?: string | null
}) {
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 50) {
    throw new Error("Quantity must be a whole number between 1 and 50.")
  }

  if (!/^09[0-9]{9}$/.test(input.customerContactNumber)) {
    throw new Error("Contact number must start with 09 and contain exactly 11 digits.")
  }
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

if (!user) {
  throw new Error("Authentication required")
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
    order_type: "standard",
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
handle_variant_id: input.handleVariantId ?? null,
lock_variant_id: input.lockVariantId ?? null,
hinge_variant_id: input.hingeVariantId ?? null,
roller_variant_id: input.rollerVariantId ?? null,
      },
    ],
  })

  if (result.error) {
    throw new Error(result.error)
  }

return {
  success: true,
}
}
