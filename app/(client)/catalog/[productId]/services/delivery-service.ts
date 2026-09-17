import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface DeliveryZoneResult {
  zoneId: string
  zoneName: string
  deliveryFee: number
}

/**
 * Find the active delivery zone and fee for a PSGC city.
 */
export async function getDeliveryFeeForCity(
  cityPsgcCode: string
): Promise<DeliveryZoneResult | null> {
  if (!cityPsgcCode) {
    return null
  }

  const { data, error } = await supabase
    .from("delivery_zone_cities")
    .select(
      `
        delivery_zone_id,
        delivery_zones!inner (
          id,
          zone_name,
          delivery_fee,
          is_active
        )
      `
    )
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