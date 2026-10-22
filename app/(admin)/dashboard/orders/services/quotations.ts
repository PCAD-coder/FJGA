import { createClient } from "@/lib/supabase/client"

import type { QuotationListItem } from "../types/custom-order"
import type { QuotationDetail, QuotationDetailItem } from "../types/quotation"

const supabase = createClient()

interface QuotationRow {
  id: string
  quotation_number: string
  customer_id: string

  source_type: "catalog" | "custom_request"
  custom_request_id: string | null

  project_name: string
  status: "draft" | "sent" | "accepted" | "declined"

  subtotal: number | string
  vat_rate: number | string
  vat_amount: number | string
  delivery_fee: number | string
  total_amount: number | string

  created_at: string
  sent_at: string | null
  accepted_at: string | null
  declined_at: string | null

  profiles:
    | {
        first_name: string | null
        last_name: string | null
        full_name: string | null
      }
    | {
        first_name: string | null
        last_name: string | null
        full_name: string | null
      }[]
    | null

  custom_order_requests:
    | {
        request_number: string | null
      }
    | {
        request_number: string | null
      }[]
    | null
}
interface QuotationDetailRow extends QuotationRow {
  customer_address_snapshot: string | null
  notes: string | null

  quotation_items:
    | {
        id: string
        item_number: number

        product_id: string | null
        item_name: string
        details: string | null

        width: number | string | null
        height: number | string | null
        depth: number | string | null
        dimension_unit: string | null

        quantity: number

        material_subtotal: number | string
        labor_subtotal: number | string
        markup_amount: number | string

        unit_price: number | string
        line_total: number | string

        materials_snapshot: unknown
        labor_snapshot: unknown
      }[]
    | null
}

function toNullableNumber(value: number | string | null): number | null {
  if (value === null) {
    return null
  }

  return Number(value)
}

function toSnapshotArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : []
}

function getSingleRelation<T>(relation: T | T[] | null): T | null {
  if (!relation) {
    return null
  }

  if (Array.isArray(relation)) {
    return relation[0] ?? null
  }

  return relation
}
function getClientName(
  profile: {
    first_name: string | null
    last_name: string | null
    full_name: string | null
  } | null
): string {
  if (!profile) {
    return "Unknown Client"
  }

  const firstName = profile.first_name?.trim() ?? ""

  const lastName = profile.last_name?.trim() ?? ""

  const structuredName = [firstName, lastName].filter(Boolean).join(" ")

  if (structuredName) {
    return structuredName
  }

  const fullName = profile.full_name?.trim() ?? ""

  if (fullName) {
    return fullName
  }

  return "Unknown Client"
}

