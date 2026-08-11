import { createClient } from "@/lib/supabase/client"
import type { ServiceResult } from "./service-result"

export async function saveProductVariantMaterials(
  productId: string,
  variants: {
    frameMaterials: string[]
    glassMaterials: string[]
  }
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()

  const rows = [
    ...variants.frameMaterials.map((inventory_material_id) => ({
      product_id: productId,
      inventory_material_id,
      variant_group: "frame_material",
    })),

    ...variants.glassMaterials.map((inventory_material_id) => ({
      product_id: productId,
      inventory_material_id,
      variant_group: "glass_material",
    })),
  ]

  if (rows.length === 0) {
    return {
      data: true,
      error: null,
    }
  }

  const { error } = await supabase
    .from("product_variant_materials")
    .insert(rows)

  if (error) {
    return {
      data: null,
      error: error.message,
    }
  }

  return {
    data: true,
    error: null,
  }
}

export async function getProductVariantMaterials(productId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_variant_materials")
    .select(
      `id,
      variant_group,
      inventory_material_id,
      inventory_materials (
        id,
        material_name,
        category,
        series,
        specification,
        color,
        thickness,
        unit
      )
    `
    )
    .eq("product_id", productId)

  return {
    data: data ?? [],
    error: error?.message ?? null,
  }
}

export async function replaceProductVariantMaterials(
  productId: string,
  variants: {
    frameMaterials: string[]
    glassMaterials: string[]
  }
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()

  const { error: deleteError } = await supabase
    .from("product_variant_materials")
    .delete()
    .eq("product_id", productId)

  if (deleteError) {
    return {
      data: null,
      error: deleteError.message,
    }
  }

  return saveProductVariantMaterials(productId, variants)
}
