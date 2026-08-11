import { createClient } from "@/lib/supabase/client"

import type {
  ProductLabor,
  ProductLaborInsert,
} from "../types/product"

import type { ServiceResult } from "./service-result"

/**
 * Fetch all labor services used by a product
 */
export async function getProductLabor(
  productId: string
): Promise<ServiceResult<ProductLabor[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_labor")
    .select("*")
    .eq("product_id", productId)

  return {
    data: data ?? [],
    error: error?.message ?? null,
  }
}

/**
 * Add a labor service to a product
 */
export async function addProductLabor(
  labor: ProductLaborInsert
): Promise<ServiceResult<ProductLabor>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_labor")
    .insert(labor)
    .select()
    .single()

  return {
    data,
    error: error?.message ?? null,
  }
}
//add multiple labor services
export async function addProductLaborItems(
  labor: ProductLaborInsert[]
): Promise<ServiceResult<ProductLabor[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_labor")
    .insert(labor)
    .select()

  return {
    data: data ?? [],
    error: error?.message ?? null,
  }
}

/**
 * Delete one labor service from a product
 */
export async function deleteProductLabor(
  id: string
): Promise<ServiceResult<ProductLabor>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_labor")
    .delete()
    .eq("id", id)
    .select()
    .single()

  return {
    data,
    error: error?.message ?? null,
  }
}
/**
 * Delete all labor services for a product
 */
export async function deleteProductLaborItems(
  productId: string
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()

  const { error } = await supabase
    .from("product_labor")
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