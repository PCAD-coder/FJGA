import { createClient } from "@/lib/supabase/client"

import {
  InventoryInsert,
  InventoryMaterial,
  InventoryUpdate,
} from "../types/inventory"

const supabase = createClient()

export async function getMaterials() {
  const { data, error } = await supabase
    .from("inventory_materials")
    .select("*")
    .eq("is_active", true)
    .order("material_name")

  if (error) throw error

  return data as InventoryMaterial[]
}

export async function createMaterial(
  material: InventoryInsert
) {
  const { error } = await supabase
    .from("inventory_materials")
    .insert(material)

  if (error) throw error
}

export async function updateMaterial(
  id: string,
  material: InventoryUpdate
) {
  const { error } = await supabase
    .from("inventory_materials")
    .update(material)
    .eq("id", id)

  if (error) throw error
}

export async function archiveMaterial(
  id: string
) {
  const { error } = await supabase
    .from("inventory_materials")
    .update({
      is_active: false,
    })
    .eq("id", id)

  if (error) throw error
}