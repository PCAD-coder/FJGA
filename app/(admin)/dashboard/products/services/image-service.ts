import { createClient } from "@/lib/supabase/client"

import type { ProductImage, ProductImageInsert } from "../types/product"
import type { ServiceResult } from "./service-result"

export async function getProductImages(
  productId: string
): Promise<ServiceResult<ProductImage[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("display_order", { ascending: true })

  return {
    data,
    error: error?.message ?? null,
  }
}
export async function addProductImage(
    image: ProductImageInsert
): Promise<ServiceResult<ProductImage>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_images")
    .insert(image)
    .select()
    .single()

  return {
    data,
    error: error?.message ?? null,
  }
}
//multiple image upload
export async function addProductImages(
  images: ProductImageInsert[]
): Promise<ServiceResult<ProductImage[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_images")
    .insert(images)
    .select()

  return {
    data: data ?? [],
    error: error?.message ?? null,
  }
}

export async function updateImageDisplayOrder(
  imageId: string,
  displayOrder: number
): Promise<ServiceResult<ProductImage>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("product_images")
    .update({
      display_order: displayOrder,
    })
    .eq("id", imageId)
    .select()
    .single()

  return {
    data,
    error: error?.message ?? null,
  }
}

export async function deleteProduct(
  productId: string
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)

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
/**
 * Delete all image records for a product
 */
export async function deleteProductImages(
  productId: string
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()

  const { error } = await supabase
    .from("product_images")
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
export async function deleteProductImage(
  imageId: string
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()

  const { error } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId)

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
