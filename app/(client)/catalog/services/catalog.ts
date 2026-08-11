import { createClient } from "@/lib/supabase/server"
import { getProductPricingForDimensions } from "@/app/(admin)/dashboard/products/services/product-pricing-server"
import type { CatalogProduct } from "../types/catalog"

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        product_name,
        description,
        width,
        height,
        depth,
        product_images (
          image_url,
          display_order
        )
      `
    )
    .eq("is_active", true)
    .order("product_name")

  if (error) {
    throw new Error(error.message)
  }

  const products = await Promise.all(
    (data ?? []).map(async (product: any) => {
      const pricing = await getProductPricingForDimensions(product.id, {
        width: product.width,
        height: product.height,
        depth: product.depth,
      })

      const image =
        [...(product.product_images ?? [])].sort(
          (a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0)
        )[0]?.image_url ?? "/placeholder.jpg"

      return {
        id: product.id,
        name: product.product_name,
        description: product.description ?? "",
        image,
        width: Number(product.width ?? 0),
        height: Number(product.height ?? 0),
        depth: Number(product.depth ?? 0),
        sellingPrice: pricing.data?.sellingPrice ?? 0,
      }
    })
  )

  return products
}
