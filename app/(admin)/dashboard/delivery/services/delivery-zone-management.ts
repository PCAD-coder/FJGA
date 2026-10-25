import { createClient } from "@/lib/supabase/client"

import type {
  CreateDeliveryZoneInput,
  DeliveryZone,
  DeliveryZoneBarangay,
  DeliveryZoneCity,
  UpdateDeliveryZoneInput,
} from "../types/delivery-zone"

const supabase = createClient()

interface DeliveryZoneRow {
  id: string
  zone_name: string
  description: string | null
  delivery_fee: number | string
  is_active: boolean
  region_psgc_code: string
  province_psgc_code: string | null
  created_at: string
  updated_at: string
}

interface DeliveryZoneCityRow {
  id: string
  delivery_zone_id: string
  city_psgc_code: string
}

interface PSGCCityRow {
  psgc_code: string
  city_name: string
  locality_type: string
  province_psgc_code: string | null
  region_psgc_code: string
}

interface PSGCProvinceRow {
  psgc_code: string
  province_name: string
}

interface PSGCRegionRow {
  psgc_code: string
  region_name: string
}

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
const { data: zones, error: zonesError } = await supabase
  .from("delivery_zones")
  .select(`
    id,
    zone_name,
    description,
    delivery_fee,
    is_active,
    region_psgc_code,
    province_psgc_code,
    created_at,
    updated_at
  `)
  .order("zone_name", { ascending: true })

  if (zonesError) {
    throw zonesError
  }

  const { data: assignments, error: assignmentsError } = await supabase
    .from("delivery_zone_cities")
    .select(`
      id,
      delivery_zone_id,
      city_psgc_code
    `)

  if (assignmentsError) {
    throw assignmentsError
  }

  const cityCodes = [
    ...new Set(
      (assignments ?? []).map(
        (assignment: DeliveryZoneCityRow) => assignment.city_psgc_code
      )
    ),
  ]

  let cities: PSGCCityRow[] = []

  if (cityCodes.length > 0) {
    const { data, error } = await supabase
      .from("psgc_cities")
      .select(`
        psgc_code,
        city_name,
        locality_type,
        province_psgc_code,
        region_psgc_code
      `)
      .in("psgc_code", cityCodes)

    if (error) {
      throw error
    }

    cities = data ?? []
  }

const provinceCodes = [
  ...new Set(
    [
      ...cities.map((city) => city.province_psgc_code),
      ...(zones ?? []).map(
        (zone) => (zone as DeliveryZoneRow).province_psgc_code
      ),
    ].filter((code): code is string => Boolean(code))
  ),
]

  let provinces: PSGCProvinceRow[] = []

  if (provinceCodes.length > 0) {
    const { data, error } = await supabase
      .from("psgc_provinces")
      .select("psgc_code, province_name")
      .in("psgc_code", provinceCodes)

    if (error) {
      throw error
    }

    provinces = data ?? []
  }
const regionCodes = [
  ...new Set([
    ...cities.map((city) => city.region_psgc_code),
    ...(zones ?? []).map(
      (zone) => (zone as DeliveryZoneRow).region_psgc_code
    ),
  ]),
]

  let regions: PSGCRegionRow[] = []

  if (regionCodes.length > 0) {
    const { data, error } = await supabase
      .from("psgc_regions")
      .select("psgc_code, region_name")
      .in("psgc_code", regionCodes)

    if (error) {
      throw error
    }

    regions = data ?? []
  }

  const cityMap = new Map(
    cities.map((city) => [city.psgc_code, city])
  )

  const provinceMap = new Map(
    provinces.map((province) => [
      province.psgc_code,
      province.province_name,
    ])
  )

  const regionMap = new Map(
    regions.map((region) => [
      region.psgc_code,
      region.region_name,
    ])
  )

  const citiesByZone = new Map<string, DeliveryZoneCity[]>()

  for (const assignment of (assignments ?? []) as DeliveryZoneCityRow[]) {
    const city = cityMap.get(assignment.city_psgc_code)

    if (!city) {
      continue
    }

    const mappedCity: DeliveryZoneCity = {
  id: assignment.id,
  cityPsgcCode: assignment.city_psgc_code,
  cityName: city.city_name,
  localityType: city.locality_type,

  provincePsgcCode: city.province_psgc_code,
  provinceName: city.province_psgc_code
    ? provinceMap.get(city.province_psgc_code) ?? null
    : null,

  regionPsgcCode: city.region_psgc_code,
  regionName: regionMap.get(city.region_psgc_code) ?? "",
}

    const existing = citiesByZone.get(assignment.delivery_zone_id) ?? []

    existing.push(mappedCity)

    citiesByZone.set(assignment.delivery_zone_id, existing)
  }

return ((zones ?? []) as DeliveryZoneRow[]).map((zone) => ({
  id: zone.id,
  zoneName: zone.zone_name,
  description: zone.description,
  deliveryFee: Number(zone.delivery_fee),
  isActive: zone.is_active,
  regionPsgcCode: zone.region_psgc_code,
  regionName: regionMap.get(zone.region_psgc_code) ?? "",
  provincePsgcCode: zone.province_psgc_code,
  provinceName: zone.province_psgc_code
    ? provinceMap.get(zone.province_psgc_code) ?? null
    : null,
  createdAt: zone.created_at,
  updatedAt: zone.updated_at,
  cities: citiesByZone.get(zone.id) ?? [],
}))
}

