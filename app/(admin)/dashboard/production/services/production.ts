import { createClient } from "@/lib/supabase/client"
import type { ProductionProject, ProductionStage } from "../types/production"
import { logActivity } from "../../activity-logs/services/activity-logger.service"
const supabase = createClient()

const STAGE_LABELS: Record<string, ProductionStage> = {
  pending: "Pending",
  material_prep: "Material Prep",
  glass_cutting: "Glass Cutting",
  frame_fabrication: "Frame Fabrication",
  assembly: "Assembly",
  finishing: "Finishing",
  quality_check: "Quality Check",
  ready_for_delivery: "Ready for Delivery",
}

const ORDER_PRODUCTION_STAGES: ProductionStage[] = [
  "Pending",
  "Material Prep",
  "Glass Cutting",
  "Frame Fabrication",
  "Assembly",
  "Finishing",
  "Quality Check",
  "Ready for Delivery",
]

function getOrderApplicableStages(
  requiresGlassCutting: boolean
): ProductionStage[] {
  if (requiresGlassCutting) {
    return ORDER_PRODUCTION_STAGES
  }

  return ORDER_PRODUCTION_STAGES.filter((stage) => stage !== "Glass Cutting")
}
function getReturnApplicableStages(
  resolutionType: "repair" | "replacement" | undefined,
  laborServices: string[]
): ProductionStage[] {
  const stages = new Set<ProductionStage>()

  stages.add("Pending")

  // Any physical return work needs material preparation.
  stages.add("Material Prep")

  const normalizedServices = laborServices.map((service) =>
    service.toLowerCase()
  )

  const hasGlassWork = normalizedServices.some(
    (service) => service.includes("glass") || service.includes("cutting")
  )

  const hasFrameWork = normalizedServices.some(
    (service) =>
      service.includes("frame") ||
      service.includes("aluminum") ||
      service.includes("fabrication")
  )

  const hasAssemblyWork = normalizedServices.some(
    (service) =>
      service.includes("assembly") ||
      service.includes("install") ||
      service.includes("installation")
  )

  const hasFinishingWork = normalizedServices.some(
    (service) =>
      service.includes("finish") ||
      service.includes("polish") ||
      service.includes("paint")
  )

  if (hasGlassWork) {
    stages.add("Glass Cutting")
  }

  if (hasFrameWork) {
    stages.add("Frame Fabrication")
  }

  /*
   * A physical repair/replacement normally needs
   * assembly/installation before quality checking.
   */
  if (
    hasAssemblyWork ||
    resolutionType === "repair" ||
    resolutionType === "replacement"
  ) {
    stages.add("Assembly")
  }

  if (hasFinishingWork) {
    stages.add("Finishing")
  }

  stages.add("Quality Check")
  stages.add("Ready for Delivery")

  const stageOrder: ProductionStage[] = [
    "Pending",
    "Material Prep",
    "Glass Cutting",
    "Frame Fabrication",
    "Assembly",
    "Finishing",
    "Quality Check",
    "Ready for Delivery",
  ]

  return stageOrder.filter((stage) => stages.has(stage))
}
export interface ProductionReplacementMaterial {
  id: string
  material_name: string
  category: string
  specification: string
  thickness: string | null
  color: string | null
  size: string
  unit: string
  snapshotQuantity: number
}

