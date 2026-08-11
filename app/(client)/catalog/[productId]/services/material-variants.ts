import "server-only"

import { adminSupabase } from "@/lib/supabase/admin"

export interface MaterialVariant {
  id: string
  material_name: string
  color: string | null
  series: string | null
  thickness: string | null
  unit_cost: number
}

export interface ProductVariants {
  aluminum: MaterialVariant[]
  glass: MaterialVariant[]
}

export async function getProductMaterialVariants(
  productId: string
): Promise<ProductVariants> {
  const { data, error } = await adminSupabase
    .from("product_variant_materials")
    .select(
      `
      inventory_materials (
        id,
        material_name,
        category,
        color,
        series,
        thickness,
        unit_cost,
        is_active
      )
    `
    )
    .eq("product_id", productId)

  if (error || !data) {
    return {
      aluminum: [],
      glass: [],
    }
  }

  const materials = data
    .map((row) =>
      Array.isArray(row.inventory_materials)
        ? row.inventory_materials[0]
        : row.inventory_materials
    )
    .filter(Boolean)
    .filter((m: any) => m.is_active)

  return {
    aluminum: materials
      .filter((m: any) => m.category === "Aluminum")
      .map((m: any) => ({
        id: m.id,
        material_name: m.material_name,
        color: m.color,
        series: m.series,
        thickness: m.thickness,
        unit_cost: Number(m.unit_cost ?? 0),
      })),
    glass: materials
      .filter((m: any) => m.category === "Glass")
      .map((m: any) => ({
        id: m.id,
        material_name: m.material_name,
        color: m.color,
        series: m.series,
        thickness: m.thickness,
        unit_cost: Number(m.unit_cost ?? 0),
      })),
  }
}