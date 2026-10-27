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
import { createCustomOrderRequestServer } from "../actions/create-custom-order-request"
const supabase = createClient()

export interface CreateCustomOrderRequestInput {
  projectDetails: ProjectDetailsData
  designReference: DesignReferenceData
  specifications: SpecificationsData
  contactNumber: string
  deliveryAddress: DeliveryAddressInput
  siteVisitRequestId?: string | null
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

const {
  projectDetails,
  designReference,
  specifications,
  deliveryAddress,
} = input

  // ==========================================================
  // Basic client-side delivery address validation
  // ==========================================================

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
  // Create the core custom request + delivery address
  // atomically through the trusted server action.
  //
  // The server action:
  // - authenticates the user again
  // - resolves the client profile
  // - validates delivery coverage authoritatively
  // - calls the service-role-only transaction RPC
  // ==========================================================

  const requestId = await createCustomOrderRequestServer({
    projectDetails,
    specifications,
    contactNumber: input.contactNumber,
    deliveryAddress,
    referenceNotes: designReference.notes,
    siteVisitRequestId: input.siteVisitRequestId ?? null,
  })

  // Storage uploads cannot participate in the PostgreSQL
  // transaction, so keep track of uploaded paths so they can
  // be removed if a later step fails.
  const uploadedPaths: string[] = []

  try {
    // ========================================================
    // Upload reference images
    // ========================================================

    const paths = await uploadReferenceImages(
      user.id,
      requestId,
      designReference
    )

    uploadedPaths.push(...paths)

    // ========================================================
    // Save uploaded image records
    // ========================================================

    if (paths.length > 0) {
      const imageRows = paths.map((path, index) => ({
        request_id: requestId,
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

    // ========================================================
    // Notify admin about the submitted custom request
    // ========================================================

    const { error: notificationError } = await supabase.rpc(
      "notify_custom_request_submitted",
      {
        p_request_id: requestId,
      }
    )

    if (notificationError) {
      throw new Error(notificationError.message)
    }

    // ========================================================
    // Load the successfully created request
    // ========================================================

    const { data: createdRequest, error: createdRequestError } =
      await supabase
        .from("custom_order_requests")
        .select("*")
        .eq("id", requestId)
        .single()

    if (createdRequestError || !createdRequest) {
      throw new Error(
        createdRequestError?.message ||
          "Failed to load created custom order request."
      )
    }

    return createdRequest as CustomOrderRequest
  } catch (error) {
    // ========================================================
    // Clean up uploaded Storage files
    // ========================================================

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

    // ========================================================
    // Clean up the pending request
    //
    // custom_order_request_addresses uses ON DELETE CASCADE,
    // so deleting the request also removes its address.
    // ========================================================

    const { error: requestCleanupError } = await supabase.rpc(
      "delete_own_pending_custom_order_request",
      {
        p_request_id: requestId,
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
      site_visit_request_id,
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
    site_visit_request_id: request.site_visit_request_id ?? null,
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
