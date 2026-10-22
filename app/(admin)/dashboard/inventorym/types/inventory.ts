export interface InventoryMaterial {
  id: string

  material_name: string

  category: string

  series: string | null

  specification: string

  thickness: string | null

  color: string | null

  size: string

  unit: string

  stock_quantity: number

  minimum_stock: number

  markup_percentage?: number | null

  remarks: string | null

  created_at: string

  updated_at: string

  is_active: boolean

  tracks_expiration: boolean
  batch_quantity_remaining: number
  unbatched_quantity: number
  expired_quantity: number
  expiring_soon_quantity: number
  expiration_batches: InventoryExpirationBatch[]
}

export interface InventoryExpirationBatch {
  id: string
  batch_number: string | null
  quantity_remaining: number
  received_at: string
  expiration_date: string
}

export type InventoryInsert = Omit<
  InventoryMaterial,
  | "id"
  | "created_at"
  | "updated_at"
  | "batch_quantity_remaining"
  | "unbatched_quantity"
  | "expired_quantity"
  | "expiring_soon_quantity"
  | "expiration_batches"
>


export type InventoryUpdate = Partial<InventoryInsert>
