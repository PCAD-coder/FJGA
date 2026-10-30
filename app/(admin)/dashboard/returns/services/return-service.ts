import { createClient } from "@/lib/supabase/client"

import type { ReturnRequest } from "../types/return"
import type { CompleteInspectionData } from "../components/complete-inspection-dialog"

const supabase = createClient()

function formatDate(value: string | null): string {
  if (!value) return ""

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatAmount(value: number | string | null): number {
  if (value === null) return 0

  return Number(value)
}

function isResolutionProcessingStatus(status: string): boolean {
  return status === "Repair Processing" || status === "Replacement Processing"
}

function mapStatus(
  status: string,
  hasInspection: boolean
): ReturnRequest["status"] {
  if (status === "Rejected") {
    return "declined"
  }

  if (status === "Approved") {
    return hasInspection ? "inspection-scheduled" : "approved"
  }

  if (status === "Repair Processing") {
    return "repair-processing"
  }

  if (status === "Replacement Processing") {
    return "replacement-processing"
  }

  if (
    status === "Replacement Delivered" ||
    status === "Repair Delivered"
  ) {
    return "resolved"
  }

  if (hasInspection) {
    return "inspection-scheduled"
  }

  return "under-review"
}

async function getCurrentProfileId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle()

  return profile?.id ?? null
}

