import { createClient } from "@/lib/supabase/client"

import type { Product, ProductInsert, ProductUpdate } from "../types/product"

import type { ServiceResult } from "./service-result"

import { getProductImages } from "./image-service"

import { getProductMaterials } from "./material-service"

import { getProductLabor } from "./labor-service"

import type { ProductWithDetails } from "../types/product"

export async function getProducts(): Promise<ServiceResult<Product[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  return {
    data: data ?? null,
    error: error?.message ?? null,
  }
}

export async function getProductById(
  id: string
): Promise<ServiceResult<Product>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  return {
    data,
    error: error?.message ?? null,
  }
}

async function generateProductCode(): Promise<string> {
  const supabase = createClient()

  const { data } = await supabase
    .from("products")
    .select("product_code")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!data?.product_code) {
    return "PRD-000001"
  }

  const number = Number(data.product_code.replace("PRD-", ""))

  return `PRD-${String(number + 1).padStart(6, "0")}`
}

export async function createProduct(
  product: ProductInsert
): Promise<ServiceResult<Product>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .insert({
  ...product,
  product_code: product.product_code ?? null,
})
    .select()
    .single()

  return {
    data,
    error: error?.message ?? null,
  }
}
export async function updateProduct(
  id: string,
  updates: ProductUpdate
): Promise<ServiceResult<Product>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  return {
    data,
    error: error?.message ?? null,
  }
}
export async function archiveProduct(
  id: string
): Promise<ServiceResult<Product>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("products")
    .update({
      is_active: false,
    })
    .eq("id", id)
    .select()
    .single()

  return {
    data,
    error: error?.message ?? null,
  }
}
export async function restoreProduct(
  id: string
): Promise<ServiceResult<Product>> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products")
    .update({
      is_active: true,
    })
    .eq("id", id)
    .select()
    .single()

  return {
    data,
    error: error?.message ?? null,
  }
}
/**
 * Permanently delete a product. Primarily used internally for rollback operations.
 */
export async function deleteProduct(
  productId: string
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()

  const { error } = await supabase.from("products").delete().eq("id", productId)

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

export async function getProductsWithDetails(): Promise<
  ServiceResult<ProductWithDetails[]>
> {
  const supabase = createClient()

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return {
      data: null,
      error: error.message,
    }
  }

  const detailedProducts: ProductWithDetails[] = []

  for (const product of products ?? []) {
    const images = await getProductImages(product.id)
    const materials = await getProductMaterials(product.id)
    const labor = await getProductLabor(product.id)

    detailedProducts.push({
      ...product,
      images: images.data ?? [],
      materials: materials.data ?? [],
      labor: labor.data ?? [],
    })
  }

  return {
    data: detailedProducts,
    error: null,
  }
}
