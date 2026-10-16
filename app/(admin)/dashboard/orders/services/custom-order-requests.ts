import { createClient } from "@/lib/supabase/client"

import type {
  CustomOrder,
  CustomOrderReferenceImage,
} from "../types/custom-order"

const supabase = createClient()

const SIGNED_URL_EXPIRES_IN = 60 * 60

function getClientName(profile: any) {
  const firstName =
    typeof profile?.first_name === "string" ? profile.first_name.trim() : ""

  const lastName =
    typeof profile?.last_name === "string" ? profile.last_name.trim() : ""

  const fullName = [firstName, lastName].filter(Boolean).join(" ")

  return fullName || "Unknown Client"
}

async function getSignedReferenceImages(
  rows: any[]
): Promise<CustomOrderReferenceImage[]> {
  const sortedRows = [...rows].sort(
    (a, b) => Number(a.display_order ?? 0) - Number(b.display_order ?? 0)
  )

  return Promise.all(
    sortedRows.map(async (image) => {
      const imagePath = String(image.image_url)

      const { data, error } = await supabase.storage
        .from("custom-order-references")
        .createSignedUrl(imagePath, SIGNED_URL_EXPIRES_IN)

      if (error) {
        console.error("Failed to sign custom order reference image:", error)
      }

      return {
        id: image.id,
        imagePath,
        displayOrder: Number(image.display_order ?? 0),
        signedUrl: error ? null : data.signedUrl,
      }
    })
  )
}

export async function getCustomOrderRequests(): Promise<CustomOrder[]> {
  const { data, error } = await supabase
    .from("custom_order_requests")
    .select(
      `
      id,
      request_number,
      customer_id,
      contact_number,
      project_name,
      product_category,
      quantity,
      description,
      width,
      height,
      depth,
      dimension_unit,
      measurements_approximate,
      specifications,
      preferred_frame,
      preferred_glass,
      preferred_finish,
      let_fjga_recommend,
      other_preferences,
      reference_notes,
      status,
      denial_reason,
      created_at,

      profiles (
        first_name,
        last_name
      ),

      custom_order_images (
        id,
        image_url,
        display_order
      ),
      custom_order_request_addresses (
        house_building_number,
        street,
        building_subdivision,
        unit_floor,

        region_psgc_code,
        region_name,

        province_psgc_code,
        province_name,

        city_psgc_code,
        city_name,

        barangay_psgc_code,
        barangay_name,

        postal_code,
        landmark
      )
    `
    )
    .order("created_at", {
      ascending: false,
    })

  if (error) throw error

  return Promise.all(
    (data ?? []).map(async (row: any) => {
      const images = await getSignedReferenceImages(
        row.custom_order_images ?? []
      )
      const addressRow = Array.isArray(row.custom_order_request_addresses)
        ? (row.custom_order_request_addresses[0] ?? null)
        : (row.custom_order_request_addresses ?? null)

      return {
        id: row.id,
        requestNumber: row.request_number ?? null,

        customerId: row.customer_id,
        clientName: getClientName(row.profiles),
        contactNumber: row.contact_number ?? null,

        projectName: row.project_name,
        productCategory: row.product_category ?? null,
        quantity: Number(row.quantity ?? 1),

        deliveryAddress: addressRow
          ? {
              houseBuildingNumber: addressRow.house_building_number,

              street: addressRow.street,

              buildingSubdivision: addressRow.building_subdivision ?? null,

              unitFloor: addressRow.unit_floor ?? null,

              regionPsgcCode: addressRow.region_psgc_code,

              regionName: addressRow.region_name,

              provincePsgcCode: addressRow.province_psgc_code ?? null,

              provinceName: addressRow.province_name ?? null,

              cityPsgcCode: addressRow.city_psgc_code,

              cityName: addressRow.city_name,

              barangayPsgcCode: addressRow.barangay_psgc_code,

              barangayName: addressRow.barangay_name,

              postalCode: addressRow.postal_code ?? null,

              landmark: addressRow.landmark ?? null,
            }
          : null,

        description: row.description ?? null,

        width: row.width == null ? null : Number(row.width),

        height: row.height == null ? null : Number(row.height),

        depth: row.depth == null ? null : Number(row.depth),

        dimensionUnit: row.dimension_unit ?? null,

        measurementsApproximate: Boolean(row.measurements_approximate),

        specifications:
          row.specifications && typeof row.specifications === "object"
            ? row.specifications
            : {},

        preferredFrame: row.preferred_frame ?? null,

        preferredGlass: row.preferred_glass ?? null,

        preferredFinish: row.preferred_finish ?? null,

        letFjgaRecommend: Boolean(row.let_fjga_recommend),

        otherPreferences: row.other_preferences ?? null,

        referenceNotes: row.reference_notes ?? null,

        images,

        status: row.status,
        denialReason: row.denial_reason ?? null,

        createdAt: row.created_at,
      } satisfies CustomOrder
    })
  )
}

export async function denyCustomOrderRequest(
  requestId: string,
  reason: string
) {
  const trimmedReason = reason.trim()

  if (!trimmedReason) {
    throw new Error("A denial reason is required.")
  }

  const { error } = await supabase
    .from("custom_order_requests")
    .update({
      status: "denied",
      denial_reason: trimmedReason,
    })
    .eq("id", requestId)
    .eq("status", "pending")

  if (error) throw error
}
