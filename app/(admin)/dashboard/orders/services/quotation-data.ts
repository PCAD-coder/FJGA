import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface InventoryMaterialOption {
  id: string
  material_name: string
  unit: string
  unit_cost: number
  markup_percentage: number
}

export interface LaborServiceOption {
  id: string
  service_name: string
  unit: string
  labor_cost: number
  markup_percentage: number
}

export async function getInventoryMaterials() {
  const { data, error } = await supabase
    .from("inventory_materials")
    .select(
      "id, material_name, unit, unit_cost, markup_percentage"
    )
    .eq("is_active", true)
    .order("material_name")

  if (error) throw error

  return (data ?? []) as InventoryMaterialOption[]
}

export async function getLaborServices() {
  const { data, error } = await supabase
    .from("labor_services")
    .select(
      "id, service_name, unit, labor_cost, markup_percentage"
    )
    .eq("is_active", true)
    .order("service_name")

  if (error) throw error

  return (data ?? []) as LaborServiceOption[]
}