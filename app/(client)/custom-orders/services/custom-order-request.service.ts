import { createClient } from "@/lib/supabase/client"

import type { DeliveryAddressInput } from "@/types/delivery-address"
import type { ProjectDetailsData } from "../components/request-form/project-details-step"
import type { SpecificationsData } from "../components/request-form/specifications-step"
import type {
  CustomOrderRequest,
  CustomOrderRequestDetail,
  CustomOrderRequestListItem,
  CustomOrderRequestStatus,
} from "../types/custom-order-request"
import type { DesignReferenceData } from "../components/request-form/design-reference-step"

const supabase = createClient()

export interface CreateCustomOrderRequestInput {
  projectDetails: ProjectDetailsData
  designReference: DesignReferenceData
  specifications: SpecificationsData
  contactNumber: string
  deliveryAddress: DeliveryAddressInput
}

async function getCurrentCustomerProfileId(): Promise<string> {
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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single()

  if (profileError) {
    throw new Error(profileError.message)
  }

  if (!profile) {
    throw new Error("Customer profile not found")
  }

  return profile.id
}
const CUSTOM_ORDER_BUCKET = "custom-order-references"

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
}

async function uploadReferenceImages(
  userId: string,
  requestId: string,
  designReference: DesignReferenceData
): Promise<string[]> {
  const uploadedPaths: string[] = []

  try {
    for (let index = 0; index < designReference.images.length; index++) {
      const reference = designReference.images[index]

      const safeName = sanitizeFileName(reference.file.name)

      const filePath =
        `${userId}/${requestId}/` +
        `${index + 1}-${crypto.randomUUID()}-${safeName}`

      const { error } = await supabase.storage
        .from(CUSTOM_ORDER_BUCKET)
        .upload(filePath, reference.file, {
          cacheControl: "3600",
          upsert: false,
          contentType: reference.file.type,
        })

      if (error) {
        throw new Error(error.message)
      }

      uploadedPaths.push(filePath)
    }

    return uploadedPaths
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(CUSTOM_ORDER_BUCKET).remove(uploadedPaths)
    }

    throw error
  }
}

export async function createCustomOrderRequest(
  input: CreateCustomOrderRequestInput
): Promise<CustomOrderRequest> {
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

  const customerId = await getCurrentCustomerProfileId()

  const { projectDetails, designReference, specifications, deliveryAddress } =
    input

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

  const width = Number(specifications.width)
  const height = Number(specifications.height)

  const depth =
    specifications.depth.trim() === "" ? null : Number(specifications.depth)

  const { data: request, error: requestError } = await supabase
    .from("custom_order_requests")
    .insert({
      customer_id: customerId,

      project_name: projectDetails.projectName,
      product_category: projectDetails.category,
      quantity: projectDetails.quantity,
      description: projectDetails.description,

      width,
      height,
      depth,
      dimension_unit: specifications.dimensionUnit,
      measurements_approximate: specifications.measurementsApproximate,

      specifications: specifications.specifications,

      preferred_frame: specifications.letFjgaRecommend
        ? null
        : specifications.preferredFrame || null,

      preferred_glass: specifications.letFjgaRecommend
        ? null
        : specifications.preferredGlass || null,

      preferred_finish: specifications.letFjgaRecommend
        ? null
        : specifications.preferredFinish || null,

      let_fjga_recommend: specifications.letFjgaRecommend,

      other_preferences: specifications.otherPreferences.trim() || null,

      reference_notes: designReference.notes.trim() || null,

      status: "pending",
      contact_number: input.contactNumber.trim(),
    })
    .select("*")
    .single()

  if (requestError) {
    throw new Error(requestError.message)
  }

  const uploadedPaths: string[] = []

  try {
    const { error: addressError } = await supabase
      .from("custom_order_request_addresses")
      .insert({
        request_id: request.id,

        house_building_number: deliveryAddress.houseBuildingNumber.trim(),

        street: deliveryAddress.street.trim(),

        building_subdivision:
          deliveryAddress.buildingSubdivision.trim() || null,

        unit_floor: deliveryAddress.unitFloor.trim() || null,

        region_psgc_code: deliveryAddress.regionPsgcCode,

        region_name: deliveryAddress.regionName,

        province_psgc_code: deliveryAddress.provincePsgcCode,

        province_name: deliveryAddress.provinceName,

        city_psgc_code: deliveryAddress.cityPsgcCode,

        city_name: deliveryAddress.cityName,

        barangay_psgc_code: deliveryAddress.barangayPsgcCode,

        barangay_name: deliveryAddress.barangayName,

        postal_code: deliveryAddress.postalCode.trim() || null,

        landmark: deliveryAddress.landmark.trim() || null,
      })

    if (addressError) {
      throw new Error(addressError.message)
    }

    const paths = await uploadReferenceImages(
      user.id,
      request.id,
      designReference
    )

    uploadedPaths.push(...paths)

    if (paths.length > 0) {
      const imageRows = paths.map((path, index) => ({
        request_id: request.id,
        image_url: path,
        display_order: index,
      }))

      const { error: imageError } = await supabase
        .from("custom_order_images")
        .insert(imageRows)

      if (imageError) {
        throw new Error(imageError.message)
      }
    }

    const { error: notificationError } = await supabase.rpc(
      "notify_custom_request_submitted",
      {
        p_request_id: request.id,
      }
    )

    if (notificationError) {
      throw new Error(notificationError.message)
    }

    return request as CustomOrderRequest
    
  } catch (error) {
    if (uploadedPaths.length > 0) {
      const { error: storageCleanupError } = await supabase.storage
        .from(CUSTOM_ORDER_BUCKET)
        .remove(uploadedPaths)

      if (storageCleanupError) {
        console.error(
          "Failed to clean up uploaded custom-order images:",
          storageCleanupError
        )
      }
    }

    const { error: requestCleanupError } = await supabase.rpc(
      "delete_own_pending_custom_order_request",
      {
        p_request_id: request.id,
      }
    )

    if (requestCleanupError) {
      console.error(
        "Failed to clean up custom-order request:",
        requestCleanupError
      )
    }

    throw error
  }
}
export async function getCustomOrderRequests(): Promise<
  CustomOrderRequestListItem[]
