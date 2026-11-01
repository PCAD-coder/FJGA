import { createClient } from "@/lib/supabase/server"
import { getProductPricingForDimensions } from "@/app/(admin)/dashboard/products/services/product-pricing-server"

import ProductOrderPage from "./components/product-order-page"

import { getProductMaterialVariants } from "./services/material-variants"

interface Props {
  params: Promise<{
    productId: string
  }>
}

export default async function Page({ params }: Props) {
  const { productId } = await params

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let contactNumber: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("contact_number")
      .eq("auth_user_id", user.id)
      .single()

    contactNumber = profile?.contact_number ?? null
  }

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
        id,
        product_name,
        description,
        width,
        height,
        depth,
        is_customizable,
        is_depth_customizable,
        product_images (
          image_url,
          display_order
        )
      `
    )
    .eq("id", productId)
    .eq("is_active", true)
    .single()

  if (error || !product) {
    return <div className="p-8">Product not found.</div>
  }

  const pricing = await getProductPricingForDimensions(product.id, {
    width: product.width,
    height: product.height,
    depth: product.depth,
  })

const images = [...(product.product_images ?? [])]
  .sort(
    (a, b) =>
      (a.display_order ?? 0) - (b.display_order ?? 0)
  )
  .map((image) => image.image_url)
  .filter((imageUrl): imageUrl is string => Boolean(imageUrl))

if (images.length === 0) {
  images.push("/placeholder.jpg")
}

  const variants = await getProductMaterialVariants(product.id)

  const { data: baseMaterials } = await supabase
    .from("product_materials")
    .select(
      `
      inventory_materials (
        id,
        category
      )
    `
    )
    .eq("product_id", product.id)

  const defaultAluminumVariantId =
    baseMaterials
      ?.map((row: any) => row.inventory_materials)
      .find((m: any) => m?.category === "Aluminum")?.id ?? ""

  const defaultGlassVariantId =
    baseMaterials
      ?.map((row: any) => row.inventory_materials)
      .find((m: any) => m?.category === "Glass")?.id ?? ""

  return (
<ProductOrderPage
  contactNumber={contactNumber}
  product={{
    id: product.id,
    name: product.product_name,
    description: product.description ?? "",
    images,
    width: Number(product.width ?? 0),
    height: Number(product.height ?? 0),
    depth: Number(product.depth ?? 0),
    isCustomizable: product.is_customizable,
    isDepthCustomizable: product.is_depth_customizable,
  }}
      initialPrice={pricing.data?.sellingPrice ?? 0}
      variants={variants}
      defaultAluminumVariantId={defaultAluminumVariantId}
      defaultGlassVariantId={defaultGlassVariantId}
    />
  )
}
