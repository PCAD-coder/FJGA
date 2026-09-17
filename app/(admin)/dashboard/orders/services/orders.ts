import { createClient } from "@/lib/supabase/client"
import type {
  CreateOrderInput,
  MaterialSnapshot,
  LaborSnapshot,
} from "../types/order"

import type { OrderStatus } from "../types/order"

import { getProductPricingForDimensions } from "../../products/services/product-pricing"

import { createOrderServer } from "../actions/create-order"

const supabase = createClient()

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
  productId: string,
  dimensions: {
    width?: number | null
    height?: number | null
    depth?: number | null
  }
): Promise<ProductPricingSnapshot> {
  // Load product
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

  const markupAmount =
    pricing.sellingPrice - pricing.materialCost - pricing.laborCost

  return {
    productId: product.id,
    productName: product.product_name,

    width: pricing.width,
    height: pricing.height,
    depth: pricing.depth,

    materialSubtotal: pricing.materialCost,
    laborSubtotal: pricing.laborCost,
    markupAmount,

    unitPrice: pricing.sellingPrice,

    materials: pricing.materialsSnapshot,
    labor: pricing.laborSnapshot,
  }
}

export async function createOrder(input: CreateOrderInput) {
  return await createOrderServer(input)
}

export async function getOrders() {
  const { data, error } = await supabase
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
        ),order_addresses (
          *
        )
      `
    )
    .order("created_at", { ascending: false })

  if (error) throw error

  return (data ?? []).map((order) => ({
    ...order,
    items: order.order_items ?? [],
    address: Array.isArray(order.order_addresses)
      ? (order.order_addresses[0] ?? null)
      : (order.order_addresses ?? null),
  }))
}
export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
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
        ),
        order_addresses (
          *
        )
      `
    )
    .eq("id", orderId)
    .single()

  if (error) throw error

  return {
    ...data,
    items: data.order_items ?? [],
    address: Array.isArray(data.order_addresses)
      ? (data.order_addresses[0] ?? null)
      : (data.order_addresses ?? null),
  }
}

// Update order status
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  options?: {
    assignedTo?: string
    estimatedCompletionDate?: string
  }
) {
  const updateData: Record<string, any> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === "in_production") {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, total_amount")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      throw new Error("Order not found")
    }

    const { data: payments, error: paymentsError } = await supabase
      .from("order_payments")
      .select("amount")
      .eq("order_id", orderId)

    if (paymentsError) {
      throw new Error("Failed to check order payments")
    }

    const totalPaid = (payments ?? []).reduce(
      (total, payment) => total + Number(payment.amount ?? 0),
      0
    )

    const requiredDownPayment = Number(order.total_amount ?? 0) * 0.5

    if (totalPaid < requiredDownPayment) {
      const remaining = requiredDownPayment - totalPaid

      throw new Error(
        `Production cannot start. The customer must pay at least 50% of the order total. ${remaining.toLocaleString(
          "en-PH",
          {
            style: "currency",
            currency: "PHP",
          }
        )} remaining.`
      )
    }
    updateData.production_started_at = new Date().toISOString()
    updateData.production_stage = "material_prep"

    if (options?.assignedTo) {
      updateData.production_assigned_to = options.assignedTo
    }

    if (options?.estimatedCompletionDate) {
      updateData.estimated_completion_date = options.estimatedCompletionDate
    }

    /*
     * Material consumption happens when production starts.
     *
     * The database function protects against duplicate
     * consumption, so moving the order back to Material Prep
     * later will not deduct the same material twice.
     */
    const { data: consumptionResult, error: consumptionError } =
      await supabase.rpc("consume_order_materials", {
        p_order_id: orderId,
        p_production_stage: "material_prep",
      })

    console.log("MATERIAL CONSUMPTION ON START PRODUCTION:", {
      orderId,
      consumptionResult,
      consumptionError,
    })

    if (consumptionError) {
      throw new Error(
        consumptionError.message || "Failed to consume production materials"
      )
    }
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)
    .select()
    .single()

  if (error) throw error

  return data
}

// Save quotation details
export async function saveOrderQuotation(
  orderId: string,
  quotation: Record<string, any>
) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      quotation,
      status: "quoted",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single()

  if (error) throw error

  return data
}

// Deny an order
export async function denyOrder(orderId: string, reason: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "denied",
      denial_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single()

  if (error) throw error

  return data
}

// Approve an order
export async function approveOrder(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "approved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single()

  if (error) throw error

  return data
}
