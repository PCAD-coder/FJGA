"use server"

import { createClient } from "@/lib/supabase/server"
import { adminSupabase } from "@/lib/supabase/admin"

import type { DeliveryAddressInput } from "@/types/delivery-address"
import type { ProjectDetailsData } from "../components/request-form/project-details-step"
import type { SpecificationsData } from "../components/request-form/specifications-step"

export interface CreateCustomOrderRequestServerInput {
  projectDetails: ProjectDetailsData
  specifications: SpecificationsData
  contactNumber: string
  deliveryAddress: DeliveryAddressInput
  referenceNotes: string
  siteVisitRequestId?: string | null
}

function convertToCentimeters(value: number, unit: string): number {
  switch (unit) {
    case "mm":
      return value / 10

    case "in":
      return value * 2.54

    case "m":
      return value * 100

    case "ft":
      return value * 30.48

    case "cm":
      return value

    default:
      throw new Error("Unsupported measurement unit.")
  }
}

export async function createCustomOrderRequestServer(
  input: CreateCustomOrderRequestServerInput
): Promise<string> {
  const supabase = await createClient()

  // ==========================================================
  // 1. Authenticate
  // ==========================================================

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    throw new Error(authError.message)
  }

  if (!user) {
    throw new Error("Authentication required")
  }

  // ==========================================================
  // 2. Resolve the authenticated customer's profile
  // ==========================================================

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single()

  if (profileError || !profile) {
    throw new Error(profileError?.message || "Customer profile not found")
  }

  if (profile.role !== "client") {
    throw new Error("Only clients can submit custom order requests.")
  }

  const {
    projectDetails,
    specifications,
    contactNumber,
    deliveryAddress,
    referenceNotes,
    siteVisitRequestId,
  } = input

  let trustedSpecifications = specifications
  let trustedContactNumber = contactNumber
  let trustedDeliveryAddress = deliveryAddress

  if (siteVisitRequestId) {
    const { data: visit, error: visitError } = await adminSupabase
      .from("site_visit_requests")
      .select("*")
      .eq("id", siteVisitRequestId)
      .single()

    if (visitError || !visit) {
      throw new Error("Completed on-site visit not found.")
    }

    if (visit.customer_id !== profile.id) {
      throw new Error("This on-site visit does not belong to your account.")
    }

    if (visit.status !== "completed") {
      throw new Error(
        "Only completed on-site visits can be used for a custom request."
      )
    }

    if (visit.actual_width == null || visit.actual_height == null) {
      throw new Error("The on-site visit has no confirmed measurements.")
    }

    const { data: existingRequest, error: existingRequestError } =
      await adminSupabase
        .from("custom_order_requests")
        .select("id")
        .eq("site_visit_request_id", siteVisitRequestId)
        .maybeSingle()

    if (existingRequestError) {
      throw new Error(existingRequestError.message)
    }

    if (existingRequest) {
      throw new Error(
        "A custom request has already been created from this on-site visit."
      )
    }

    trustedSpecifications = {
      ...specifications,
      dimensionUnit: "cm",
      width: String(visit.actual_width),
      height: String(visit.actual_height),
      depth: visit.actual_depth == null ? "" : String(visit.actual_depth),
      measurementsApproximate: false,
    }

    trustedContactNumber = visit.contact_number
    trustedDeliveryAddress = {
      houseBuildingNumber: visit.house_building_number,
      street: visit.street,
      buildingSubdivision: visit.building_subdivision ?? "",
      unitFloor: visit.unit_floor ?? "",
      regionPsgcCode: visit.region_psgc_code,
      regionName: visit.region_name,
      provincePsgcCode: visit.province_psgc_code,
      provinceName: visit.province_name,
      cityPsgcCode: visit.city_psgc_code,
      cityName: visit.city_name,
      barangayPsgcCode: visit.barangay_psgc_code,
      barangayName: visit.barangay_name,
      postalCode: visit.postal_code ?? "",
      landmark: visit.landmark ?? "",
    }
  }

  // ==========================================================
  // 3. Basic server-side validation
  // ==========================================================

  if (!projectDetails.projectName.trim()) {
    throw new Error("Project name is required.")
  }

  if (!Number.isInteger(projectDetails.quantity) || projectDetails.quantity < 1 || projectDetails.quantity > 100) {
    throw new Error("Quantity must be a whole number between 1 and 100.")
  }

  if (!/^09[0-9]{9}$/.test(trustedContactNumber)) {
    throw new Error("Contact number must start with 09 and contain exactly 11 digits.")
  }

  if (!/^\d+$/.test(trustedDeliveryAddress.houseBuildingNumber)) {
    throw new Error("House or building number must contain whole numbers only.")
  }

  if (!trustedDeliveryAddress.street.trim()) {
    throw new Error("Street is required.")
  }

  if (!trustedDeliveryAddress.regionPsgcCode) {
    throw new Error("Region is required.")
  }

  if (!trustedDeliveryAddress.cityPsgcCode) {
    throw new Error("City or municipality is required.")
  }

  if (!trustedDeliveryAddress.barangayPsgcCode) {
    throw new Error("Barangay is required.")
  }

  // ==========================================================
  // 4. Authoritative delivery coverage validation
  // ==========================================================

  const { data: deliveryData, error: deliveryError } = await supabase.rpc(
    "get_delivery_fee_for_address",
    {
      p_city_psgc_code: trustedDeliveryAddress.cityPsgcCode.trim(),
      p_barangay_psgc_code: trustedDeliveryAddress.barangayPsgcCode.trim(),
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

  // ==========================================================
  // 5. Parse dimensions
  // ==========================================================

  const width = Number(trustedSpecifications.width)
  const height = Number(trustedSpecifications.height)

  const depth =
    trustedSpecifications.depth.trim() === "" ? null : Number(trustedSpecifications.depth)

  if (!Number.isFinite(width) || width <= 0) {
    throw new Error("A valid width is required.")
  }

  if (!Number.isFinite(height) || height <= 0) {
    throw new Error("A valid height is required.")
  }

  if (depth !== null && (!Number.isFinite(depth) || depth <= 0)) {
    throw new Error("Depth must be greater than zero.")
  }

  const widthCm = convertToCentimeters(width, trustedSpecifications.dimensionUnit)

  const heightCm = convertToCentimeters(height, trustedSpecifications.dimensionUnit)

  const depthCm =
    depth === null
      ? null
      : convertToCentimeters(depth, trustedSpecifications.dimensionUnit)

  // ==========================================================
  // 6. Atomic request + address creation
  // ==========================================================

  const { data: requestId, error: requestError } = await adminSupabase.rpc(
    "create_custom_order_request_transaction",
    {
      p_customer_id: profile.id,

      p_contact_number: trustedContactNumber.trim(),

      p_project_name: projectDetails.projectName.trim(),
      p_product_category: projectDetails.category,
      p_quantity: projectDetails.quantity,
      p_description: projectDetails.description,

      p_width: widthCm,
      p_height: heightCm,
      p_depth: depthCm,
      p_dimension_unit: "cm",

      p_measurements_approximate: trustedSpecifications.measurementsApproximate,

      p_specifications: specifications.specifications,

      p_preferred_frame: specifications.letFjgaRecommend
        ? null
        : specifications.preferredFrame || null,

      p_preferred_glass: specifications.letFjgaRecommend
        ? null
        : specifications.preferredGlass || null,

      p_preferred_finish: specifications.letFjgaRecommend
        ? null
        : specifications.preferredFinish || null,

      p_let_fjga_recommend: specifications.letFjgaRecommend,

      p_other_preferences: specifications.otherPreferences.trim() || null,

      p_reference_notes: null,

      p_address: {
        house_building_number: trustedDeliveryAddress.houseBuildingNumber.trim(),

        street: trustedDeliveryAddress.street.trim(),

        building_subdivision:
          trustedDeliveryAddress.buildingSubdivision.trim() || null,

        unit_floor: trustedDeliveryAddress.unitFloor.trim() || null,

        region_psgc_code: trustedDeliveryAddress.regionPsgcCode.trim(),

        region_name: trustedDeliveryAddress.regionName.trim(),

        province_psgc_code: trustedDeliveryAddress.provincePsgcCode?.trim() || null,

        province_name: trustedDeliveryAddress.provinceName?.trim() || null,

        city_psgc_code: trustedDeliveryAddress.cityPsgcCode.trim(),

        city_name: trustedDeliveryAddress.cityName.trim(),

        barangay_psgc_code: trustedDeliveryAddress.barangayPsgcCode.trim(),

        barangay_name: trustedDeliveryAddress.barangayName.trim(),

        postal_code: trustedDeliveryAddress.postalCode.trim() || null,

        landmark: trustedDeliveryAddress.landmark.trim() || null,
      },
      p_site_visit_request_id: input.siteVisitRequestId ?? null,
    }
  )

  if (requestError) {
    throw new Error(
      requestError.message || "Failed to create custom order request."
    )
  }

  if (!requestId) {
    throw new Error("Custom order request was not created.")
  }

  return requestId
}