export async function getProductionProjects(): Promise<ProductionProject[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        status,
        source_request_id,
        customer_contact_number,
        payment_method,
        production_stage,
        production_assigned_to,
        production_started_at,
        estimated_completion_date,
        created_at,
        profiles (
          first_name,
          last_name,
          full_name
        ),
        order_items (
          id,
          product_id,
          product_name_snapshot,
          quantity,
          width,
          height,
          depth,
          dimension_unit,
          materials_snapshot
        ),
        order_addresses (
          house_building_number,
          street,
          building_subdivision,
          unit_floor,
          region_name,
          province_name,
          city_name,
          barangay_name,
          postal_code,
          landmark
        )

      `
    )
    .eq("status", "in_production")
    .order("production_started_at", { ascending: true })

  if (error) throw error

  const projects: ProductionProject[] = []

  for (const order of data ?? []) {
    const item = order.order_items?.[0]
    const materialSnapshots = Array.isArray(item?.materials_snapshot)
      ? item.materials_snapshot
      : []

    const materialIds = materialSnapshots
      .map((material) => {
        if (
          typeof material === "object" &&
          material !== null &&
          "material_id" in material &&
          typeof material.material_id === "string"
        ) {
          return material.material_id
        }

        return null
      })
      .filter((id): id is string => Boolean(id))

    let requiresGlassCutting = false

    if (materialIds.length > 0) {
      const { data: materials, error: materialsError } = await supabase
        .from("inventory_materials")
        .select("id, category")
        .in("id", materialIds)

      if (materialsError) {
        console.error(
          "Failed to determine production material categories:",
          materialsError
        )
      } else {
        requiresGlassCutting =
          materials?.some(
            (material) => material.category?.toLowerCase() === "glass"
          ) ?? false
      }
    }

    const applicableStages = getOrderApplicableStages(requiresGlassCutting)
    const address = Array.isArray(order.order_addresses)
      ? (order.order_addresses[0] ?? null)
      : (order.order_addresses ?? null)

    let imageUrl: string | undefined

    /*
     * Prefer the product image when the order item is linked
     * to a catalog product.
     */
    if (item?.product_id) {
      const { data: image, error: imageError } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", item.product_id)
        .order("display_order", { ascending: true })
        .limit(1)
        .maybeSingle()

      if (imageError) {
        console.error("Failed to load product image:", imageError)
      } else {
        imageUrl = image?.image_url
      }
    }

    /*
     * Custom orders may not have a product image.
     *
     * When no product image was found, fall back to the first
     * reference image from the original custom order request.
     */
    if (!imageUrl && order.source_request_id) {
      const { data: referenceImage, error: referenceImageError } =
        await supabase
          .from("custom_order_images")
          .select("image_url")
          .eq("request_id", order.source_request_id)
          .order("display_order", { ascending: true })
          .limit(1)
          .maybeSingle()

      if (referenceImageError) {
        console.error(
          "Failed to load custom order reference image:",
          referenceImageError
        )
      } else if (referenceImage?.image_url) {
        const { data: signedImage, error: signedImageError } =
          await supabase.storage
            .from("custom-order-references")
            .createSignedUrl(referenceImage.image_url, 60 * 60)

        if (signedImageError) {
          console.error(
            "Failed to create custom order reference image URL:",
            signedImageError
          )
        } else {
          imageUrl = signedImage.signedUrl
        }
      }
    }
    const profile = Array.isArray(order.profiles)
      ? order.profiles[0]
      : order.profiles

    const firstName = profile?.first_name?.trim() ?? ""
    const lastName = profile?.last_name?.trim() ?? ""
    const fullName = profile?.full_name?.trim() ?? ""

    const clientName =
      [firstName, lastName].filter(Boolean).join(" ") ||
      fullName ||
      "Unknown Client"

    const productionStage =
      STAGE_LABELS[order.production_stage ?? "pending"] ?? "Pending"

    projects.push({
      id: order.id,
      orderNumber: order.order_number,
      projectName: item?.product_name_snapshot ?? "Unknown Product",
      clientName,
      contactNumber: order.customer_contact_number ?? null,
      paymentMethod: order.payment_method ?? null,
      orderItemId: item?.id ?? "",
      stage: productionStage,
      assignedStaff: order.production_assigned_to ?? "Unassigned",
      progress: applicableStageToProgress(productionStage, applicableStages),
      estimatedCompletion:
        order.estimated_completion_date ??
        new Date().toISOString().split("T")[0],
      imageUrl,
      dimensions: item
        ? `${item.width ?? "-"} × ${item.height ?? "-"} × ${item.depth ?? "-"} ${item.dimension_unit ?? "cm"}`
        : undefined,

      deliveryAddress: address
        ? {
            house_building_number: address.house_building_number,
            street: address.street,
            building_subdivision: address.building_subdivision,
            unit_floor: address.unit_floor,
            region_name: address.region_name,
            province_name: address.province_name,
            city_name: address.city_name,
            barangay_name: address.barangay_name,
            postal_code: address.postal_code,
            landmark: address.landmark,
          }
        : null,
      projectType: "order",
      applicableStages,
    })
  }

  return projects
}
export async function getReturnProductionProjects(): Promise<
  ProductionProject[]
> {
  const { data, error } = await supabase
    .from("return_production_jobs")
    .select(
      `
        id,
        return_request_id,
        resolution_id,
        production_stage,
        assigned_staff,
        started_at,

        return_requests (
          return_number,
          issue_type,
          customer_id,

          customer:profiles!return_requests_customer_id_fkey (
            first_name,
            last_name,
            full_name
          ),

          orders (
            order_number,
            source_request_id,
            customer_contact_number,
            payment_method,

            order_items (
              id,
              product_id,
              product_name_snapshot,
              width,
              height,
              depth,
              dimension_unit
            ),

            order_addresses (
              house_building_number,
              street,
              building_subdivision,
              unit_floor,
              region_name,
              province_name,
              city_name,
              barangay_name,
              postal_code,
              landmark
            )
          )
        ),

        return_resolutions (
          resolution_type,

            return_resolution_items (
              item_type,
              labor_service_id,

              labor_services(
              service_name
              )
        )
      )
      `
    )
    .order("started_at", { ascending: true })

  if (error) {
    console.error("RETURN PRODUCTION QUERY ERROR:", error)

    throw error
  }

  const projects: ProductionProject[] = []

  for (const job of data ?? []) {
    const request = Array.isArray(job.return_requests)
      ? job.return_requests[0]
      : job.return_requests

    if (!request) continue

    const order = Array.isArray(request.orders)
      ? request.orders[0]
      : request.orders

    if (!order) continue

    const item = Array.isArray(order.order_items)
      ? order.order_items[0]
      : order.order_items

    const address = Array.isArray(order.order_addresses)
      ? (order.order_addresses[0] ?? null)
      : (order.order_addresses ?? null)

    const customer = Array.isArray(request.customer)
      ? request.customer[0]
      : request.customer
    const customerFirstName = customer?.first_name?.trim() ?? ""
    const customerLastName = customer?.last_name?.trim() ?? ""
    const customerFullName = customer?.full_name?.trim() ?? ""

    const customerName =
      [customerFirstName, customerLastName].filter(Boolean).join(" ") ||
      customerFullName ||
      "Unknown Client"

    const resolution = Array.isArray(job.return_resolutions)
      ? job.return_resolutions[0]
      : job.return_resolutions
    const laborServices = (resolution?.return_resolution_items ?? [])
      .filter((item) => item.item_type === "labor" && item.labor_services)
      .map((item) => {
        const service = Array.isArray(item.labor_services)
          ? item.labor_services[0]
          : item.labor_services

        return service?.service_name ?? ""
      })
      .filter(Boolean)
    const applicableStages = getReturnApplicableStages(
      resolution?.resolution_type === "repair" ||
        resolution?.resolution_type === "replacement"
        ? resolution.resolution_type
        : undefined,
      laborServices
    )

    let imageUrl: string | undefined

    /*
     * Prefer the catalog/product image when one exists.
     */
    if (item?.product_id) {
      const { data: image, error: imageError } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", item.product_id)
        .order("display_order", { ascending: true })
        .limit(1)
        .maybeSingle()

      if (imageError) {
        console.error("Failed to load return product image:", imageError)
      } else {
        imageUrl = image?.image_url
      }
    }

    /*
     * A returned custom order may not have a catalog product image.
     *
     * Fall back to the first reference image uploaded with the
     * original custom order request.
     */
    if (!imageUrl && order.source_request_id) {
      const { data: referenceImage, error: referenceImageError } =
        await supabase
          .from("custom_order_images")
          .select("image_url")
          .eq("request_id", order.source_request_id)
          .order("display_order", { ascending: true })
          .limit(1)
          .maybeSingle()

      if (referenceImageError) {
        console.error(
          "Failed to load return custom order reference image:",
          referenceImageError
        )
      } else if (referenceImage?.image_url) {
        const { data: signedImage, error: signedImageError } =
          await supabase.storage
            .from("custom-order-references")
            .createSignedUrl(referenceImage.image_url, 60 * 60)

        if (signedImageError) {
          console.error(
            "Failed to create return custom order reference image URL:",
            signedImageError
          )
        } else {
          imageUrl = signedImage.signedUrl
        }
      }
    }

    const resolutionType =
      resolution?.resolution_type === "repair" ||
      resolution?.resolution_type === "replacement"
        ? resolution.resolution_type
        : undefined

    projects.push({
      id: job.id,
      orderNumber: order.order_number ?? request.return_number,
      projectName: item?.product_name_snapshot ?? "Return Resolution",
      clientName: customerName,
      contactNumber: order.customer_contact_number ?? null,
      paymentMethod: order.payment_method ?? null,
      orderItemId: item?.id ?? "",

      stage: STAGE_LABELS[job.production_stage ?? "pending"] ?? "Pending",

      assignedStaff: job.assigned_staff ?? "Unassigned",

      progress: stageToProgress(job.production_stage ?? "pending"),

      estimatedCompletion: new Date().toISOString().split("T")[0],

      imageUrl,

      dimensions: item
        ? `${item.width ?? "-"} × ${item.height ?? "-"} × ${
            item.depth ?? "-"
          } ${item.dimension_unit ?? "cm"}`
        : undefined,

      deliveryAddress: address
        ? {
            house_building_number: address.house_building_number,
            street: address.street,
            building_subdivision: address.building_subdivision,
            unit_floor: address.unit_floor,
            region_name: address.region_name,
            province_name: address.province_name,
            city_name: address.city_name,
            barangay_name: address.barangay_name,
            postal_code: address.postal_code,
            landmark: address.landmark,
          }
        : null,

      projectType: "return",

      returnRequestId: job.return_request_id,
      resolutionId: job.resolution_id,
      resolutionType,
      applicableStages,
    })
  }

  return projects
}
export async function getProductionReplacementMaterials(
  orderId: string
): Promise<ProductionReplacementMaterial[]> {
  const { data, error } = await supabase
    .from("order_items")
    .select("materials_snapshot")
    .eq("order_id", orderId)

  if (error) throw error

  const materialSnapshotQuantities = new Map<string, number>()

  for (const item of data ?? []) {
    if (!item.materials_snapshot || !Array.isArray(item.materials_snapshot)) {
      continue
    }

    for (const material of item.materials_snapshot) {
      if (!material?.material_id) {
        continue
      }

      const quantity = Number(material.quantity)

      if (!Number.isFinite(quantity) || quantity <= 0) {
        continue
      }

      materialSnapshotQuantities.set(material.material_id, quantity)
    }
  }

  if (materialSnapshotQuantities.size === 0) {
    return []
  }

  const { data: materials, error: materialsError } = await supabase
    .from("inventory_materials")
    .select(
      `
        id,
        material_name,
        category,
        specification,
        thickness,
        color,
        size,
        unit
      `
    )
    .in("id", Array.from(materialSnapshotQuantities.keys()))
    .eq("is_active", true)
    .order("material_name", { ascending: true })

  if (materialsError) throw materialsError

  return (materials ?? []).map((material) => ({
    ...material,
    snapshotQuantity: materialSnapshotQuantities.get(material.id) ?? 0,
  }))
}
export async function consumeReplacementMaterial(
  orderId: string,
  materialId: string,
  quantity: number,
  productionStage: string,
  notes?: string
) {
  const { data, error } = await supabase.rpc("consume_replacement_material", {
    p_order_id: orderId,
    p_material_id: materialId,
    p_quantity: quantity,
    p_production_stage: productionStage,
    p_notes: notes ?? null,
  })

  if (error) {
    throw new Error(error.message || "Failed to consume replacement material")
  }

  return data
}

function stageToProgress(stage: string): number {
  switch (stage) {
    case "pending":
      return 0
    case "material_prep":
      return 10
    case "glass_cutting":
      return 25
    case "frame_fabrication":
      return 45
    case "assembly":
      return 65
    case "finishing":
      return 80
    case "quality_check":
      return 90
    case "ready_for_delivery":
      return 100
    default:
      return 0
  }
}

function applicableStageToProgress(
  stage: ProductionStage,
  applicableStages: ProductionStage[]
): number {
  const currentIndex = applicableStages.indexOf(stage)

  if (currentIndex <= 0) {
    return 0
  }

  const lastIndex = applicableStages.length - 1

  if (lastIndex <= 0) {
    return 0
  }

  return Math.round((currentIndex / lastIndex) * 100)
}

function formatProductionStage(stage: string | null): string {
  if (!stage) return "Pending"

  return stage
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
export async function updateReturnProductionStage(
  productionJobId: string,
  stage: string,
  notes?: string
) {
  const { data: currentJob, error: fetchError } = await supabase
    .from("return_production_jobs")
    .select(
      `
        id,
        production_stage,
        return_request_id,
        resolution_id
      `
    )
    .eq("id", productionJobId)
    .single()

  if (fetchError) {
    throw fetchError
  }

  const currentStage = currentJob.production_stage
  const isEnteringMaterialPrep =
    stage === "material_prep" && currentStage !== "material_prep"

  /*
    ============================================================
    CONSUME RETURN MATERIALS
    ============================================================

    Materials are deducted only when the return enters
    Material Prep.

    Do not consume again when:
    - the stage remains Material Prep
    - the production moves forward
    - the production moves backward and later re-enters
      Material Prep

    The RPC itself provides duplicate-consumption protection.
  */

  if (isEnteringMaterialPrep) {
    const { data: consumptionResult, error: consumptionError } =
      await supabase.rpc("consume_return_materials", {
        p_production_job_id: productionJobId,
      })

    console.log("RETURN MATERIAL CONSUMPTION RESULT:", {
      productionJobId,
      fromStage: currentStage,
      toStage: stage,
      consumptionResult,
      consumptionError: consumptionError
        ? {
            message: consumptionError.message,
            details: consumptionError.details,
            hint: consumptionError.hint,
            code: consumptionError.code,
          }
        : null,
    })

    if (consumptionError) {
      throw new Error(
        consumptionError.message ||
          "Failed to consume return production materials"
      )
    }
  }

  const { error: updateError } = await supabase
    .from("return_production_jobs")
    .update({
      production_stage: stage,
      updated_at: new Date().toISOString(),
      notes: notes?.trim() || null,
    })
    .eq("id", productionJobId)

  if (updateError) {
    throw updateError
  }

  /*
   * Automatically create the return delivery when
   * return production reaches Ready for Delivery.
   *
   * Check first so moving backward and later returning
   * to Ready for Delivery does not create a duplicate.
   */
  if (stage === "ready_for_delivery" && currentStage !== "ready_for_delivery") {
    const { data: existingReturnDelivery, error: deliveryCheckError } =
      await supabase
        .from("return_deliveries")
        .select("id")
        .eq("production_job_id", productionJobId)
        .maybeSingle()

    if (deliveryCheckError) {
      throw new Error(
        deliveryCheckError.message || "Failed to check existing return delivery"
      )
    }

    if (!existingReturnDelivery) {
      const { error: deliveryInsertError } = await supabase
        .from("return_deliveries")
        .insert({
          return_request_id: currentJob.return_request_id,
          production_job_id: productionJobId,
          delivery_status: "scheduled",
        })

      if (deliveryInsertError) {
        throw new Error(
          deliveryInsertError.message || "Failed to create return delivery"
        )
      }
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profileId: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .single()

    profileId = profile?.id ?? null
  }

  const { error: historyError } = await supabase
    .from("return_production_history")
    .insert({
      production_job_id: productionJobId,
      from_stage: currentStage,
      to_stage: stage,
      changed_by: profileId,
      notes: notes?.trim() || null,
    })

  if (historyError) {
    throw historyError
  }
  /*
   * Notify the client only for meaningful return-production milestones.
   *
   * The RPC independently verifies:
   * - the caller is an active admin
   * - the production job exists
   * - the job is actually at the supplied stage
   * - the stage is an allowed client-facing milestone
   *
   * Duplicate milestone notifications are prevented by the RPC.
   */
  if (stage === "quality_check" || stage === "ready_for_delivery") {
    const { error: notificationError } = await supabase.rpc(
      "notify_return_production_stage",
      {
        p_production_job_id: productionJobId,
        p_stage: stage,
      }
    )

    if (notificationError) {
      console.error(
        "Failed to create return production notification:",
        notificationError
      )
    }
  }
  await logActivity({
    action: "Updated Return Production Stage",
    module: "Production",
    description: `Changed return production stage from "${formatProductionStage(
      currentStage
    )}" to "${formatProductionStage(stage)}".`,
    severity: "info",
  })
}