export async function getAdminReturnRequests(): Promise<{
  data: ReturnRequest[]
  error: string | null
}> {
  const { data, error } = await supabase
    .from("return_requests")
    .select(
      `
      id,
      return_number,
      order_id,
      customer_id,
      issue_type,
      description,
      contact_number,
      status,
      submitted_at,
      reviewed_at,
      reviewed_by,
      review_notes,
      created_at,
      is_archived,

      customer:profiles!return_requests_customer_id_fkey (
        id,
        first_name,
        last_name,
        full_name,
        contact_number,
        profile_image
      ),

      orders (
        id,
        order_number,
        total_amount,
        order_items (
          id,
          product_id,
          product_name_snapshot
        )
      ),

      return_request_photos (
  id,
  image_url,
  storage_path,
  display_order,
  created_at
),

      return_request_timeline (
        status,
        created_at
      ),

      return_inspections (
  id,
  status,
  inspection_date,
  inspection_time,
  assigned_staff,
  inspection_notes,
  inspection_result,
  damage_confirmed,
  damage_description,
  resolution_type,
  resolution_notes,
  completed_at
),
return_resolutions (
  id,
  resolution_type,
  resolution_status,
  resolution_notes,
  created_at,
  completed_at,

  return_resolution_items (
    id,
    item_type,
    inventory_material_id,
    labor_service_id,
    quantity,
    width,
    height,
    depth,
    dimension_unit,
    notes,

    inventory_materials (
      material_name
    ),

    labor_services (
      service_name
    )
  )
)
    `
    )
    .order("submitted_at", { ascending: false })

  if (error) {
    return {
      data: [],
      error: error.message,
    }
  }

  const requests: ReturnRequest[] = []

  for (const request of data ?? []) {
    const customer = Array.isArray(request.customer)
      ? request.customer[0]
      : request.customer

    const order = Array.isArray(request.orders)
      ? request.orders[0]
      : request.orders

    const firstItem =
      order && Array.isArray(order.order_items) ? order.order_items[0] : null

    const inspections = Array.isArray(request.return_inspections)
      ? request.return_inspections
      : request.return_inspections
        ? [request.return_inspections]
        : []
    const inspection = inspections[0]
    const inspectionDetails = inspection
      ? {
          id: inspection.id,
          status: inspection.status,
          inspectionDate: inspection.inspection_date ?? null,
          inspectionTime: inspection.inspection_time ?? null,
          assignedStaff: inspection.assigned_staff ?? null,
          inspectionNotes: inspection.inspection_notes ?? null,
          inspectionResult: inspection.inspection_result ?? null,
          damageConfirmed: inspection.damage_confirmed ?? null,
          damageDescription: inspection.damage_description ?? null,
          resolutionType: inspection.resolution_type ?? null,
          resolutionNotes: inspection.resolution_notes ?? null,
          completedAt: inspection.completed_at ?? null,
        }
      : null
    const resolutions = Array.isArray(request.return_resolutions)
      ? request.return_resolutions
      : request.return_resolutions
        ? [request.return_resolutions]
        : []

    const resolution = resolutions[0]

    const resolutionItems = resolution?.return_resolution_items ?? []

    const resolutionDetails = resolution
      ? {
          id: resolution.id,
          resolutionType: resolution.resolution_type,
          resolutionStatus: resolution.resolution_status,
          resolutionNotes: resolution.resolution_notes ?? null,
          createdAt: resolution.created_at,
          completedAt: resolution.completed_at ?? null,

          items: resolutionItems.map((item) => {
            const material = Array.isArray(item.inventory_materials)
              ? item.inventory_materials[0]
              : item.inventory_materials

            const laborService = Array.isArray(item.labor_services)
              ? item.labor_services[0]
              : item.labor_services

            return {
              id: item.id,
              itemType: item.item_type,
              inventoryMaterialId: item.inventory_material_id ?? null,
              laborServiceId: item.labor_service_id ?? null,
              materialName: material?.material_name ?? null,
              laborServiceName: laborService?.service_name ?? null,
              quantity: Number(item.quantity ?? 0),
              width: item.width !== null ? Number(item.width) : null,
              height: item.height !== null ? Number(item.height) : null,
              depth: item.depth !== null ? Number(item.depth) : null,
              dimensionUnit: item.dimension_unit ?? null,
              notes: item.notes ?? null,
            }
          }),
        }
      : null

    const activeInspection = inspections.find(
      (inspection) => inspection.status === "scheduled"
    )

    const customerName =
      customer?.full_name ||
      [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") ||
      "Unknown Customer"

    let image = "/placeholder.jpg"

    const photos = Array.isArray(request.return_request_photos)
      ? request.return_request_photos
      : []

    const firstPhoto = [...photos].sort(
      (a, b) => a.display_order - b.display_order
    )[0]

    if (firstPhoto?.storage_path) {
      const { data: signedUrl } = await supabase.storage
        .from("return-photos")
        .createSignedUrl(firstPhoto.storage_path, 60 * 60)

      if (signedUrl?.signedUrl) {
        image = signedUrl.signedUrl
      }
    }

    requests.push({
      id: request.id,
      orderNumber: order?.order_number ?? request.order_id,
      clientName: customerName,
      productType: firstItem?.product_name_snapshot ?? "Product",
      title: request.issue_type,
      image,
      issueDescription: request.description,
      originalAmount: formatAmount(order?.total_amount),
      reportedDate: formatDate(request.submitted_at),
      status: mapStatus(request.status, Boolean(activeInspection)),
      archived: request.is_archived ?? false,
      inspectionId: inspection?.id ?? null,
      inspection: inspectionDetails,
        timeline: (request.return_request_timeline ?? [])
    .map((entry) => ({
      status: entry.status,
      createdAt: entry.created_at,
    }))
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    ),
      resolution: resolutionDetails,
    })
  }

  return {
    data: requests,
    error: null,
  }
}

