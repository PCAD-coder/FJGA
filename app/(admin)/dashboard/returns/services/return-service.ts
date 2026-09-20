import { createClient } from "@/lib/supabase/client"

import type { ReturnRequest } from "../types/return"
import type { CompleteInspectionData } from "../components/complete-inspection-dialog"
import type { ResolutionDialogData } from "../components/resolution-dialog"

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

  if (status === "Replacement Delivered") {
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
      inspectionId: inspection?.id ?? null,
      inspection: inspectionDetails,
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
  const profileId = await getCurrentProfileId()

  if (!profileId) {
    return {
      error: "You must be logged in to approve a return request.",
    }
  }

  const { error } = await supabase
    .from("return_requests")
    .update({
      status: "Approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: profileId,
      review_notes: null,
    })
    .eq("id", returnRequestId)

  if (error) {
    return {
      error: error.message,
    }
  }

  const { error: timelineError } = await supabase
    .from("return_request_timeline")
    .insert({
      return_request_id: returnRequestId,
      status: "Approved",
      created_by: profileId,
    })

  if (timelineError) {
    return {
      error: timelineError.message,
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
  const profileId = await getCurrentProfileId()

  if (!profileId) {
    return {
      error: "You must be logged in to decline a return request.",
    }
  }

  const { error } = await supabase
    .from("return_requests")
    .update({
      status: "Rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: profileId,
      review_notes: reason.trim(),
    })
    .eq("id", returnRequestId)

  if (error) {
    return {
      error: error.message,
    }
  }

  const { error: timelineError } = await supabase
    .from("return_request_timeline")
    .insert({
      return_request_id: returnRequestId,
      status: "Rejected",
      created_by: profileId,
    })

  if (timelineError) {
    return {
      error: timelineError.message,
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
  // Verify that the return request exists
  // and has already been approved.
  const { data: returnRequest, error: requestError } = await supabase
    .from("return_requests")
    .select("id, status")
    .eq("id", returnRequestId)
    .maybeSingle()

  if (requestError) {
    return {
      error: requestError.message,
    }
  }

  if (!returnRequest) {
    return {
      error: "Return request was not found.",
    }
  }

  if (returnRequest.status !== "Approved") {
    return {
      error:
        "The return request must be approved before an inspection can be scheduled.",
    }
  }

  const { error } = await supabase.from("return_inspections").upsert(
    {
      return_request_id: returnRequestId,
      inspection_date: date,
      inspection_time: time,
      assigned_staff: assignedStaff.trim() || null,
      inspection_notes: notes.trim() || null,
      status: "scheduled",
    },
    {
      onConflict: "return_request_id",
    }
  )

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
  const supabase = createClient()

  try {
    /*
     * ========================================================
     * GET CURRENT ADMIN
     * ========================================================
     */

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        data: null,
        error: "You must be signed in to complete an inspection.",
      }
    }

    const { data: adminProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .eq("role", "admin")
      .single()

    if (profileError || !adminProfile) {
      return {
        data: null,
        error: "Admin profile could not be found.",
      }
    }

    /*
     * ========================================================
     * GET RETURN REQUEST
     * ========================================================
     */

    const { data: returnRequest, error: requestError } = await supabase
      .from("return_requests")
      .select("id, status")
      .eq("id", returnRequestId)
      .single()

    if (requestError || !returnRequest) {
      return {
        data: null,
        error: "Return request could not be found.",
      }
    }

    /*
     * ========================================================
     * VALIDATE REQUEST STATUS
     * ========================================================
     */

    if (returnRequest.status !== "Approved") {
      return {
        data: null,
        error:
          "The return request must be approved before the inspection can be completed.",
      }
    }

    /*
     * ========================================================
     * GET INSPECTION
     * ========================================================
     */

    const { data: existingInspection, error: inspectionError } = await supabase
      .from("return_inspections")
      .select("id, status")
      .eq("return_request_id", returnRequestId)
      .single()

    if (inspectionError || !existingInspection) {
      return {
        data: null,
        error:
          "A scheduled inspection could not be found for this return request.",
      }
    }

    /*
     * ========================================================
     * VALIDATE INSPECTION STATUS
     * ========================================================
     */

    if (existingInspection.status !== "scheduled") {
      return {
        data: null,
        error: "Only a scheduled inspection can be completed.",
      }
    }

    /*
     * ========================================================
     * VALIDATE INSPECTION DATA
     * ========================================================
     */

    if (!inspection.damageDescription.trim()) {
      return {
        data: null,
        error: "Inspection findings are required.",
      }
    }

    if (!inspection.resolutionNotes.trim()) {
      return {
        data: null,
        error: "Resolution notes are required.",
      }
    }

    if (
      inspection.inspectionResult === "damage_confirmed" &&
      !inspection.damageConfirmed
    ) {
      return {
        data: null,
        error: "A damage-confirmed inspection must confirm the damage.",
      }
    }

    if (
      inspection.inspectionResult !== "damage_confirmed" &&
      inspection.resolutionType !== "no_action"
    ) {
      return {
        data: null,
        error:
          "No Action must be selected when no qualifying damage is confirmed.",
      }
    }

    /*
     * ========================================================
     * DETERMINE RETURN REQUEST STATUS
     * ========================================================
     *
     * The current return_requests table does not have a
     * separate Repair Processing status.
     *
     * Therefore both repair and replacement work use the
     * existing Replacement Processing status for now.
     */

    const nextReturnStatus =
      inspection.resolutionType === "no_action"
        ? "Rejected"
        : "Replacement Processing"

    /*
     * ========================================================
     * UPDATE INSPECTION
     * ========================================================
     */

    const { error: updateInspectionError } = await supabase
      .from("return_inspections")
      .update({
        inspection_result: inspection.inspectionResult,

        damage_confirmed: inspection.damageConfirmed,

        damage_description: inspection.damageDescription.trim(),

        resolution_type: inspection.resolutionType,

        resolution_notes: inspection.resolutionNotes.trim(),

        status: "completed",

        completed_at: new Date().toISOString(),
      })
      .eq("id", existingInspection.id)

    if (updateInspectionError) {
      return {
        data: null,
        error: updateInspectionError.message,
      }
    }

    /*
     * ========================================================
     * UPDATE RETURN REQUEST
     * ========================================================
     */

    const { error: updateRequestError } = await supabase
      .from("return_requests")
      .update({
        status: nextReturnStatus,

        reviewed_at: new Date().toISOString(),

        reviewed_by: adminProfile.id,

        review_notes: inspection.resolutionNotes.trim(),
      })
      .eq("id", returnRequestId)

    if (updateRequestError) {
      return {
        data: null,
        error: updateRequestError.message,
      }
    }

    /*
     * ========================================================
     * ADD TIMELINE EVENT
     * ========================================================
     */

    const { error: timelineError } = await supabase
      .from("return_request_timeline")
      .insert({
        return_request_id: returnRequestId,
        status: nextReturnStatus,
        created_by: adminProfile.id,
      })

    if (timelineError) {
      return {
        data: null,
        error: timelineError.message,
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
export async function createReturnResolution(
  returnRequestId: string,
  inspectionId: string,
  data: ResolutionDialogData
): Promise<{
  data: string | null
  error: string | null
}> {
  const supabase = createClient()

  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return {
        data: null,
        error: "You must be signed in.",
      }
    }

    const { data: adminProfile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .eq("role", "admin")
      .single()

    if (profileError || !adminProfile) {
      return {
        data: null,
        error: "Admin profile could not be found.",
      }
    }

    const { data: returnRequest, error: requestError } = await supabase
      .from("return_requests")
      .select("id, status")
      .eq("id", returnRequestId)
      .single()

    if (requestError || !returnRequest) {
      return {
        data: null,
        error: "Return request could not be found.",
      }
    }

    if (returnRequest.status !== "Replacement Processing") {
      return {
        data: null,
        error:
          "A resolution can only be created for a return that is being processed.",
      }
    }

    const { data: inspection, error: inspectionError } = await supabase
      .from("return_inspections")
      .select("id, status, inspection_result, resolution_type")
      .eq("id", inspectionId)
      .eq("return_request_id", returnRequestId)
      .single()

    if (inspectionError || !inspection) {
      return {
        data: null,
        error: "Completed inspection could not be found.",
      }
    }

    if (inspection.status !== "completed") {
      return {
        data: null,
        error:
          "The inspection must be completed before a resolution can be created.",
      }
    }

    if (inspection.resolution_type !== data.resolutionType) {
      return {
        data: null,
        error:
          "The selected resolution does not match the completed inspection.",
      }
    }

    const { data: existingResolution } = await supabase
      .from("return_resolutions")
      .select("id")
      .eq("return_request_id", returnRequestId)
      .maybeSingle()

    if (existingResolution) {
      return {
        data: null,
        error: "A resolution already exists for this return request.",
      }
    }

const { data: resolution, error: insertError } = await supabase
  .from("return_resolutions")
  .insert({
    return_request_id: returnRequestId,
    inspection_id: inspectionId,
    resolution_type: data.resolutionType,
    resolution_status: "pending",
    resolution_notes: data.resolutionNotes.trim(),
    created_by: adminProfile.id,
  })
  .select("id")
  .single()

if (insertError) {
  return {
    data: null,
    error: insertError.message,
  }
}

if (!resolution) {
  return {
    data: null,
    error: "The return resolution was created but its ID could not be retrieved.",
  }
}

return {
  data: resolution.id,
  error: null,
}
  } catch (error) {
    console.error("Failed to create return resolution:", error)

    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create the return resolution.",
    }
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
      item.itemType === "material"
        ? item.inventoryMaterialId
        : null,
    labor_service_id:
      item.itemType === "labor"
        ? item.laborServiceId
        : null,
    quantity: item.quantity,
    width: item.width ?? null,
    height: item.height ?? null,
    depth: item.depth ?? null,
    dimension_unit: item.dimensionUnit ?? null,
    notes: item.notes?.trim() || null,
  }))

  const { error } = await supabase
    .from("return_resolution_items")
    .insert(rows)

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
