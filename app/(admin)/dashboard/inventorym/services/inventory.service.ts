import { createClient } from "@/lib/supabase/client"

import {
  InventoryInsert,
  InventoryMaterial,
  InventoryUpdate,
} from "../types/inventory"

import { logActivity } from "../../activity-logs/services/activity-logger.service"

const supabase = createClient()

export interface RestockMaterialResult {
  material_id: string
  stock_before: number
  quantity_added: number
  stock_after: number
  batch_id: string | null
}
export interface RestockMaterialInput {
  materialId: string
  quantity: number
  notes?: string
  batchNumber?: string
  receivedAt?: string
  expirationDate?: string
}
export interface InitializeExpirationStockInput {
  materialId: string
  batchNumber?: string
  receivedAt: string
  expirationDate: string
  notes?: string
}

export interface InitializeExpirationStockResult {
  material_id: string
  stock_quantity: number
  initialized_quantity: number
  batch_id: string | null
}

export interface EnableExpirationTrackingInput {
  materialId: string
  batchNumber?: string
  receivedAt: string
  expirationDate: string
  notes?: string
}

export interface EnableExpirationTrackingResult {
  material_id: string
  stock_quantity: number
  initialized_quantity: number
  batch_id: string | null
}

export interface DisposeExpiredBatchInput {
  batchId: string
  notes?: string
}

export interface DisposeExpiredBatchResult {
  batch_id: string
  material_id: string
  quantity_disposed: number
  stock_before: number
  stock_after: number
}

export async function disposeExpiredBatch({
  batchId,
  notes,
}: DisposeExpiredBatchInput): Promise<DisposeExpiredBatchResult> {
  const { data, error } = await supabase.rpc(
    "dispose_expired_inventory_batch",
    {
      p_batch_id: batchId,
      p_notes: notes?.trim() || null,
    }
  )

  if (error) throw error

  if (!data || data.length === 0) {
    throw new Error(
      "Expired stock disposal completed without returning stock information."
    )
  }

  const result = data[0] as DisposeExpiredBatchResult

  await logActivity({
    action: "Disposed Expired Stock",
    module: "Inventory",
    description: `Disposed ${result.quantity_disposed} expired units from inventory material with ID ${result.material_id}. Stock changed from ${result.stock_before} to ${result.stock_after}.`,
    severity: "warning",
  })

  return result
}

export async function enableExpirationTracking(
  input: EnableExpirationTrackingInput
): Promise<EnableExpirationTrackingResult> {
  const { data, error } = await supabase.rpc("enable_expiration_tracking", {
    p_material_id: input.materialId,
    p_batch_number: input.batchNumber?.trim() || null,
    p_received_at: input.receivedAt,
    p_expiration_date: input.expirationDate,
    p_notes: input.notes?.trim() || null,
  })

  if (error) throw error

  if (!data || data.length === 0) {
    throw new Error(
      "Expiration tracking was enabled without returning batch information."
    )
  }

  const result = data[0] as EnableExpirationTrackingResult

  await logActivity({
    action: "Enabled Expiration Tracking",
    module: "Inventory",
    description:
      result.initialized_quantity > 0
        ? `Enabled expiration tracking for inventory material with ID ${input.materialId} and initialized ${result.initialized_quantity} existing units into an expiration batch.`
        : `Enabled expiration tracking for inventory material with ID ${input.materialId}.`,
    severity: "info",
  })

  return result
}