export async function updateProductionStage(
  orderId: string,
  stage: string,
  notes?: string,
  replacement?: {
    orderItemId: string
    materialId: string
    quantity: number
    reason?: string
  }
) {
  const { data: currentOrder, error: fetchError } = await supabase
    .from("orders")
    .select("order_number, production_stage")
    .eq("id", orderId)
    .single()

  if (fetchError) throw fetchError

  /*
   * Material consumption happens whenever the order
   * enters Material Prep.
   *
   * This covers:
   *
   * 1. Moving into Material Prep manually from Production.
   * 2. Moving backward to Material Prep after a problem.
   *
   * The database function prevents duplicate consumption
   * for the same order item and material.
   */
  if (
    stage === "material_prep" &&
    currentOrder.production_stage !== "material_prep"
  ) {
    const { data: consumptionResult, error: consumptionError } =
      await supabase.rpc("consume_order_materials", {
        p_order_id: orderId,
        p_production_stage: "material_prep",
      })

    console.log("MATERIAL CONSUMPTION RESULT:", {
      orderId,
      fromStage: currentOrder.production_stage,
      toStage: stage,
      consumptionResult,
      consumptionError,
    })

    if (consumptionError) {
      throw new Error(
        consumptionError.message || "Failed to consume production materials"
      )
    }
  }
  /*Replacement material consumption
   */
  if (replacement) {
    if (!replacement.materialId) {
      throw new Error("Please select a replacement material")
    }

    if (!Number.isFinite(replacement.quantity) || replacement.quantity <= 0) {
      throw new Error("Replacement quantity must be greater than zero")
    }

    const { error: replacementError } = await supabase.rpc(
      "consume_replacement_material",
      {
        p_order_id: orderId,
        p_order_item_id: replacement.orderItemId,
        p_material_id: replacement.materialId,
        p_quantity: replacement.quantity,
        p_production_stage: stage,
        p_notes: notes ?? null,
      }
    )

    if (replacementError) {
      throw new Error(
        replacementError.message || "Failed to consume replacement material"
      )
    }
  }

  const updateData: Record<string, any> = {
    production_stage: stage,
    updated_at: new Date().toISOString(),
  }

  if (stage === "ready_for_delivery") {
    updateData.status = "ready_for_delivery"
  } else if (
    stage === "material_prep" ||
    stage === "glass_cutting" ||
    stage === "frame_fabrication" ||
    stage === "assembly" ||
    stage === "finishing" ||
    stage === "quality_check"
  ) {
    updateData.status = "in_production"
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)

  if (updateError) throw updateError

  /*
   * Automatically create a delivery record when
   * production is completed and the order is ready
   * for delivery.
   *
   * The existing delivery record is checked first
   * to prevent duplicate deliveries.
   */

  if (
    stage === "ready_for_delivery" &&
    currentOrder.production_stage !== "ready_for_delivery"
  ) {
    const { data: existingDelivery, error: deliveryCheckError } = await supabase
      .from("deliveries")
      .select("id")
      .eq("order_id", orderId)
      .maybeSingle()

    if (deliveryCheckError) {
      throw new Error(
        deliveryCheckError.message || "Failed to check existing delivery"
      )
    }

    if (!existingDelivery) {
      const { error: deliveryInsertError } = await supabase
        .from("deliveries")
        .insert({
          order_id: orderId,
          delivery_status: "scheduled",
        })

      if (deliveryInsertError) {
        throw new Error(
          deliveryInsertError.message || "Failed to create delivery record"
        )
      }
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profileId: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", user.id)
      .single()

    profileId = profile?.id ?? null
  }

  const { error: historyError } = await supabase
    .from("order_production_history")
    .insert({
      order_id: orderId,
      from_stage: currentOrder.production_stage,
      to_stage: stage,
      changed_by: profileId,
      notes: notes ?? null,
    })

  if (historyError) throw historyError

  /*
   * Notify the client only for meaningful production milestones.
   *
   * The RPC independently verifies:
   * - the caller is an admin
   * - the order exists
   * - the order is actually at the supplied stage
   * - the stage is an allowed client-facing milestone
   *
   * Duplicate milestone notifications are also prevented by the RPC.
   */
  if (stage === "quality_check" || stage === "ready_for_delivery") {
    const { error: notificationError } = await supabase.rpc(
      "notify_order_production_stage",
      {
        p_order_id: orderId,
        p_stage: stage,
      }
    )

    if (notificationError) {
      console.error(
        "Failed to create production notification:",
        notificationError
      )
    }
  }
  await logActivity({
    action: "Updated Production Stage",
    module: "Production",
    description: `Changed production stage for ${currentOrder.order_number} from "${formatProductionStage(
      currentOrder.production_stage
    )}" to "${formatProductionStage(stage)}".`,
    severity: "info",
  })
}

export async function getProductionHistory(orderId: string) {
  const { data, error } = await supabase
    .from("order_production_history")
    .select(
      `
        id,
        from_stage,
        to_stage,
        notes,
        changed_at,
        profiles:changed_by (
          first_name,
          last_name,
          full_name
        )
      `
    )
    .eq("order_id", orderId)
    .order("changed_at", { ascending: true })

  if (error) throw error

  return data ?? []
}

export async function getReturnProductionHistory(productionJobId: string) {
  const { data, error } = await supabase
    .from("return_production_history")
    .select(
      `
      id,
      from_stage,
      to_stage,
      notes,
      changed_at,
      profiles:changed_by (
        first_name,
        last_name,
        full_name
      )
    `
    )
    .eq("production_job_id", productionJobId)
    .order("changed_at", { ascending: true })

  if (error) throw error

  return data ?? []
}
