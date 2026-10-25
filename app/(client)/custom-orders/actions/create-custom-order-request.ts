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
} = input

  // ==========================================================
  // 3. Basic server-side validation
  // ==========================================================

  if (!projectDetails.projectName.trim()) {
    throw new Error("Project name is required.")
  }

  if (!contactNumber.trim()) {
    throw new Error("Contact number is required.")
  }

  if (!deliveryAddress.houseBuildingNumber.trim()) {
    throw new Error("House or building number is required.")
  }

  if (!deliveryAddress.street.trim()) {
    throw new Error("Street is required.")
  }

  if (!deliveryAddress.regionPsgcCode) {
    throw new Error("Region is required.")
  }

  if (!deliveryAddress.cityPsgcCode) {
    throw new Error("City or municipality is required.")
  }

  if (!deliveryAddress.barangayPsgcCode) {
    throw new Error("Barangay is required.")
  }

  // ==========================================================
  // 4. Authoritative delivery coverage validation
  // ==========================================================

  const { data: deliveryData, error: deliveryError } = await supabase.rpc(
    "get_delivery_fee_for_address",
    {
      p_city_psgc_code: deliveryAddress.cityPsgcCode.trim(),
      p_barangay_psgc_code: deliveryAddress.barangayPsgcCode.trim(),
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

  const width = Number(specifications.width)
  const height = Number(specifications.height)

  const depth =
    specifications.depth.trim() === ""
      ? null
      : Number(specifications.depth)

  if (!Number.isFinite(width) || width <= 0) {
    throw new Error("A valid width is required.")
  }

  if (!Number.isFinite(height) || height <= 0) {
    throw new Error("A valid height is required.")
  }

  if (depth !== null && (!Number.isFinite(depth) || depth <= 0)) {
    throw new Error("Depth must be greater than zero.")
  }

  // ==========================================================
  // 6. Atomic request + address creation
  // ==========================================================

  const { data: requestId, error: requestError } =
    await adminSupabase.rpc("create_custom_order_request_transaction", {
      p_customer_id: profile.id,

      p_contact_number: contactNumber.trim(),

      p_project_name: projectDetails.projectName.trim(),
      p_product_category: projectDetails.category,
      p_quantity: projectDetails.quantity,
      p_description: projectDetails.description,

      p_width: width,
      p_height: height,
      p_depth: depth,
      p_dimension_unit: specifications.dimensionUnit,

      p_measurements_approximate: specifications.measurementsApproximate,

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

      p_other_preferences:
        specifications.otherPreferences.trim() || null,

      p_reference_notes: null,

      p_address: {
        house_building_number:
          deliveryAddress.houseBuildingNumber.trim(),

        street: deliveryAddress.street.trim(),

        building_subdivision:
          deliveryAddress.buildingSubdivision.trim() || null,

        unit_floor:
          deliveryAddress.unitFloor.trim() || null,

        region_psgc_code:
          deliveryAddress.regionPsgcCode.trim(),

        region_name:
          deliveryAddress.regionName.trim(),

        province_psgc_code:
          deliveryAddress.provincePsgcCode?.trim() || null,

        province_name:
          deliveryAddress.provinceName?.trim() || null,

        city_psgc_code:
          deliveryAddress.cityPsgcCode.trim(),

        city_name:
          deliveryAddress.cityName.trim(),

        barangay_psgc_code:
          deliveryAddress.barangayPsgcCode.trim(),

        barangay_name:
          deliveryAddress.barangayName.trim(),

        postal_code:
          deliveryAddress.postalCode.trim() || null,

        landmark:
          deliveryAddress.landmark.trim() || null,
      },
    })

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