export async function getMaterials() {
  const { data, error } = await supabase
    .from("inventory_materials")
    .select(
      `
      *,
      inventory_stock_batches (
        id,
        batch_number,
        quantity_remaining,
        received_at,
          expiration_date
      )
    `
    )
    .eq("is_active", true)
    .order("material_name")

  if (error) throw error

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const expiringSoonLimit = new Date(today)
  expiringSoonLimit.setDate(expiringSoonLimit.getDate() + 30)

  return (data ?? []).map((material) => {
    const { inventory_stock_batches: batches = [], ...inventoryMaterial } =
      material

    const typedBatches = batches as Array<{
      id: string
      batch_number: string | null
      quantity_remaining: number | string | null
      received_at: string
      expiration_date: string
    }>

    const expirationBatches = typedBatches
  .filter((batch) => Number(batch.quantity_remaining ?? 0) > 0)
  .map((batch) => ({
    id: batch.id,
    batch_number: batch.batch_number,
    quantity_remaining: Number(batch.quantity_remaining ?? 0),
    received_at: batch.received_at,
    expiration_date: batch.expiration_date,
  }))
  .sort(
    (a, b) =>
      new Date(`${a.expiration_date}T00:00:00`).getTime() -
      new Date(`${b.expiration_date}T00:00:00`).getTime()
  )

    const batchQuantityRemaining = typedBatches.reduce(
      (total: number, batch) => total + Number(batch.quantity_remaining ?? 0),
      0
    )

    const expiredQuantity = typedBatches.reduce((total: number, batch) => {
      const quantityRemaining = Number(batch.quantity_remaining ?? 0)

      if (quantityRemaining <= 0 || !batch.expiration_date) {
        return total
      }

      const expirationDate = new Date(`${batch.expiration_date}T00:00:00`)

      if (expirationDate < today) {
        return total + quantityRemaining
      }

      return total
    }, 0)

    const expiringSoonQuantity = typedBatches.reduce((total: number, batch) => {
      const quantityRemaining = Number(batch.quantity_remaining ?? 0)

      if (quantityRemaining <= 0 || !batch.expiration_date) {
        return total
      }

      const expirationDate = new Date(`${batch.expiration_date}T00:00:00`)

      if (expirationDate >= today && expirationDate <= expiringSoonLimit) {
        return total + quantityRemaining
      }

      return total
    }, 0)

    const stockQuantity = Number(inventoryMaterial.stock_quantity ?? 0)

    return {
      ...inventoryMaterial,
      stock_quantity: stockQuantity,
      batch_quantity_remaining: batchQuantityRemaining,
      unbatched_quantity: Math.max(0, stockQuantity - batchQuantityRemaining),
      expired_quantity: expiredQuantity,
      expiring_soon_quantity: expiringSoonQuantity,
      expiration_batches: expirationBatches,
    } as InventoryMaterial
  })
}

export async function createMaterial(material: InventoryInsert) {
  const { error } = await supabase.from("inventory_materials").insert(material)

  if (error) throw error

  await logActivity({
    action: "Added Material",
    module: "Inventory",
    description: `Added ${material.material_name} to inventory.`,
    severity: "info",
  })
}

export async function updateMaterial(id: string, material: InventoryUpdate) {
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

export async function archiveMaterial(id: string) {
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

export async function restockMaterial({
  materialId,
  quantity,
  notes,
  batchNumber,
  receivedAt,
  expirationDate,
}: RestockMaterialInput): Promise<RestockMaterialResult> {
  const { data, error } = await supabase.rpc("restock_inventory_material", {
    p_material_id: materialId,
    p_quantity: quantity,
    p_notes: notes?.trim() || null,
    p_batch_number: batchNumber?.trim() || null,
    p_received_at: receivedAt || null,
    p_expiration_date: expirationDate || null,
  })

  if (error) throw error

  if (!data || data.length === 0) {
    throw new Error("Restock completed without returning stock information.")
  }

  const result = data[0] as RestockMaterialResult

  await logActivity({
    action: "Restocked Material",
    module: "Inventory",
    description: `Restocked inventory material with ID ${materialId} by ${quantity}. Stock changed from ${result.stock_before} to ${result.stock_after}.`,
    severity: "info",
  })

  return result
}

export async function initializeExpirationStock({
  materialId,
  batchNumber,
  receivedAt,
  expirationDate,
  notes,
}: InitializeExpirationStockInput): Promise<InitializeExpirationStockResult> {
  const { data, error } = await supabase.rpc("initialize_expiration_stock", {
    p_material_id: materialId,
    p_batch_number: batchNumber?.trim() || null,
    p_received_at: receivedAt,
    p_expiration_date: expirationDate,
    p_notes: notes?.trim() || null,
  })

  if (error) throw error

  if (!data || data.length === 0) {
    throw new Error(
      "Expiration stock initialization completed without returning batch information."
    )
  }

  const result = data[0] as InitializeExpirationStockResult

  await logActivity({
    action: "Initialized Expiration Stock",
    module: "Inventory",
    description: `Initialized ${result.initialized_quantity} existing units of inventory material with ID ${materialId} for expiration tracking.`,
    severity: "info",
  })

  return result
}
