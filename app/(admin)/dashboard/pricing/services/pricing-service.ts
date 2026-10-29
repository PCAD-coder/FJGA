import { createClient } from "@/lib/supabase/client"

import { logActivity } from "../../activity-logs/services/activity-logger.service"

import {
  LaborPricing,
  MaterialPricing,
} from "../types/pricing"

const supabase = createClient()

/* -------------------------------- */
/* Material Pricing */
/* -------------------------------- */

export async function getMaterialPricing(): Promise<
  MaterialPricing[]
> {
  const { data, error } = await supabase
    .from("inventory_materials")
    .select("*")
    .eq("is_active", true)
    .order("material_name")

  if (error) throw error

  return (data ?? []).map((material) => ({
    ...material,

    selling_price:
      (material.unit_cost ?? 0) *
      (1 + (material.markup_percentage ?? 0) / 100),
  }))
}

export async function updateMaterialPricing(
  id: string,
  values: {
    unit_cost?: number | null
    markup_percentage?: number | null
  }
) {
  const { data, error } = await supabase
    .from("inventory_materials")
    .update(values)
    .eq("id", id)
    .select("id, material_name, unit_cost, markup_percentage")
    .single()

  if (error) throw error

  await logActivity({
    action: "Updated Material Pricing",
    module: "Pricing",
    description: `Updated pricing for "${data.material_name}". Unit cost: ₱${Number(
      data.unit_cost ?? 0
    ).toFixed(2)}, markup: ${Number(
      data.markup_percentage ?? 0
    ).toFixed(2)}%.`,
    severity: "info",
  })

  return data
}

/* -------------------------------- */
/* Labor Pricing */
/* -------------------------------- */

export async function createLaborService(values: {
  service_name: string
  description?: string | null
  unit: string
  labor_cost: number
  markup_percentage: number
}) {
  const { data, error } = await supabase
    .from("labor_services")
    .insert(values)
    .select("id, service_name, labor_cost, markup_percentage")
    .single()

  if (error) throw error

  await logActivity({
    action: "Created Labor Service",
    module: "Pricing",
    description: `Created labor service "${data.service_name}" with a labor cost of ₱${Number(
      data.labor_cost ?? 0
    ).toFixed(2)} and ${Number(
      data.markup_percentage ?? 0
    ).toFixed(2)}% markup.`,
    severity: "info",
  })

  return data
}

export async function getLaborPricing(): Promise<
  LaborPricing[]
> {
  const { data, error } = await supabase
    .from("labor_services")
    .select("*")
    .eq("is_active", true)
    .order("service_name")

  if (error) throw error

  return (data ?? []).map((service) => ({
    ...service,

    selling_price:
      (service.labor_cost ?? 0) *
      (1 + (service.markup_percentage ?? 0) / 100),
  }))
}

export async function updateLaborPricing(
  id: string,
  values: {
    labor_cost?: number
    markup_percentage?: number
  }
) {
  const { data, error } = await supabase
    .from("labor_services")
    .update(values)
    .eq("id", id)
    .select("id, service_name, labor_cost, markup_percentage")
    .single()

  if (error) throw error

  await logActivity({
    action: "Updated Labor Pricing",
    module: "Pricing",
    description: `Updated pricing for labor service "${data.service_name}". Labor cost: ₱${Number(
      data.labor_cost ?? 0
    ).toFixed(2)}, markup: ${Number(
      data.markup_percentage ?? 0
    ).toFixed(2)}%.`,
    severity: "info",
  })

  return data
}

export async function archiveLaborService(id: string) {
  const { data, error } = await supabase
    .from("labor_services")
    .update({
      is_active: false,
    })
    .eq("id", id)
    .select("id, service_name")
    .single()

  if (error) throw error

  await logActivity({
    action: "Archived Labor Service",
    module: "Pricing",
    description: `Archived labor service "${data.service_name}".`,
    severity: "warning",
  })

  return data
}