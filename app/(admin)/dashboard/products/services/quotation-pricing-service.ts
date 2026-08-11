import { createClient } from "@/lib/supabase/client"

export interface QuotationPricingInput {
  productId: string
  width: number
  height: number
  depth?: number | null
}

export interface QuotationMaterialBreakdown {
  materialId: string
  materialName: string
  quantity: number
  unitCost: number
  markupPercentage: number
  cost: number
  sellingPrice: number
}

export interface QuotationLaborBreakdown {
  serviceId: string
  serviceName: string
  quantity: number
  laborCost: number
  markupPercentage: number
  cost: number
  sellingPrice: number
}

export interface QuotationPricingResult {
  materials: QuotationMaterialBreakdown[]
  labor: QuotationLaborBreakdown[]
  materialCost: number
  laborCost: number
  productionCost: number
  sellingPrice: number
  totalMarkup: number
}

function getMeasurementValue(
  methodKey: string | null,
  width: number,
  height: number,
  depth: number
): number {
  switch (methodKey) {
    case "width":
      return width

    case "height":
      return height

    case "depth":
      return depth

    case "perimeter":
      return 2 * (width + height)

    case "area":
      return width * height

    case "volume":
      return width * height * depth

    default:
      return 1
  }
}

export async function getQuotationPricing(
  input: QuotationPricingInput
): Promise<QuotationPricingResult> {
  const supabase = createClient()

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("markup_percentage, depth, is_depth_customizable")
    .eq("id", input.productId)
    .single()

  if (productError || !product) {
    throw new Error(productError?.message ?? "Product not found")
  }

  const depth =
    product.is_depth_customizable
      ? input.depth ?? product.depth ?? 0
      : product.depth ?? 0

  const { data: materials } = await supabase
    .from("product_materials")
    .select(
      `
      quantity,
      is_fixed,
      inventory_material_id,
      calculation_methods(method_code),
      inventory_materials(
        material_name,
        unit_cost,
        markup_percentage
      )
      `
    )
    .eq("product_id", input.productId)

  const { data: labor } = await supabase
    .from("product_labor")
    .select(
      `
      quantity,
      pricing_service_id,
      labor_services(
        service_name,
        labor_cost,
        markup_percentage
      )
      `
    )
    .eq("product_id", input.productId)

  const materialBreakdown: QuotationMaterialBreakdown[] = []

  let materialCost = 0
  let materialSelling = 0

  for (const item of materials ?? []) {
    const material = Array.isArray(item.inventory_materials)
      ? item.inventory_materials[0]
      : item.inventory_materials

    if (!material) continue

    const method = Array.isArray(item.calculation_methods)
      ? item.calculation_methods[0]
      : item.calculation_methods

    const effectiveQuantity = item.is_fixed
      ? Number(item.quantity)
      : Number(item.quantity) *
        getMeasurementValue(
          method?.method_code ?? null,
          input.width,
          input.height,
          depth
        )

    const cost = Number(material.unit_cost) * effectiveQuantity
    const selling =
      cost * (1 + Number(material.markup_percentage ?? 0) / 100)

    materialCost += cost
    materialSelling += selling

    materialBreakdown.push({
      materialId: item.inventory_material_id,
      materialName: material.material_name,
      quantity: effectiveQuantity,
      unitCost: Number(material.unit_cost),
      markupPercentage: Number(material.markup_percentage ?? 0),
      cost,
      sellingPrice: selling,
    })
  }

  const laborBreakdown: QuotationLaborBreakdown[] = []

  let laborCost = 0
  let laborSelling = 0

  for (const item of labor ?? []) {
    const service = Array.isArray(item.labor_services)
      ? item.labor_services[0]
      : item.labor_services

    if (!service) continue

    const cost = Number(service.labor_cost) * Number(item.quantity)
    const selling =
      cost * (1 + Number(service.markup_percentage ?? 0) / 100)

    laborCost += cost
    laborSelling += selling

    laborBreakdown.push({
      serviceId: item.pricing_service_id,
      serviceName: service.service_name,
      quantity: Number(item.quantity),
      laborCost: Number(service.labor_cost),
      markupPercentage: Number(service.markup_percentage ?? 0),
      cost,
      sellingPrice: selling,
    })
  }

  const productionCost = materialCost + laborCost
  const baseSellingPrice = materialSelling + laborSelling
  const sellingPrice =
    baseSellingPrice *
    (1 + Number(product.markup_percentage ?? 0) / 100)

  return {
    materials: materialBreakdown,
    labor: laborBreakdown,
    materialCost,
    laborCost,
    productionCost,
    sellingPrice,
    totalMarkup: sellingPrice - productionCost,
  }
}