import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface MaterialCategory {
  id: string
  category_name: string
  has_colors: boolean
  is_active: boolean
  created_at: string
}

export async function getCategories() {
  const { data, error } = await supabase
    .from("material_categories")
    .select("*")
    .eq("is_active", true)
    .order("category_name")

  if (error) throw error

  return data as MaterialCategory[]
}

export async function getColorCategories() {
  const { data, error } = await supabase
    .from("material_categories")
    .select("*")
    .eq("is_active", true)
    .eq("has_colors", true)
    .order("category_name")

  if (error) throw error

  return data as MaterialCategory[]
}

export async function createCategory(
  category_name: string
) {
  const { error } = await supabase
    .from("material_categories")
    .insert({ category_name })

  if (error) throw error
}

export async function archiveCategory(
  id: string
) {
  const { error } = await supabase
    .from("material_categories")
    .update({ is_active: false })
    .eq("id", id)

  if (error) throw error
}
