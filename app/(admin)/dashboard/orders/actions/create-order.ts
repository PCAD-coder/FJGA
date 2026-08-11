"use server"

import { createClient } from "@/lib/supabase/server"

import { getProductPricingForDimensions } from "@/app/(admin)/dashboard/products/services/product-pricing-server"

import type {
  CreateOrderInput,
  MaterialSnapshot,
  LaborSnapshot,
} from "../types/order"

interface ProductPricingSnapshot {
  productId: string
  productName: string

  width: number | null
  height: number | null
  depth: number | null

  materialSubtotal: number
  laborSubtotal: number
  markupAmount: number

  unitPrice: number

  materials: MaterialSnapshot[]
  labor: LaborSnapshot[]
}

async function buildProductPricingSnapshot(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productId: string,
  dimensions: {
    width?: number | null
    height?: number | null
    depth?: number | null

    aluminumVariantId?: string | null
    glassVariantId?: string | null
  }
): Promise<ProductPricingSnapshot> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, product_name")
    .eq("id", productId)
    .single()

  if (productError || !product) {
    throw new Error("Product not found")
  }

  const pricingResult = await getProductPricingForDimensions(
    productId,
    dimensions
  )

  if (!pricingResult.data) {
    throw new Error(
      pricingResult.error ?? "Failed to calculate product pricing"
    )
  }

  const pricing = pricingResult.data

  return {
    productId: product.id,
    productName: product.product_name,

    width: pricing.width,
    height: pricing.height,
    depth: pricing.depth,

    materialSubtotal: pricing.materialCost,
    laborSubtotal: pricing.laborCost,

    markupAmount:
      pricing.sellingPrice - pricing.materialCost - pricing.laborCost,

    unitPrice: pricing.sellingPrice,

    materials: pricing.materialsSnapshot,
    labor: pricing.laborSnapshot,
  }
}

export async function createOrderServer(input: CreateOrderInput) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Authentication required")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single()

  if (profileError || !profile) {
    throw new Error("Profile not found")
  }

  if (profile.role !== "admin" && profile.id !== input.customer_id) {
    throw new Error("You can only create orders for yourself")
  }

  const pricingSnapshots = await Promise.all(
    input.items.map((item) =>
      buildProductPricingSnapshot(supabase, item.product_id, {
        width: item.width,
        height: item.height,
        depth: item.depth,

        aluminumVariantId: item.aluminum_variant_id ?? null,
        glassVariantId: item.glass_variant_id ?? null,
      })
    )
  )

  let subtotal = 0
  let laborTotal = 0
  let totalAmount = Number(input.delivery_fee ?? 0)

  const orderItems = pricingSnapshots.map((snapshot, index) => {
    const quantity = input.items[index].quantity

    subtotal += snapshot.unitPrice * quantity
    laborTotal += snapshot.laborSubtotal * quantity

    const lineTotal = snapshot.unitPrice * quantity

    totalAmount += lineTotal

    return {
      product_id: snapshot.productId,
      product_name_snapshot: snapshot.productName,

      quantity,

      width: snapshot.width,
      height: snapshot.height,
      depth: snapshot.depth,

      dimension_unit: input.items[index].dimension_unit ?? "cm",

      material_subtotal: snapshot.materialSubtotal,
      labor_subtotal: snapshot.laborSubtotal,
      markup_amount: snapshot.markupAmount,

      unit_price_snapshot: snapshot.unitPrice,

      line_total: lineTotal,

      materials_snapshot: snapshot.materials,
      labor_snapshot: snapshot.labor,
    }
  })
  const { data: orderId, error } = await supabase.rpc(
    "create_order_transaction",
    {
      p_customer_id: input.customer_id,
      p_order_type: input.order_type,
      p_subtotal: subtotal,
      p_labor_total: laborTotal,
      p_delivery_fee: input.delivery_fee ?? 0,
      p_total_amount: totalAmount,
      p_notes: input.notes ?? null,
      p_items: orderItems,
    }
  )

  if (error) {
    throw new Error(error.message || "Failed to create order")
  }

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles (
        id,
        first_name,
        last_name
      ),
      order_items (
        *
      )
    `
    )
    .eq("id", orderId)
    .single()

  if (fetchError || !order) {
    throw new Error(fetchError?.message || "Failed to load created order")
  }

  return {
    ...order,
    items: order.order_items ?? [],
  }
}
