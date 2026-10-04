import { createClient } from "@/lib/supabase/client"

import {
  InventoryInsert,
  InventoryMaterial,
  InventoryUpdate,
} from "../types/inventory"

import { logActivity } from "../../activity-logs/services/activity-logger.service"

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

  await logActivity({
    action: "Added Material",
    module: "Inventory",
    description: `Added ${material.material_name} to inventory.`,
    severity: "info",
  })
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

  await logActivity({
    action: "Updated Material",
    module: "Inventory",
    description: `Updated inventory material with ID ${id}.`,
    severity: "info",
  })
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

  await logActivity({
    action: "Archived Material",
    module: "Inventory",
    description: `Archived inventory material with ID ${id}.`,
    severity: "warning",
  })
}