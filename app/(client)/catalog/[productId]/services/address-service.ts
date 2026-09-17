import { createClient } from "@/lib/supabase/client"

import type {
  CreateOrderAddressInput,
  OrderAddress,
} from "../../types/address"

const supabase = createClient()

export interface PSGCRegion {
  psgc_code: string
  region_name: string
}

export interface PSGCProvince {
  psgc_code: string
  province_name: string
  region_psgc_code: string
}

export interface PSGCCity {
  psgc_code: string
  city_name: string
  locality_type: string
  region_psgc_code: string
  province_psgc_code: string | null
}

export interface PSGCBarangay {
  psgc_code: string
  barangay_name: string
  region_psgc_code: string
  province_psgc_code: string | null
  city_psgc_code: string
}

/**
 * Get all regions.
 */
export async function getRegions(): Promise<PSGCRegion[]> {
  const { data, error } = await supabase
    .from("psgc_regions")
    .select("psgc_code, region_name")
    .order("region_name", { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

/**
 * Get provinces belonging to a region.
 */
export async function getProvinces(
  regionCode: string
): Promise<PSGCProvince[]> {
  if (!regionCode) {
    return []
  }

  const { data, error } = await supabase
    .from("psgc_provinces")
    .select(
      `
        psgc_code,
        province_name,
        region_psgc_code
      `
    )
    .eq("region_psgc_code", regionCode)
    .order("province_name", { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

/**
 * Get cities / municipalities belonging to a province.
 *
 * For NCR and other areas without a province,
 * provinceCode can be null and regionCode is used.
 */
export async function getCities(
  regionCode: string,
  provinceCode?: string | null
): Promise<PSGCCity[]> {
  if (!regionCode) {
    return []
  }

  let query = supabase
    .from("psgc_cities")
    .select(
      `
        psgc_code,
        city_name,
        locality_type,
        region_psgc_code,
        province_psgc_code
      `
    )
    .eq("region_psgc_code", regionCode)

  if (provinceCode) {
    query = query.eq("province_psgc_code", provinceCode)
  } else {
    query = query.is("province_psgc_code", null)
  }

  const { data, error } = await query.order("city_name", {
    ascending: true,
  })

  if (error) {
    throw error
  }

  return data ?? []
}

/**
 * Get barangays belonging to a city / municipality.
 */
export async function getBarangays(cityCode: string): Promise<PSGCBarangay[]> {
  if (!cityCode) {
    return []
  }

  const { data, error } = await supabase
    .from("psgc_barangays")
    .select(
      `
        psgc_code,
        barangay_name,
        region_psgc_code,
        province_psgc_code,
        city_psgc_code
      `
    )
    .eq("city_psgc_code", cityCode)
    .order("barangay_name", { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}
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
