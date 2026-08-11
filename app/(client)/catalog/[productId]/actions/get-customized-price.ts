"use server"

import { getProductPricingForDimensions } from "@/app/(admin)/dashboard/products/services/product-pricing-server"

export async function getCustomizedPrice(
  productId: string,
  dimensions: {
    width: number
    height: number
    depth: number

      aluminumVariantId?: string
  glassVariantId?: string
  }
) {
  const result = await getProductPricingForDimensions(productId, dimensions)

  if (!result.data) {
    throw new Error(result.error ?? "Failed to calculate price")
  }

  return {
    sellingPrice: result.data.sellingPrice,
    materialCost: result.data.materialCost,
    laborCost: result.data.laborCost,
    totalMarkup: result.data.totalMarkup,
  }
}