> {
  const { data: requests, error: requestError } = await supabase
    .from("custom_order_requests")
    .select(
      `
      id,
      request_number,
      project_name,
      product_category,
      quantity,
      width,
      height,
      depth,
      dimension_unit,
      status,
      quotation,
      denial_reason,
      created_at,
      updated_at,
      custom_order_images (
        image_url,
        display_order
      )
    `
    )
    .order("created_at", { ascending: false })

  if (requestError) {
    throw new Error(requestError.message)
  }

  if (!requests) {
    return []
  }

  return Promise.all(
    requests.map(async (request) => {
      const images = [...(request.custom_order_images ?? [])].sort(
        (a, b) => a.display_order - b.display_order
      )

      const firstImagePath = images[0]?.image_url ?? null

      let signedUrl: string | null = null

      if (firstImagePath) {
        const { data, error } = await supabase.storage
          .from(CUSTOM_ORDER_BUCKET)
          .createSignedUrl(firstImagePath, 60 * 60)

        if (!error) {
          signedUrl = data.signedUrl
        } else {
          console.error(
            `Failed to create signed URL for request ${request.id}:`,
            error
          )
        }
      }

      return {
        id: request.id,
        request_number: request.request_number,
        project_name: request.project_name,
        product_category: request.product_category,
        quantity: request.quantity,

        width: request.width,
        height: request.height,
        depth: request.depth,
        dimension_unit: request.dimension_unit,

        status: request.status as CustomOrderRequestStatus,
        quotation: request.quotation,
        denial_reason: request.denial_reason,

        created_at: request.created_at,
        updated_at: request.updated_at,

        reference_image_path: firstImagePath,
        reference_image_url: signedUrl,
      }
    })
  )
}

export async function getCustomOrderRequestById(
  requestId: string
): Promise<CustomOrderRequestDetail> {
  const { data: request, error: requestError } = await supabase
    .from("custom_order_requests")
    .select(
      `
      id,
      request_number,
      customer_id,

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
      quotation,
      denial_reason,

      created_at,
      updated_at,

      custom_order_images (
        id,
        image_url,
        display_order
      )
    `
    )
    .eq("id", requestId)
    .single()

  if (requestError) {
    throw new Error(requestError.message)
  }

  const sortedImages = [...(request.custom_order_images ?? [])].sort(
    (a, b) => a.display_order - b.display_order
  )

  const images = await Promise.all(
    sortedImages.map(async (image) => {
      const { data, error } = await supabase.storage
        .from(CUSTOM_ORDER_BUCKET)
        .createSignedUrl(image.image_url, 60 * 60)

      if (error) {
        console.error(
          `Failed to create signed URL for image ${image.id}:`,
          error
        )
      }

      return {
        id: image.id,
        image_url: image.image_url,
        display_order: image.display_order,
        signed_url: error ? null : data.signedUrl,
      }
    })
  )

  return {
    id: request.id,
    request_number: request.request_number,
    customer_id: request.customer_id,

    project_name: request.project_name,
    product_category: request.product_category,
    quantity: request.quantity,
    description: request.description,

    width: request.width,
    height: request.height,
    depth: request.depth,
    dimension_unit: request.dimension_unit,
    measurements_approximate: request.measurements_approximate,

    specifications: (request.specifications as Record<string, string>) ?? {},

    preferred_frame: request.preferred_frame,
    preferred_glass: request.preferred_glass,
    preferred_finish: request.preferred_finish,
    let_fjga_recommend: request.let_fjga_recommend,
    other_preferences: request.other_preferences,

    reference_notes: request.reference_notes,

    status: request.status as CustomOrderRequestStatus,
    quotation: request.quotation,
    denial_reason: request.denial_reason,

    created_at: request.created_at,
    updated_at: request.updated_at,

    images,
  }
}
