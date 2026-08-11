import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface MaterialSpecification {
  id: string
  category_name: string
  specification_name: string
  is_active: boolean
  created_at: string
}

export async function getSpecificationsByCategory(
  category_name: string
) {
  const { data, error } = await supabase
    .from("material_specifications")
    .select("*")
    .eq("category_name", category_name)
    .eq("is_active", true)
    .order("specification_name")

  if (error) throw error

  return data as MaterialSpecification[]
}

export async function getAllSpecifications() {
  const { data, error } = await supabase
    .from("material_specifications")
    .select("*")
    .eq("is_active", true)
    .order("category_name")
    .order("specification_name")

  if (error) throw error

  return data as MaterialSpecification[]
}

export async function createSpecification(
  category_name: string,
  specification_name: string
) {
  const { error } = await supabase
    .from("material_specifications")
    .insert({
      category_name,
      specification_name,
    })

  if (error) throw error
}

export async function archiveSpecification(
  id: string
) {
  const { error } = await supabase
    .from("material_specifications")
    .update({ is_active: false })
    .eq("id", id)

  if (error) throw error
}