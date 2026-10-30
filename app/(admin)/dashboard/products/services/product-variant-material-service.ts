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
  handleMaterials: string[]
  lockMaterials: string[]
  hingeMaterials: string[]
  rollerMaterials: string[]
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

export async function getVariantMaterialsBySpecification(
  category: string,
  specification: string
): Promise<ServiceResult<VariantMaterialOption[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("inventory_materials")
    .select(`
      id,
      material_name,
      category,
      series,
      specification,
      color,
      thickness,
      unit
    `)
    .eq("category", category)
    .eq("specification", specification)
    .eq("is_active", true)
    .order("material_name")

  return {
    data: data ?? [],
    error: error?.message ?? null,
  }
}

export async function getAllVariantMaterials() {
  const [frame, glass, handles, locks, hinges, rollers] = await Promise.all([
    getVariantMaterialsByCategory("Aluminum"),
    getVariantMaterialsByCategory("Glass"),
    getVariantMaterialsBySpecification("Accessories", "Handle"),
    getVariantMaterialsBySpecification("Accessories", "Lock"),
    getVariantMaterialsBySpecification("Accessories", "Hinge"),
    getVariantMaterialsBySpecification("Accessories", "Roller"),
  ])

  return {
    frameMaterials: frame.data ?? [],
    glassMaterials: glass.data ?? [],
    handleMaterials: handles.data ?? [],
    lockMaterials: locks.data ?? [],
    hingeMaterials: hinges.data ?? [],
    rollerMaterials: rollers.data ?? [],
  }
}