export async function getQuotations(): Promise<QuotationListItem[]> {
  const { data, error } = await supabase
    .from("quotations")
    .select(
      `
      id,
      quotation_number,
      customer_id,
      source_type,
      custom_request_id,
      project_name,
      status,
      subtotal,
      vat_rate,
      vat_amount,
      delivery_fee,
      total_amount,
      created_at,
      sent_at,
      accepted_at,
      declined_at,
      profiles!quotations_customer_id_fkey (
        first_name,
        last_name,
        full_name
      ),
      custom_order_requests!quotations_custom_request_id_fkey (
        request_number
      )
    `
    )
    .order("created_at", {
      ascending: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  const rows = (data ?? []) as QuotationRow[]

  const revisionNumbers = new Map<string, number>()

  const groupedByRequest = new Map<string, QuotationRow[]>()

  for (const row of rows) {
    if (row.source_type !== "custom_request" || !row.custom_request_id) {
      continue
    }

    const existing = groupedByRequest.get(row.custom_request_id) ?? []

    existing.push(row)

    groupedByRequest.set(row.custom_request_id, existing)
  }

  for (const quotations of groupedByRequest.values()) {
    const chronological = [...quotations].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    chronological.forEach((quotation, index) => {
      revisionNumbers.set(quotation.id, index + 1)
    })
  }

  return rows.map((row) => {
    const profile = getSingleRelation(row.profiles)

    const request = getSingleRelation(row.custom_order_requests)

    const clientName = getClientName(profile)

    return {
      id: row.id,
      quotationNumber: row.quotation_number,

      customerId: row.customer_id,
      clientName,

      sourceType: row.source_type,
      customRequestId: row.custom_request_id,

      revisionNumber:
        row.source_type === "custom_request"
          ? (revisionNumbers.get(row.id) ?? 1)
          : null,

      requestNumber: request?.request_number ?? null,

      projectName: row.project_name,
      status: row.status,

      subtotal: Number(row.subtotal ?? 0),
      deliveryFee: Number(row.delivery_fee ?? 0),
      totalAmount: Number(row.total_amount ?? 0),

      createdAt: row.created_at,
      sentAt: row.sent_at,
      acceptedAt: row.accepted_at,
      declinedAt: row.declined_at,
    }
  })
}

export async function getQuotationById(
  quotationId: string
): Promise<QuotationDetail> {
  const { data, error } = await supabase
    .from("quotations")
    .select(
      `
      id,
      quotation_number,
      customer_id,
      source_type,
      custom_request_id,
      project_name,
      customer_address_snapshot,
      status,
      subtotal,
      delivery_fee,
      total_amount,
      notes,
      created_at,
      sent_at,
      accepted_at,
      declined_at,

      profiles!quotations_customer_id_fkey (
        first_name,
        last_name,
        full_name
      ),

      custom_order_requests!quotations_custom_request_id_fkey (
        request_number
      ),

      quotation_items (
        id,
        item_number,
        product_id,
        item_name,
        details,
        width,
        height,
        depth,
        dimension_unit,
        quantity,
        material_subtotal,
        labor_subtotal,
        markup_amount,
        unit_price,
        line_total,
        materials_snapshot,
        labor_snapshot
      )
    `
    )
    .eq("id", quotationId)
    .order("item_number", {
      referencedTable: "quotation_items",
      ascending: true,
    })
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const row = data as QuotationDetailRow

  const profile = getSingleRelation(row.profiles)

  const request = getSingleRelation(row.custom_order_requests)

  const clientName = getClientName(profile)

  const items: QuotationDetailItem[] = (row.quotation_items ?? []).map(
    (item) => {
      const materialsSnapshot = toSnapshotArray<
        QuotationDetailItem["materialsSnapshot"][number]
      >(item.materials_snapshot)

      return {
        id: item.id,
        itemNumber: item.item_number,

        productId: item.product_id,
        itemName: item.item_name,
        details: item.details,

        width: toNullableNumber(item.width),
        height: toNullableNumber(item.height),
        depth: toNullableNumber(item.depth),
        dimensionUnit: item.dimension_unit,

        quantity: Number(item.quantity),

        materialSubtotal: Number(item.material_subtotal ?? 0),

        laborSubtotal: Number(item.labor_subtotal ?? 0),

        markupAmount: Number(item.markup_amount ?? 0),

        unitPrice: Number(item.unit_price ?? 0),

        lineTotal: Number(item.line_total ?? 0),

        materials: materialsSnapshot.map((material) => ({
          materialName: material.material_name,
          quantity: Number(material.quantity ?? 0),
          unit: material.unit,
        })),

        materialsSnapshot,

        laborSnapshot: toSnapshotArray<
          QuotationDetailItem["laborSnapshot"][number]
        >(item.labor_snapshot),
      }
    }
  )

  return {
    id: row.id,
    quotationNumber: row.quotation_number,

    customerId: row.customer_id,
    clientName,

    sourceType: row.source_type,
    customRequestId: row.custom_request_id,
    requestNumber: request?.request_number ?? null,

    projectName: row.project_name,
    customerAddressSnapshot: row.customer_address_snapshot,

    status: row.status,

    subtotal: Number(row.subtotal ?? 0),
    vatRate: Number(row.vat_rate ?? 0),
    vatAmount: Number(row.vat_amount ?? 0),
    deliveryFee: Number(row.delivery_fee ?? 0),
    totalAmount: Number(row.total_amount ?? 0),

    notes: row.notes,

    createdAt: row.created_at,
    sentAt: row.sent_at,
    acceptedAt: row.accepted_at,
    declinedAt: row.declined_at,

    items,
  }
}
