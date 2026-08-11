import { createClient } from "@/lib/supabase/client"
import type { ServiceResult } from "./service-result"
import type { ProductVariantSelections } from "./product-variant-service"

export async function saveProductVariants(
  productId: string,
  variants: ProductVariantSelections
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()

  async function insertRows(table: string, column: string, ids: string[]) {
    if (ids.length === 0) return null
    const rows = ids.map((id) => ({
      product_id: productId,
      [column]: id,
    }))

    const { error } = await supabase.from(table).insert(rows)

    return error
  }

  const errors = await Promise.all([
    insertRows(
      "product_aluminum_series",
      "aluminum_series_id",
      variants.aluminumSeries
    ),

    insertRows(
      "product_aluminum_colors",
      "aluminum_color_id",
      variants.aluminumColors
    ),

    insertRows(
      "product_aluminum_finishes",
      "aluminum_finish_id",
      variants.aluminumFinishes
    ),

    insertRows("product_glass_types", "glass_type_id", variants.glassTypes),

    insertRows("product_glass_colors", "glass_color_id", variants.glassColors),
    ,
  ])

  const firstError = errors.find(Boolean)

  if (firstError) {
    return {
      data: null,
      error: firstError.message,
    }
  }

  return {
    data: true,
    error: null,
  }
}
export async function getProductVariants(
  productId: string
): Promise<ServiceResult<ProductVariantSelections>> {
  const supabase = createClient()

  async function loadIds(table: string, column: string): Promise<string[]> {
    const { data } = await supabase
      .from(table)
      .select(column)
      .eq("product_id", productId)

    return (data ?? []).map((row: any) => row[column])
  }

  const [
    aluminumSeries,
    aluminumColors,
    aluminumFinishes,
    glassTypes,
    glassColors,
  ] = await Promise.all([
    loadIds("product_aluminum_series", "aluminum_series_id"),
    loadIds("product_aluminum_colors", "aluminum_color_id"),
    loadIds("product_aluminum_finishes", "aluminum_finish_id"),
    loadIds("product_glass_types", "glass_type_id"),
    loadIds("product_glass_colors", "glass_color_id"),
  ])

  return {
    data: {
      aluminumSeries,
      aluminumColors,
      aluminumFinishes,
      glassTypes,
      glassColors,
    },
    error: null,
  }
}

export async function replaceProductVariants(
  productId: string,
  variants: ProductVariantSelections
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()

  await Promise.all([
    supabase
      .from("product_aluminum_series")
      .delete()
      .eq("product_id", productId),

    supabase
      .from("product_aluminum_colors")
      .delete()
      .eq("product_id", productId),

    supabase
      .from("product_aluminum_finishes")
      .delete()
      .eq("product_id", productId),

    supabase.from("product_glass_types").delete().eq("product_id", productId),

    supabase.from("product_glass_colors").delete().eq("product_id", productId),
  ])

  return saveProductVariants(productId, variants)
}
