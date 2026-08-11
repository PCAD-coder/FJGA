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

export async function getProductionProjects(): Promise<ProductionProject[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        status,
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
        )
      `
    )
    .eq("status", "in_production")
    .order("production_started_at", { ascending: true })

  if (error) throw error

  const projects: ProductionProject[] = []

  for (const order of data ?? []) {
    const item = order.order_items?.[0]

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
    })
  }

  return projects
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
  notes?: string
) {
  const { data: currentOrder, error: fetchError } = await supabase
    .from("orders")
    .select("production_stage")
    .eq("id", orderId)
    .single()

  if (fetchError) throw fetchError

  const updateData: Record<string, any> = {
    production_stage: stage,
    updated_at: new Date().toISOString(),
  }

  if (stage === "ready_for_delivery") {
    updateData.status = "ready_for_delivery"
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId)

  if (updateError) throw updateError

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

