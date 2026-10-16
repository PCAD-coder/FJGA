import { createClient } from "@/lib/supabase/client"

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

export async function getRegions(): Promise<PSGCRegion[]> {
  const { data, error } = await supabase
    .from("psgc_regions")
    .select("psgc_code, region_name")
    .order("region_name", { ascending: true })

  if (error) throw error

  return data ?? []
}

export async function getProvinces(
  regionCode: string
): Promise<PSGCProvince[]> {
  if (!regionCode) return []

  const { data, error } = await supabase
    .from("psgc_provinces")
    .select(`
      psgc_code,
      province_name,
      region_psgc_code
    `)
    .eq("region_psgc_code", regionCode)
    .order("province_name", { ascending: true })

  if (error) throw error

  return data ?? []
}

export async function getCities(
  regionCode: string,
  provinceCode?: string | null
): Promise<PSGCCity[]> {
  if (!regionCode) return []

  let query = supabase
    .from("psgc_cities")
    .select(`
      psgc_code,
      city_name,
      locality_type,
      region_psgc_code,
      province_psgc_code
    `)
    .eq("region_psgc_code", regionCode)

  if (provinceCode) {
    query = query.eq("province_psgc_code", provinceCode)
  } else {
    query = query.is("province_psgc_code", null)
  }

  const { data, error } = await query.order("city_name", {
    ascending: true,
  })

  if (error) throw error

  return data ?? []
}

export async function getBarangays(
  cityCode: string
): Promise<PSGCBarangay[]> {
  if (!cityCode) return []

  const { data, error } = await supabase
    .from("psgc_barangays")
    .select(`
      psgc_code,
      barangay_name,
      region_psgc_code,
      province_psgc_code,
      city_psgc_code
    `)
    .eq("city_psgc_code", cityCode)
    .order("barangay_name", { ascending: true })

  if (error) throw error

  return data ?? []
}