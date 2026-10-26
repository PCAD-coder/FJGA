"use server"

import { createClient } from "@/lib/supabase/server"
import { adminSupabase } from "@/lib/supabase/admin"
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

  const { data: deliveryData, error: deliveryError } = await supabase.rpc(
    "get_delivery_fee_for_address",
    {
      p_city_psgc_code: input.address.city_psgc_code.trim(),
      p_barangay_psgc_code: input.address.barangay_psgc_code.trim(),
    }
  )

  if (deliveryError) {
    throw new Error(deliveryError.message)
  }

  const deliveryResult = Array.isArray(deliveryData)
    ? deliveryData[0]
    : deliveryData

  if (!deliveryResult) {
    throw new Error(
      "Delivery is not currently available for the selected barangay."
    )
  }

  const deliveryFee = Number(deliveryResult.delivery_fee)

  let subtotal = 0
  let laborTotal = 0

  const orderItems = pricingSnapshots.map((snapshot, index) => {
    const quantity = input.items[index].quantity

    subtotal += snapshot.unitPrice * quantity
    laborTotal += snapshot.laborSubtotal * quantity

    const lineTotal = snapshot.unitPrice * quantity

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
  const vatRate = 12
  const vatAmount = Math.round(subtotal * (vatRate / 100) * 100) / 100
  const totalAmount = subtotal + vatAmount + deliveryFee

  const { data: orderId, error: orderError } = await adminSupabase.rpc(
    "create_order_transaction",
    {
      p_customer_id: input.customer_id,
      p_customer_contact_number: input.customer_contact_number,
      p_payment_method: input.payment_method,
      p_order_type: input.order_type,

      // Keep your existing authoritative amount values here.
      p_subtotal: subtotal,
      p_labor_total: laborTotal,
      p_delivery_fee: deliveryFee,
      p_total_amount: totalAmount,

      p_notes: input.notes,
      p_items: orderItems,

      p_address: {
        house_building_number: input.address.house_building_number.trim(),
        street: input.address.street.trim(),
        building_subdivision:
          input.address.building_subdivision?.trim() || null,
        unit_floor: input.address.unit_floor?.trim() || null,

        region_psgc_code: input.address.region_psgc_code.trim(),
        region_name: input.address.region_name.trim(),

        province_psgc_code: input.address.province_psgc_code?.trim() || null,
        province_name: input.address.province_name?.trim() || null,

        city_psgc_code: input.address.city_psgc_code.trim(),
        city_name: input.address.city_name.trim(),

        barangay_psgc_code: input.address.barangay_psgc_code.trim(),
        barangay_name: input.address.barangay_name.trim(),

        postal_code: input.address.postal_code?.trim() || null,
        landmark: input.address.landmark?.trim() || null,
      },
    }
  )

  if (orderError) {
    throw new Error(orderError.message || "Failed to create order")
  }

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select(
      `
      *,
      profiles (
        id,
        first_name,
        last_name,
        full_name
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