export async function createDeliveryZone(
  input: CreateDeliveryZoneInput
): Promise<string> {
  const regionPsgcCode = input.regionPsgcCode.trim()
  const provincePsgcCode = input.provincePsgcCode?.trim() || null
  const cityPsgcCode = input.cityPsgcCode.trim()

  if (!regionPsgcCode) {
    throw new Error("Region is required")
  }

  if (!cityPsgcCode) {
    throw new Error("City is required")
  }

  if (!Number.isFinite(input.deliveryFee) || input.deliveryFee < 0) {
    throw new Error("Delivery fee must be zero or greater")
  }

  const { data, error } = await supabase.rpc("create_delivery_zone", {
    p_region_psgc_code: regionPsgcCode,
    p_province_psgc_code: provincePsgcCode,
    p_description: input.description?.trim() || null,
    p_delivery_fee: input.deliveryFee,
    p_city_psgc_code: cityPsgcCode,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error("Delivery zone was created but no zone ID was returned")
  }

  return data as string
}

export async function updateDeliveryZone(
  zoneId: string,
  input: UpdateDeliveryZoneInput
): Promise<void> {
  if (!zoneId) {
    throw new Error("Delivery zone is required")
  }

  if (!Number.isFinite(input.deliveryFee) || input.deliveryFee < 0) {
    throw new Error("Delivery fee must be zero or greater")
  }

  const { error } = await supabase.rpc("update_delivery_zone", {
    p_zone_id: zoneId,
    p_description: input.description?.trim() || null,
    p_delivery_fee: input.deliveryFee,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function addCityToDeliveryZone(
  zoneId: string,
  cityPsgcCode: string
): Promise<string> {
  if (!zoneId) {
    throw new Error("Delivery zone is required")
  }

  if (!cityPsgcCode.trim()) {
    throw new Error("City is required")
  }

  const { data, error } = await supabase.rpc(
    "add_city_to_delivery_zone",
    {
      p_zone_id: zoneId,
      p_city_psgc_code: cityPsgcCode,
    }
  )

  if (error) {
    throw new Error(
      error.message || "Failed to add city to delivery zone"
    )
  }

  if (!data) {
    throw new Error(
      "City was added but no assignment ID was returned"
    )
  }

  return data as string
}
export async function removeCityFromDeliveryZone(
  zoneId: string,
  cityPsgcCode: string
): Promise<void> {
  if (!zoneId) {
    throw new Error("Delivery zone is required")
  }

  if (!cityPsgcCode.trim()) {
    throw new Error("City is required")
  }

  const { error } = await supabase.rpc(
    "remove_city_from_delivery_zone",
    {
      p_zone_id: zoneId,
      p_city_psgc_code: cityPsgcCode,
    }
  )

  if (error) {
    throw new Error(
      error.message ||
        "Failed to remove city from delivery zone"
    )
  }
}

export async function setDeliveryZoneActive(
  zoneId: string,
  isActive: boolean
): Promise<void> {
  if (!zoneId) {
    throw new Error("Delivery zone is required")
  }

  const { error } = await supabase.rpc(
    "set_delivery_zone_active",
    {
      p_zone_id: zoneId,
      p_is_active: isActive,
    }
  )

  if (error) {
    throw new Error(
      error.message ||
        `Failed to ${
          isActive ? "activate" : "deactivate"
        } delivery zone`
    )
  }
}

export async function getDeliveryZoneBarangays(
  deliveryZoneCityId: string,
  cityPsgcCode: string
): Promise<DeliveryZoneBarangay[]> {
  if (!deliveryZoneCityId) {
    throw new Error("Delivery zone city is required")
  }

  if (!cityPsgcCode.trim()) {
    throw new Error("City is required")
  }

  const { data: barangays, error: barangaysError } = await supabase
    .from("psgc_barangays")
    .select("psgc_code, barangay_name")
    .eq("city_psgc_code", cityPsgcCode)
    .order("barangay_name", { ascending: true })

  if (barangaysError) {
    throw new Error(barangaysError.message)
  }

  const { data: unavailable, error: unavailableError } = await supabase
    .from("delivery_zone_unavailable_barangays")
    .select("barangay_psgc_code")
    .eq("delivery_zone_city_id", deliveryZoneCityId)

  if (unavailableError) {
    throw new Error(unavailableError.message)
  }

  const unavailableCodes = new Set(
    (unavailable ?? []).map(
      (row: { barangay_psgc_code: string }) =>
        row.barangay_psgc_code
    )
  )

  return (barangays ?? []).map(
    (barangay: {
      psgc_code: string
      barangay_name: string
    }) => ({
      psgcCode: barangay.psgc_code,
      barangayName: barangay.barangay_name,
      isAvailable: !unavailableCodes.has(barangay.psgc_code),
    })
  )
}

export async function markDeliveryBarangayUnavailable(
  deliveryZoneCityId: string,
  barangayPsgcCode: string
): Promise<string> {
  if (!deliveryZoneCityId) {
    throw new Error("Delivery zone city is required")
  }

  if (!barangayPsgcCode.trim()) {
    throw new Error("Barangay is required")
  }

  const { data, error } = await supabase.rpc(
    "mark_delivery_barangay_unavailable",
    {
      p_delivery_zone_city_id: deliveryZoneCityId,
      p_barangay_psgc_code: barangayPsgcCode,
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    throw new Error(
      "Barangay was marked unavailable but no exception ID was returned"
    )
  }

  return data as string
}

export async function markDeliveryBarangayAvailable(
  deliveryZoneCityId: string,
  barangayPsgcCode: string
): Promise<void> {
  if (!deliveryZoneCityId) {
    throw new Error("Delivery zone city is required")
  }

  if (!barangayPsgcCode.trim()) {
    throw new Error("Barangay is required")
  }

  const { error } = await supabase.rpc(
    "mark_delivery_barangay_available",
    {
      p_delivery_zone_city_id: deliveryZoneCityId,
      p_barangay_psgc_code: barangayPsgcCode,
    }
  )

  if (error) {
    throw new Error(error.message)
  }
}