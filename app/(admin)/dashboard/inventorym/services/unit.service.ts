import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface MaterialUnit {
  id: string
  unit_name: string
  is_active: boolean
  created_at: string
}

export async function getUnits() {
  const { data, error } = await supabase
    .from("material_units")
    .select("*")
    .eq("is_active", true)
    .order("unit_name")

  if (error) throw error

  return data as MaterialUnit[]
}

export async function createUnit(
  unit_name: string
) {
  const { error } = await supabase
    .from("material_units")
    .insert({ unit_name })

  if (error) throw error
}

export async function archiveUnit(
  id: string
) {
  const { error } = await supabase
    .from("material_units")
    .update({ is_active: false })
    .eq("id", id)

  if (error) throw error
}