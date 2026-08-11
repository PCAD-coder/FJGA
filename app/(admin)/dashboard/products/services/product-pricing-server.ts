import "server-only"

import { adminSupabase } from "@/lib/supabase/admin"

import type { ServiceResult } from "./service-result"
import type { ProductPricing } from "./product-pricing-core"

import { getProductPricingForDimensionsCore } from "./product-pricing-core"

export async function getProductPricing(
  productId: string
): Promise<ServiceResult<ProductPricing>> {
  return getProductPricingForDimensions(productId, {})
}

export async function getProductPricingForDimensions(
  productId: string,
  dimensions: {
    width?: number | null
    height?: number | null
    depth?: number | null

    aluminumVariantId?: string | null
    glassVariantId?: string | null
  }
): Promise<ServiceResult<ProductPricing>> {
  return getProductPricingForDimensionsCore(
    adminSupabase,
    productId,
    dimensions
  )
}