import { createClient } from "@/lib/supabase/client"

import type { ProductMaterial, ProductMaterialInsert } from "../types/product"

import type { ServiceResult } from "./service-result"

/*Fetch all materials used by a product
.Includes material rule fields:*/
export async function getProductMaterials(
  productId: string
): Promise<ServiceResult<ProductMaterial[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_materials")
    .select("*")
    .eq("product_id", productId)

  return {
    data: data ?? [],
    error: error?.message ?? null,
  }
}
/*Save a single material to a product.*/
export async function addProductMaterial(
  material: ProductMaterialInsert
): Promise<ServiceResult<ProductMaterial>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_materials")
    .insert(material)
    .select()
    .single()

  return {
    data,
    error: error?.message ?? null,
  }
}
/*Save multiple materials to a product*/
export async function addProductMaterials(
  materials: ProductMaterialInsert[]
): Promise<ServiceResult<ProductMaterial[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_materials")
    .insert(materials)
    .select()

  return {
    data: data ?? [],
    error: error?.message ?? null,
  }
}
/*Delete one material from a product.*/
export async function deleteProductMaterial(
  id: string
): Promise<ServiceResult<ProductMaterial>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_materials")
    .delete()
    .eq("id", id)
    .select()
    .single()

  return {
    data,
    error: error?.message ?? null,
  }
}
/*Delete all materials for a product.*/
export async function deleteProductMaterials(
  productId: string
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()

  const { error } = await supabase
    .from("product_materials")
    .delete()
    .eq("product_id", productId)

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
