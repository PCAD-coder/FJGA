import { createClient } from "@/lib/supabase/client"
import type { ProductionProject, ProductionStage } from "../types/production"

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
        customer_contact_number,
        payment_method,
        production_stage,
        production_assigned_to,
        production_started_at,
        estimated_completion_date,
        created_at,
        profiles (
          first_name,
          last_name
        ),
        order_items (
          id,
          product_id,
          product_name_snapshot,
          quantity,
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

      `
    )
    .eq("status", "in_production")
    .order("production_started_at", { ascending: true })

  if (error) throw error

  const projects: ProductionProject[] = []

  for (const order of data ?? []) {
    const item = order.order_items?.[0]
    const address = Array.isArray(order.order_addresses)
      ? (order.order_addresses[0] ?? null)
      : (order.order_addresses ?? null)

    let imageUrl: string | undefined

    if (item?.product_id) {
      const { data: image } = await supabase
        .from("product_images")
        .select("image_url")
        .eq("product_id", item.product_id)
        .order("display_order", { ascending: true })
        .limit(1)
        .maybeSingle()

      imageUrl = image?.image_url
    }

    const profile = Array.isArray(order.profiles)
      ? order.profiles[0]
      : order.profiles

    projects.push({
      id: order.id,
      orderNumber: order.order_number,
      projectName: item?.product_name_snapshot ?? "Unknown Product",
      clientName: profile
        ? `${profile.first_name} ${profile.last_name}`
        : "Unknown Client",
      contactNumber: order.customer_contact_number ?? null,
      paymentMethod: order.payment_method ?? null,
      orderItemId: item?.id ?? "",
      stage: STAGE_LABELS[order.production_stage ?? "pending"] ?? "Pending",
      assignedStaff: order.production_assigned_to ?? "Unassigned",
      progress: stageToProgress(order.production_stage ?? "pending"),
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
    .select("production_stage")
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
    const { data: existingDelivery, error: deliveryCheckError } =
      await supabase
        .from("deliveries")
        .select("id")
        .eq("order_id", orderId)
        .maybeSingle()

    if (deliveryCheckError) {
      throw new Error(
        deliveryCheckError.message ||
          "Failed to check existing delivery"
      )
    }

    if (!existingDelivery) {
      const { error: deliveryInsertError } =
        await supabase
          .from("deliveries")
          .insert({
            order_id: orderId,
            delivery_status: "scheduled",
          })

      if (deliveryInsertError) {
        throw new Error(
          deliveryInsertError.message ||
            "Failed to create delivery record"
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
          last_name
        )
      `
    )
    .eq("order_id", orderId)
    .order("changed_at", { ascending: true })

  if (error) throw error

  return data ?? []
}
