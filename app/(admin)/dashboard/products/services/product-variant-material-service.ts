import { createClient } from "@/lib/supabase/client"
import type { ServiceResult } from "./service-result"

export interface VariantMaterialOption {
  id: string
  material_name: string
  category: string
  series: string | null
  specification: string
  color: string | null
  thickness: string | null
  unit: string
}

export interface ProductVariantMaterialSelections {
  frameMaterials: string[]
  glassMaterials: string[]
}

export async function getVariantMaterialsByCategory(
  category: string
): Promise<ServiceResult<VariantMaterialOption[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("inventory_materials")
    .select(`id,
      material_name,
      category,
      series,
      specification,
      color,
      thickness,
      unit`
    )
    .eq("category", category)
    .eq("is_active", true)
    .order("material_name")

  return {
    data: data ?? [],
    error: error?.message ?? null,
  }
}

export async function getAllVariantMaterials() {
  const [frame, glass] = await Promise.all([
    getVariantMaterialsByCategory("Aluminum"),
    getVariantMaterialsByCategory("Glass"),
  ])

  return {
    frameMaterials: frame.data ?? [],
    glassMaterials: glass.data ?? [],
  }
}
