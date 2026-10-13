import { createClient } from "@/lib/supabase/client"

import type {
  QuotationLaborOption,
  QuotationMaterialOption,
  QuotationPricingResult,
  SelectedQuotationLabor,
  SelectedQuotationMaterial,
} from "../types/quotation"

const supabase = createClient()

export async function getQuotationMaterialOptions(): Promise<
  QuotationMaterialOption[]
> {
  const { data, error } = await supabase
    .from("inventory_materials")
    .select(`
      id,
      material_name,
      category,
      specification,
      size,
      unit,
      stock_quantity,
      unit_cost,
      markup_percentage,
      color,
      series,
      thickness
    `)
    .eq("is_active", true)
    .order("material_name")

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    materialName: row.material_name,
    category: row.category,
    specification: row.specification,
    size: row.size,
    unit: row.unit,

    stockQuantity: Number(row.stock_quantity ?? 0),
    unitCost: Number(row.unit_cost ?? 0),
    markupPercentage: Number(
      row.markup_percentage ?? 0
    ),

    color: row.color ?? null,
    series: row.series ?? null,
    thickness: row.thickness ?? null,
  }))
}

export async function getQuotationLaborOptions(): Promise<
  QuotationLaborOption[]
> {
  const { data, error } = await supabase
    .from("labor_services")
    .select(`
      id,
      service_name,
      description,
      unit,
      labor_cost,
      markup_percentage
    `)
    .eq("is_active", true)
    .order("service_name")

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    serviceName: row.service_name,
    description: row.description ?? null,
    unit: row.unit,

    laborCost: Number(row.labor_cost ?? 0),
    markupPercentage: Number(
      row.markup_percentage ?? 0
    ),
  }))
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function calculateCustomQuotationPricing(
  materials: SelectedQuotationMaterial[],
  labor: SelectedQuotationLabor[],
  materialOptions: QuotationMaterialOption[],
  laborOptions: QuotationLaborOption[],
  itemQuantity: number
): QuotationPricingResult {
  if (
    !Number.isFinite(itemQuantity) ||
    itemQuantity <= 0
  ) {
    throw new Error(
      "Quotation item quantity must be greater than zero."
    )
  }

  const materialSnapshots = materials.map(
    (selected) => {
      if (
        !Number.isFinite(selected.quantity) ||
        selected.quantity <= 0
      ) {
        throw new Error(
          "Material quantity must be greater than zero."
        )
      }

      const material = materialOptions.find(
        (option) =>
          option.id === selected.materialId
      )

      if (!material) {
        throw new Error(
          "A selected material could not be found."
        )
      }

      const baseCost = roundMoney(
        material.unitCost * selected.quantity
      )

      const markupAmount = roundMoney(
        baseCost *
          (material.markupPercentage / 100)
      )

      const subtotal = roundMoney(
        baseCost + markupAmount
      )

      return {
        material_id: material.id,
        material_name: material.materialName,
        quantity: selected.quantity,
        unit: material.unit,

        unit_cost: material.unitCost,
        markup_percentage:
          material.markupPercentage,

        base_cost: baseCost,
        markup_amount: markupAmount,
        subtotal,

        color: material.color,
        series: material.series,
        thickness: material.thickness,
      }
    }
  )

  const laborSnapshots = labor.map((selected) => {
    if (
      !Number.isFinite(selected.quantity) ||
      selected.quantity <= 0
    ) {
      throw new Error(
        "Labor quantity must be greater than zero."
      )
    }

    const service = laborOptions.find(
      (option) => option.id === selected.serviceId
    )

    if (!service) {
      throw new Error(
        "A selected labor service could not be found."
      )
    }

    const baseCost = roundMoney(
      service.laborCost * selected.quantity
    )

    const markupAmount = roundMoney(
      baseCost *
        (service.markupPercentage / 100)
    )

    const subtotal = roundMoney(
      baseCost + markupAmount
    )

    return {
      service_id: service.id,
      service_name: service.serviceName,
      quantity: selected.quantity,
      unit: service.unit,

      labor_cost: service.laborCost,
      markup_percentage:
        service.markupPercentage,

      base_cost: baseCost,
      markup_amount: markupAmount,
      subtotal,
    }
  })

  const materialSubtotal = roundMoney(
    materialSnapshots.reduce(
      (sum, item) => sum + item.subtotal,
      0
    )
  )

  const laborSubtotal = roundMoney(
    laborSnapshots.reduce(
      (sum, item) => sum + item.subtotal,
      0
    )
  )

  const markupAmount = roundMoney(
    materialSnapshots.reduce(
      (sum, item) => sum + item.markup_amount,
      0
    ) +
      laborSnapshots.reduce(
        (sum, item) => sum + item.markup_amount,
        0
      )
  )

  const unitPrice = roundMoney(
    materialSubtotal + laborSubtotal
  )

  const lineTotal = roundMoney(
    unitPrice * itemQuantity
  )

  return {
    materials: materialSnapshots,
    labor: laborSnapshots,

    materialSubtotal,
    laborSubtotal,
    markupAmount,

    unitPrice,
    lineTotal,
  }
}
export interface SendCustomRequestQuotationInput {
  requestId: string
  materials: SelectedQuotationMaterial[]
  labor: SelectedQuotationLabor[]
  deliveryFee: number
  notes?: string
}

export interface SendCustomRequestQuotationResult {
  quotationId: string
  quotationNumber: string
  totalAmount: number
}

export async function sendCustomRequestQuotation(
  input: SendCustomRequestQuotationInput
): Promise<SendCustomRequestQuotationResult> {
  const {
    requestId,
    materials,
    labor,
    deliveryFee,
    notes,
  } = input

  const { data, error } = await supabase.rpc(
    "create_custom_request_quotation",
    {
      p_request_id: requestId,
      p_materials: materials,
      p_labor: labor,
      p_delivery_fee: deliveryFee,
      p_notes: notes?.trim() || null,
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  const result = Array.isArray(data)
    ? data[0]
    : data

  if (!result) {
    throw new Error(
      "The quotation was created, but no result was returned."
    )
  }

  return {
    quotationId: result.quotation_id,
    quotationNumber: result.quotation_number,
    totalAmount: Number(result.total_amount ?? 0),
  }
}