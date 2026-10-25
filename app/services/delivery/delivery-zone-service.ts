import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface DeliveryZoneResult {
  zoneId: string
  zoneName: string
  deliveryFee: number
}
export interface DeliveryLocationCoverage {
  coverageLevel: "region" | "province" | "city"
  isAvailable: boolean
}

export async function getDeliveryLocationCoverage(
  regionPsgcCode: string,
  provincePsgcCode: string | null = null,
  cityPsgcCode: string | null = null
): Promise<DeliveryLocationCoverage | null> {
  const trimmedRegionPsgcCode = regionPsgcCode.trim()
  const trimmedProvincePsgcCode = provincePsgcCode?.trim() || null
  const trimmedCityPsgcCode = cityPsgcCode?.trim() || null

  if (!trimmedRegionPsgcCode) {
    return null
  }

  const { data, error } = await supabase.rpc(
    "get_delivery_location_coverage",
    {
      p_region_psgc_code: trimmedRegionPsgcCode,
      p_province_psgc_code: trimmedProvincePsgcCode,
      p_city_psgc_code: trimmedCityPsgcCode,
    }
  )

  if (error) {
    throw error
  }

  const result = Array.isArray(data) ? data[0] : data

  if (!result) {
    return null
  }

  return {
    coverageLevel: result.coverage_level as
      | "region"
      | "province"
      | "city",
    isAvailable: Boolean(result.is_available),
  }
}

export async function getDeliveryFeeForCity(
  cityPsgcCode: string
): Promise<DeliveryZoneResult | null> {
  if (!cityPsgcCode) {
    return null
  }

  const { data, error } = await supabase
    .from("delivery_zone_cities")
    .select(`
      delivery_zone_id,
      delivery_zones!inner (
        id,
        zone_name,
        delivery_fee,
        is_active
      )
    `)
    .eq("city_psgc_code", cityPsgcCode)
    .eq("delivery_zones.is_active", true)
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data || !data.delivery_zones) {
    return null
  }

  const zone = Array.isArray(data.delivery_zones)
    ? data.delivery_zones[0]
    : data.delivery_zones

  if (!zone) {
    return null
  }

  return {
    zoneId: zone.id,
    zoneName: zone.zone_name,
    deliveryFee: Number(zone.delivery_fee),
  }
}

export async function getDeliveryFeeForAddress(
  cityPsgcCode: string,
  barangayPsgcCode: string
): Promise<DeliveryZoneResult | null> {
  const trimmedCityPsgcCode = cityPsgcCode.trim()
  const trimmedBarangayPsgcCode = barangayPsgcCode.trim()

  if (!trimmedCityPsgcCode || !trimmedBarangayPsgcCode) {
    return null
  }

  const { data, error } = await supabase.rpc(
    "get_delivery_fee_for_address",
    {
      p_city_psgc_code: trimmedCityPsgcCode,
      p_barangay_psgc_code: trimmedBarangayPsgcCode,
    }
  )

  if (error) {
    throw error
  }

  const result = Array.isArray(data) ? data[0] : data

  if (!result) {
    return null
  }

  return {
    zoneId: result.zone_id,
    zoneName: result.zone_name,
    deliveryFee: Number(result.delivery_fee),
  }
}