export async function approveReturnRequest(
  returnRequestId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.rpc("decide_return_request", {
    p_return_request_id: returnRequestId,
    p_decision: "approve",
    p_reason: null,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return {
    error: null,
  }
}

export async function declineReturnRequest(
  returnRequestId: string,
  reason: string
): Promise<{ error: string | null }> {
  const declineReason = reason.trim()

  if (!declineReason) {
    return {
      error: "A decline reason is required.",
    }
  }

  const { error } = await supabase.rpc("decide_return_request", {
    p_return_request_id: returnRequestId,
    p_decision: "decline",
    p_reason: declineReason,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return {
    error: null,
  }
}

export async function scheduleReturnInspection(
  returnRequestId: string,
  date: string,
  time: string,
  assignedStaff: string,
  notes: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.rpc("schedule_return_inspection", {
    p_return_request_id: returnRequestId,
    p_inspection_date: date,
    p_inspection_time: time,
    p_assigned_staff: assignedStaff.trim() || null,
    p_notes: notes.trim() || null,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return {
    error: null,
  }
}
export async function completeReturnInspection(
  returnRequestId: string,
  inspection: CompleteInspectionData
): Promise<{ data: boolean | null; error: string | null }> {
  try {
    const { error } = await supabase.rpc("complete_return_inspection", {
      p_return_request_id: returnRequestId,
      p_inspection_result: inspection.inspectionResult,
      p_damage_confirmed: inspection.damageConfirmed,
      p_damage_description: inspection.damageDescription.trim(),
      p_resolution_type: inspection.resolutionType,
      p_resolution_notes: inspection.resolutionNotes.trim(),
    })

    if (error) {
      return {
        data: null,
        error: error.message,
      }
    }

    return {
      data: true,
      error: null,
    }
  } catch (error) {
    console.error("Failed to complete return inspection:", error)

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to complete the inspection.",
    }
  }
}

export async function startReturnResolution(
  returnRequestId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.rpc("start_return_resolution", {
    p_return_request_id: returnRequestId,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return {
    error: null,
  }
}

export async function getReturnResolutionMaterials(
  returnRequestId: string
): Promise<{
  data: Array<{
    id: string
    material_name: string
    category: string | null
    specification: string | null
    size: string | null
    unit: string | null
    unit_cost: number
  }>
  error: string | null
}> {
  const { data: returnRequest, error: returnRequestError } = await supabase
    .from("return_requests")
    .select(
      `
      id,
      orders (
        order_items (
          materials_snapshot
        )
      )
      `
    )
    .eq("id", returnRequestId)
    .maybeSingle()

  if (returnRequestError) {
    return {
      data: [],
      error: returnRequestError.message,
    }
  }

  if (!returnRequest) {
    return {
      data: [],
      error: "Return request was not found.",
    }
  }

  const order = Array.isArray(returnRequest.orders)
    ? returnRequest.orders[0]
    : returnRequest.orders

  const orderItems = order?.order_items ?? []
  const orderItem = orderItems[0]

  if (!orderItem) {
    return {
      data: [],
      error: "The ordered product could not be identified.",
    }
  }

  const snapshot = Array.isArray(orderItem.materials_snapshot)
    ? orderItem.materials_snapshot
    : []

  return {
    data: snapshot
      .filter((material) => material?.material_id && material?.material_name)
      .map((material) => ({
        id: material.material_id,
        material_name: material.material_name,
        category: null,
        specification: null,
        size: null,
        unit: material.unit ?? null,
        unit_cost: Number(material.unit_cost ?? 0),
      })),
    error: null,
  }
}
export async function getReturnResolutionLaborServices(
  returnRequestId: string
): Promise<{
  data: Array<{
    id: string
    service_name: string
    description: string | null
    unit: string | null
    labor_cost: number
  }>
  error: string | null
}> {
  const { data: returnRequest, error: returnRequestError } = await supabase
    .from("return_requests")
    .select(
      `
      id,
      orders (
        order_items (
          labor_snapshot
        )
      )
      `
    )
    .eq("id", returnRequestId)
    .maybeSingle()

  if (returnRequestError) {
    return {
      data: [],
      error: returnRequestError.message,
    }
  }

  if (!returnRequest) {
    return {
      data: [],
      error: "Return request was not found.",
    }
  }

  const order = Array.isArray(returnRequest.orders)
    ? returnRequest.orders[0]
    : returnRequest.orders

  const orderItems = order?.order_items ?? []
  const orderItem = orderItems[0]

  if (!orderItem) {
    return {
      data: [],
      error: "The ordered product could not be identified.",
    }
  }

  const snapshot = Array.isArray(orderItem.labor_snapshot)
    ? orderItem.labor_snapshot
    : []

  return {
    data: snapshot
      .filter((service) => service?.service_id && service?.service_name)
      .map((service) => ({
        id: service.service_id,
        service_name: service.service_name,
        description: null,
        unit: service.unit ?? null,
        labor_cost: Number(service.labor_cost ?? 0),
      })),
    error: null,
  }
}
export async function getReturnResolutionDimensions(
  returnRequestId: string
): Promise<{
  data: {
    width: number | null
    height: number | null
    depth: number | null
    dimensionUnit: string
  } | null
  error: string | null
}> {
  const { data: returnRequest, error: returnRequestError } = await supabase
    .from("return_requests")
    .select(
      `
      id,
      orders (
        order_items (
          product_id,
          width,
          height,
          depth,
          dimension_unit
        )
      )
      `
    )
    .eq("id", returnRequestId)
    .maybeSingle()

  if (returnRequestError) {
    return {
      data: null,
      error: returnRequestError.message,
    }
  }

  if (!returnRequest) {
    return {
      data: null,
      error: "Return request was not found.",
    }
  }

  const order = Array.isArray(returnRequest.orders)
    ? returnRequest.orders[0]
    : returnRequest.orders

  const orderItems = order?.order_items ?? []

  const orderItem = orderItems[0]

  if (!orderItem) {
    return {
      data: null,
      error: "The ordered product could not be identified.",
    }
  }

  return {
    data: {
      width: orderItem.width ?? null,
      height: orderItem.height ?? null,
      depth: orderItem.depth ?? null,
      dimensionUnit: orderItem.dimension_unit ?? "cm",
    },
    error: null,
  }
}
export interface ReturnResolutionItemInput {
  itemType: "material" | "labor"
  inventoryMaterialId?: string | null
  laborServiceId?: string | null
  quantity: number
  width?: number | null
  height?: number | null
  depth?: number | null
  dimensionUnit?: string | null
  notes?: string | null
}

export async function addReturnResolutionItems(
  resolutionId: string,
  items: ReturnResolutionItemInput[]
): Promise<{
  data: boolean | null
  error: string | null
}> {
  if (items.length === 0) {
    return {
      data: null,
      error: "At least one resolution item is required.",
    }
  }

  for (const item of items) {
    if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
      return {
        data: null,
        error: "All resolution item quantities must be greater than zero.",
      }
    }

    if (item.itemType === "material" && !item.inventoryMaterialId) {
      return {
        data: null,
        error: "A material must be selected for material items.",
      }
    }

    if (item.itemType === "labor" && !item.laborServiceId) {
      return {
        data: null,
        error: "A labor service must be selected for labor items.",
      }
    }
  }

  const rows = items.map((item) => ({
    resolution_id: resolutionId,
    item_type: item.itemType,
    inventory_material_id:
      item.itemType === "material" ? item.inventoryMaterialId : null,
    labor_service_id: item.itemType === "labor" ? item.laborServiceId : null,
    quantity: item.quantity,
    width: item.width ?? null,
    height: item.height ?? null,
    depth: item.depth ?? null,
    dimension_unit: item.dimensionUnit ?? null,
    notes: item.notes?.trim() || null,
  }))

  const { error } = await supabase.from("return_resolution_items").insert(rows)

  if (error) {
    return {
      data: null,
      error: error.message,
    }
  }

  return {
    data: true,
    error: null,
  }
}

export async function archiveReturnRequest(
  returnRequestId: string
) {
  const { data, error } = await supabase.rpc(
    "archive_return_request",
    {
      p_return_request_id: returnRequestId,
    }
  )

  if (error) {
    throw new Error(
      error.message || "Failed to archive return request"
    )
  }

  return data
}
