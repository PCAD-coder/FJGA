import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface MaterialThickness {
  id: string
  category_name: string
  thickness_name: string
  is_active: boolean
  created_at: string
}

export async function getThicknessesByCategory(
  category_name: string
) {
  const { data, error } = await supabase
    .from("material_thicknesses")
    .select("*")
    .eq("category_name", category_name)
    .eq("is_active", true)
    .order("thickness_name")

  if (error) throw error

  return data as MaterialThickness[]
}

export async function getAllThicknesses() {
  const { data, error } = await supabase
    .from("material_thicknesses")
    .select("*")
    .eq("is_active", true)
    .order("category_name")
    .order("thickness_name")

  if (error) throw error

  return data as MaterialThickness[]
}

export async function createThickness(
  category_name: string,
  thickness_name: string
) {
  const { error } = await supabase
    .from("material_thicknesses")
    .insert({
      category_name,
      thickness_name,
    })

  if (error) throw error
}

export async function archiveThickness(
  id: string
) {
  const { error } = await supabase
    .from("material_thicknesses")
    .update({ is_active: false })
    .eq("id", id)

  if (error) throw error
}