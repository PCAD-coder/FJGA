import type { SupabaseClient } from "@supabase/supabase-js"
import type { ServiceResult } from "./service-result"

function getMeasurementValue(
  methodKey: string | null,
  width: number | null,
  height: number | null,
  depth: number | null
): number {
  const w = width ?? 0
  const h = height ?? 0
  const d = depth ?? 0

  switch (methodKey) {
    case "width":
      return w / 100

    case "height":
      return h / 100

    case "depth":
      return d / 100

    case "perimeter":
      return (2 * (w + h)) / 100

    case "area":
      return (w * h) / 10000

    case "volume":
      return (w * h * d) / 1000000

    default:
      return 1
  }
}
export interface MaterialPricingSnapshot {
  material_id: string
  material_name: string
  quantity: number
  unit: string
  unit_cost: number
  markup_percentage: number
  subtotal: number
  color?: string | null
  series?: string | null
  thickness?: string | null
}
export interface LaborPricingSnapshot {
  service_id: string
  service_name: string
  quantity: number
  unit: string
  labor_cost: number
  markup_percentage: number
  subtotal: number
}

export interface ProductPricing {
  width: number | null
  height: number | null
  depth: number | null

  materialCost: number
  laborCost: number

  productionCost: number

  sellingPrice: number

  totalMarkup: number

  materialsSnapshot: MaterialPricingSnapshot[]
  laborSnapshot: LaborPricingSnapshot[]
}
export async function getProductPricingForDimensionsCore(
  supabase: SupabaseClient,
  productId: string,
  dimensions: {
    width?: number | null
    height?: number | null
    depth?: number | null

    aluminumVariantId?: string | null
    glassVariantId?: string | null
  }
): Promise<ServiceResult<ProductPricing>> {
  // paste ALL of the pricing logic here
  const { data: productData, error: productError } = await supabase
    .from("products")
    .select("id, product_name, width, height, depth, markup_percentage")
    .eq("id", productId)
    .single()

  if (productError) {
    return {
      data: null,
      error: productError.message,
    }
  }

  const { data: materials, error: materialError } = await supabase
    .from("product_materials")
    .select(
      `         quantity,
          is_fixed,
          calculation_method_id,
          calculation_methods(method_code),
          inventory_materials!product_materials_inventory_material_id_fkey (
          id,
          material_name,
          category,
          unit,
          unit_cost,
          markup_percentage,
          color,
          series,
          thickness
          )
        `
    )
    .eq("product_id", productId)

  if (materialError) {
    return {
      data: null,
      error: materialError.message,
    }
  }

  const { data: labor, error: laborError } = await supabase
    .from("product_labor")
    .select(
      `         quantity,
          labor_services!product_labor_pricing_service_id_fkey (
          id,
          service_name,
          unit,
          labor_cost,
          markup_percentage
          )
        `
    )
    .eq("product_id", productId)

  if (laborError) {
    return {
      data: null,
      error: laborError.message,
    }
  }

  const productMarkup = Number(productData?.markup_percentage ?? 0)

  const width = dimensions.width ?? productData.width

  const height = dimensions.height ?? productData.height

  const depth = dimensions.depth ?? productData.depth

  const aluminumVariantId = dimensions.aluminumVariantId ?? null

  const glassVariantId = dimensions.glassVariantId ?? null

  let materialCost = 0
  let materialSelling = 0

  const materialsSnapshot: MaterialPricingSnapshot[] = []

  for (const item of materials ?? []) {
    let material = Array.isArray(item.inventory_materials)
      ? item.inventory_materials[0]
      : item.inventory_materials

    if (!material) continue

    // Replace default material with the selected variant when applicable
    if (
      material.category === "Aluminum" &&
      aluminumVariantId &&
      material.id !== aluminumVariantId
    ) {
      const { data: variant } = await supabase
        .from("inventory_materials")
        .select(
          "id, material_name, category, unit, unit_cost, markup_percentage, color, series, thickness"
        )
        .eq("id", aluminumVariantId)
        .single()

      if (variant) {
        material = variant
      }
    }

    if (
      material.category === "Glass" &&
      glassVariantId &&
      material.id !== glassVariantId
    ) {
      const { data: variant } = await supabase
        .from("inventory_materials")
        .select(
          "id, material_name, category, unit, unit_cost, markup_percentage, color, series, thickness"
        )
        .eq("id", glassVariantId)
        .single()

      if (variant) {
        material = variant
      }
    }

    const method = Array.isArray(item.calculation_methods)
      ? item.calculation_methods[0]
      : item.calculation_methods

    const effectiveQuantity = item.is_fixed
      ? Number(item.quantity)
      : Number(item.quantity) *
        getMeasurementValue(method?.method_code ?? null, width, height, depth)

    const cost = Number(material.unit_cost) * effectiveQuantity

    materialCost += cost

    materialSelling += cost * (1 + Number(material.markup_percentage) / 100)
    materialsSnapshot.push({
      material_id: material.id,
      material_name: material.material_name,
      quantity: effectiveQuantity,
      unit: material.unit,
      unit_cost: Number(material.unit_cost),
      markup_percentage: Number(material.markup_percentage ?? 0),
      subtotal: cost * (1 + Number(material.markup_percentage ?? 0) / 100),
      color: material.color ?? null,
      series: material.series ?? null,
      thickness: material.thickness ?? null,
    })
  }

  let laborCost = 0
  let laborSelling = 0
  const laborSnapshot: LaborPricingSnapshot[] = []

  for (const item of labor ?? []) {
    const service = Array.isArray(item.labor_services)
      ? item.labor_services[0]
      : item.labor_services

    if (!service) continue

    const cost = Number(service.labor_cost) * Number(item.quantity)

    laborCost += cost

    laborSelling += cost * (1 + Number(service.markup_percentage) / 100)
    laborSnapshot.push({
      service_id: service.id,
      service_name: service.service_name,
      quantity: Number(item.quantity),
      unit: service.unit,
      labor_cost: Number(service.labor_cost),
      markup_percentage: Number(service.markup_percentage ?? 0),
      subtotal: cost * (1 + Number(service.markup_percentage ?? 0) / 100),
    })
  }

  const productionCost = materialCost + laborCost

  const baseSellingPrice = materialSelling + laborSelling

  const sellingPrice = baseSellingPrice * (1 + productMarkup / 100)

  const totalMarkup = sellingPrice - productionCost

  const round = (n: number) => Math.round(n * 100) / 100

  return {
    data: {
      width,
      height,
      depth,

      materialCost: round(materialCost),
      laborCost: round(laborCost),

      productionCost: round(productionCost),

      sellingPrice: round(sellingPrice),

      totalMarkup: round(totalMarkup),
      materialsSnapshot,
      laborSnapshot,
    },
    error: null,
  }
}
