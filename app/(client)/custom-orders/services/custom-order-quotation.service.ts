import { createClient } from "@/lib/supabase/client"
import type {
  ClientQuotationDetail,
  ClientQuotationStatus,
  ClientQuotationSummary,
} from "../types/custom-order-request"

const supabase = createClient()

interface ClientQuotationRow {
  id: string
  quotation_number: string
  custom_request_id: string | null
  status: ClientQuotationStatus
  project_name: string
  subtotal: number | string
  vat_rate: number | string
  vat_amount: number | string
  delivery_fee: number | string
  total_amount: number | string
  sent_at: string | null
  accepted_at: string | null
  declined_at: string | null
}

interface ClientQuotationDetailRow extends ClientQuotationRow {
  customer_address_snapshot: string | null
  notes: string | null
  terms_and_conditions: string | null
  created_at: string

  created_by_profile_id: string | null
  created_by_name_snapshot: string | null

  quotation_items:
    | {
        id: string
        item_number: number
        item_name: string
        details: string | null

        width: number | string | null
        height: number | string | null
        depth: number | string | null
        dimension_unit: string | null

        quantity: number

        unit_price: number | string
        line_total: number | string

        materials_snapshot: unknown
      }[]
    | null
}

export async function acceptQuotation(
  quotationId: string
): Promise<AcceptQuotationResult> {
  const { data, error } = await supabase.rpc("accept_quotation", {
    p_quotation_id: quotationId,
  })

  if (error) {
    throw new Error(error.message)
  }

  const result = data?.[0]

  if (!result) {
    throw new Error("The quotation was accepted, but no order was returned.")
  }

  return {
    orderId: result.order_id,
    orderNumber: result.order_number,
  }
}

export interface AcceptQuotationResult {
  orderId: string
  orderNumber: string
}

function toNullableNumber(value: number | string | null): number | null {
  if (value === null) {
    return null
  }

  return Number(value)
}

function toMaterialSnapshotArray(value: unknown): {
  material_name?: unknown
  quantity?: unknown
  unit?: unknown
}[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(
    (
      item
    ): item is {
      material_name?: unknown
      quantity?: unknown
      unit?: unknown
    } => typeof item === "object" && item !== null
  )
}

export async function getClientQuotationById(
  quotationId: string
): Promise<ClientQuotationDetail> {
  const { data, error } = await supabase
    .from("quotations")
    .select(
      `
      id,
      quotation_number,
      custom_request_id,
      created_by_profile_id,
      created_by_name_snapshot,
      status,
      project_name,
      customer_address_snapshot,
      subtotal,
      vat_rate,
      vat_amount,
      delivery_fee,
      total_amount,
      notes,
      terms_and_conditions,
      created_at,
      sent_at,
      accepted_at,
      declined_at,

      quotation_items (
        id,
        item_number,
        item_name,
        details,
        width,
        height,
        depth,
        dimension_unit,
        quantity,
        unit_price,
        line_total,
        materials_snapshot
      )
    `
    )
    .eq("id", quotationId)
    .in("status", ["sent", "accepted", "declined"])
    .order("item_number", {
      referencedTable: "quotation_items",
      ascending: true,
    })
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const row = data as ClientQuotationDetailRow

  if (!row.custom_request_id) {
    throw new Error("Quotation is not associated with a custom request.")
  }

  const createdByName =
  row.created_by_name_snapshot?.trim() || null

  return {
    id: row.id,
    quotationNumber: row.quotation_number,
    customRequestId: row.custom_request_id,
    status: row.status,

    projectName: row.project_name,
    customerAddressSnapshot: row.customer_address_snapshot,
    subtotal: Number(row.subtotal ?? 0),
    vatRate: Number(row.vat_rate ?? 0),
    vatAmount: Number(row.vat_amount ?? 0),
    deliveryFee: Number(row.delivery_fee ?? 0),
    totalAmount: Number(row.total_amount ?? 0),

notes: row.notes,
termsAndConditions: row.terms_and_conditions,

createdByProfileId: row.created_by_profile_id,
createdByName,

createdAt: row.created_at,

sentAt: row.sent_at,
    acceptedAt: row.accepted_at,
    declinedAt: row.declined_at,

    items: (row.quotation_items ?? []).map((item) => ({
      id: item.id,
      itemNumber: item.item_number,
      itemName: item.item_name,
      details: item.details,

      width: toNullableNumber(item.width),
      height: toNullableNumber(item.height),
      depth: toNullableNumber(item.depth),
      dimensionUnit: item.dimension_unit,

      quantity: Number(item.quantity),
      unitPrice: Number(item.unit_price ?? 0),
      lineTotal: Number(item.line_total ?? 0),
      materials: toMaterialSnapshotArray(item.materials_snapshot).map(
        (material) => ({
          materialName:
            typeof material.material_name === "string"
              ? material.material_name
              : "Material",
          quantity: Number(material.quantity ?? 0),
          unit: typeof material.unit === "string" ? material.unit : "",
        })
      ),
    })),
  }
}
export async function getQuotationForCustomRequest(
  requestId: string
): Promise<ClientQuotationSummary | null> {
  const { data, error } = await supabase
    .from("quotations")
    .select(
      `
      id,
      quotation_number,
      custom_request_id,
      status,
      project_name,
      subtotal,
      vat_rate,
      vat_amount,
      delivery_fee,
      total_amount,
      sent_at,
      accepted_at,
      declined_at
    `
    )
    .eq("custom_request_id", requestId)
    .in("status", ["sent", "accepted", "declined"])
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    return null
  }

  const row = data as ClientQuotationRow

  if (!row.custom_request_id) {
    return null
  }

  return {
    id: row.id,
    quotationNumber: row.quotation_number,
    customRequestId: row.custom_request_id,
    status: row.status,
    projectName: row.project_name,
    subtotal: Number(row.subtotal ?? 0),
    vatRate: Number(row.vat_rate ?? 0),
    vatAmount: Number(row.vat_amount ?? 0),
    deliveryFee: Number(row.delivery_fee ?? 0),
    totalAmount: Number(row.total_amount ?? 0),
    sentAt: row.sent_at,
    acceptedAt: row.accepted_at,
    declinedAt: row.declined_at,
  }
}

export async function declineQuotation(quotationId: string): Promise<void> {
  const { error } = await supabase.rpc("decline_quotation", {
    p_quotation_id: quotationId,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function getQuotationHistoryForCustomRequest(
  customRequestId: string
): Promise<ClientQuotationSummary[]> {
  const { data, error } = await supabase
    .from("quotations")
    .select(
      `
      id,
      quotation_number,
      custom_request_id,
      status,
      project_name,
      subtotal,
      vat_rate,
      vat_amount,
      delivery_fee,
      total_amount,
      sent_at,
      accepted_at,
      declined_at
    `
    )
    .eq("custom_request_id", customRequestId)
    .in("status", ["sent", "accepted", "declined"])
    .order("created_at", {
      ascending: false,
    })

  if (error) {
    throw error
  }

  return (data ?? []).map((quotation) => ({
    id: quotation.id,
    quotationNumber: quotation.quotation_number,
    customRequestId: quotation.custom_request_id,
    status: quotation.status as ClientQuotationStatus,
    projectName: quotation.project_name,
    subtotal: Number(quotation.subtotal),
    vatRate: Number(quotation.vat_rate),
    vatAmount: Number(quotation.vat_amount),
    deliveryFee: Number(quotation.delivery_fee),
    totalAmount: Number(quotation.total_amount),
    sentAt: quotation.sent_at,
    acceptedAt: quotation.accepted_at,
    declinedAt: quotation.declined_at,
  }))
}
