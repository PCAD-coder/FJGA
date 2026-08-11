import { createClient } from "@/lib/supabase/client"
import type { ServiceResult } from "./service-result"

export interface VariantOption {
  id: string
  name: string
}

export interface ProductVariantSelections {
  aluminumSeries: string[]
  aluminumColors: string[]
  aluminumFinishes: string[]
  glassTypes: string[]
  glassColors: string[]
}

export async function getAluminumSeries(): Promise<
  ServiceResult<VariantOption[]>
> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("aluminum_series")
    .select("id, series_name")
    .order("series_name")

  return {
    data:
      data?.map((item) => ({
        id: item.id,
        name: item.series_name,
      })) ?? [],
    error: error?.message ?? null,
  }
}

export async function getAluminumColors(): Promise<
  ServiceResult<VariantOption[]>
> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("aluminum_colors")
    .select("id, color_name")
    .order("color_name")

  return {
    data:
      data?.map((item) => ({
        id: item.id,
        name: item.color_name,
      })) ?? [],
    error: error?.message ?? null,
  }
}

export async function getAluminumFinishes(): Promise<
  ServiceResult<VariantOption[]>
> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("aluminum_finishes")
    .select("id, finish_name")
    .order("finish_name")

  return {
    data:
      data?.map((item) => ({
        id: item.id,
        name: item.finish_name,
      })) ?? [],
    error: error?.message ?? null,
  }
}

export async function getGlassTypes(): Promise<ServiceResult<VariantOption[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("glass_types")
    .select("id, glass_type_name")
    .order("glass_type_name")

  return {
    data:
      data?.map((item) => ({
        id: item.id,
        name: item.glass_type_name,
      })) ?? [],
    error: error?.message ?? null,
  }
}

export async function getGlassColors(): Promise<
  ServiceResult<VariantOption[]>
> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("glass_colors")
    .select("id, glass_color_name")
    .order("glass_color_name")

  return {
    data:
      data?.map((item) => ({
        id: item.id,
        name: item.glass_color_name,
      })) ?? [],
    error: error?.message ?? null,
  }
}

export async function getAllVariantOptions() {
  const [
    aluminumSeries,
    aluminumColors,
    aluminumFinishes,
    glassTypes,
    glassColors,
  ] = await Promise.all([
    getAluminumSeries(),
    getAluminumColors(),
    getAluminumFinishes(),
    getGlassTypes(),
    getGlassColors(),
  ])

  return {
    aluminumSeries: aluminumSeries.data ?? [],
    aluminumColors: aluminumColors.data ?? [],
    aluminumFinishes: aluminumFinishes.data ?? [],
    glassTypes: glassTypes.data ?? [],
    glassColors: glassColors.data ?? [],
  }
}
