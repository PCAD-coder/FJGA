import { createClient } from "@/lib/supabase/client"

import type {
  CreateOrderAddressInput,
  OrderAddress,
} from "../../types/address"

export {
  getRegions,
  getProvinces,
  getCities,
  getBarangays,
} from "@/app/services/delivery/psgc-service"

export type {
  PSGCRegion,
  PSGCProvince,
  PSGCCity,
  PSGCBarangay,
} from "@/app/services/delivery/psgc-service"

const supabase = createClient()

/**
 * Save the delivery address for an order.
 */
export async function createOrderAddress(
  input: CreateOrderAddressInput
): Promise<OrderAddress> {
  const { data, error } = await supabase
    .from("order_addresses")
    .insert({
      order_id: input.order_id,

      house_building_number: input.house_building_number,
      street: input.street,
      building_subdivision: input.building_subdivision ?? null,
      unit_floor: input.unit_floor ?? null,

      region_psgc_code: input.region_psgc_code,
      region_name: input.region_name,

      province_psgc_code: input.province_psgc_code ?? null,
      province_name: input.province_name ?? null,

      city_psgc_code: input.city_psgc_code,
      city_name: input.city_name,

      barangay_psgc_code: input.barangay_psgc_code,
      barangay_name: input.barangay_name,

      postal_code: input.postal_code ?? null,
      landmark: input.landmark ?? null,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
