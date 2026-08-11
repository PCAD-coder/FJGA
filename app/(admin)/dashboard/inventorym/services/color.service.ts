import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface MaterialColor {
  id: string
  category: string
  color_name: string
  is_active: boolean
  created_at: string
}

export async function getColorsByCategory(
  category: string
) {
  const { data, error } = await supabase
    .from("material_colors")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("color_name")

  if (error) throw error

  return data as MaterialColor[]
}

export async function getAllColors() {
  const { data, error } = await supabase
    .from("material_colors")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("color_name")

  if (error) throw error

  return data as MaterialColor[]
}

export async function createColor(
  category: string,
  color_name: string
) {
  const { error } = await supabase
    .from("material_colors")
    .insert({
      category,
      color_name,
    })

  if (error) throw error
}

export async function archiveColor(
  id: string
) {
  const { error } = await supabase
    .from("material_colors")
    .update({ is_active: false })
    .eq("id", id)

  if (error) throw error
}