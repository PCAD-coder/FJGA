import { createClient } from "@/lib/supabase/client"

import type { ServiceResult } from "./service-result"

export interface InventoryMaterialOption {
  id: string
  material_name: string
  unit_cost: number | null
  markup_percentage: number | null

}

export async function getActiveMaterials(): Promise<
  ServiceResult<InventoryMaterialOption[]>
> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("inventory_materials")
    .select("id, material_name, unit_cost, markup_percentage")
    .eq("is_active", true)
    .order("material_name")

  return {
  data:
    data?.map((item) => ({
      id: item.id,
      material_name: item.material_name,
      unit_cost: item.unit_cost,
      markup_percentage: item.markup_percentage,
    })) ?? [],
  error: error?.message ?? null,
}
}