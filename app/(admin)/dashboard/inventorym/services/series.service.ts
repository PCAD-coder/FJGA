import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface MaterialSeries {
  id: string
  series_name: string
  is_active: boolean
  created_at: string
}

export async function getSeries() {
  const { data, error } = await supabase
    .from("material_series")
    .select("*")
    .eq("is_active", true)
    .order("series_name")

  if (error) throw error

  return data as MaterialSeries[]
}

export async function createSeries(
  series_name: string
) {
  const { error } = await supabase
    .from("material_series")
    .insert({
      category_name: "Aluminum",
      series_name,
    })

  if (error) throw error
}

export async function archiveSeries(
  id: string
) {
  const { error } = await supabase
    .from("material_series")
    .update({ is_active: false })
    .eq("id", id)

  if (error) throw error
}