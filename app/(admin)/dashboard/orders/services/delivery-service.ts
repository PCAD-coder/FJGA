import { createClient } from "@/lib/supabase/server"

export async function getDeliveryFeeByCity(
  cityPsgcCode: string
): Promise<number> {
  if (!cityPsgcCode) {
    throw new Error("City PSGC code is required")
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("delivery_zone_cities")
    .select(
      `
        delivery_zones!inner (
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
    throw new Error(
      error.message || "Failed to determine delivery fee"
    )
  }

  if (!data?.delivery_zones) {
    throw new Error(
      "Delivery is not available for the selected city"
    )
  }

  const zone = Array.isArray(data.delivery_zones)
    ? data.delivery_zones[0]
    : data.delivery_zones

  if (!zone) {
    throw new Error(
      "Delivery is not available for the selected city"
    )
  }

  return Number(zone.delivery_fee)
}