export interface InventoryMaterial {
  id: string

  material_name: string

  category: string

  specification: string

  size: string

  unit: string

  stock_quantity: number

  minimum_stock: number

  remarks: string | null

  created_at: string

  updated_at: string

  is_active: boolean

  markup_percentage?: number | null

}

export type InventoryInsert = Omit<
  InventoryMaterial,
  "id" | "created_at" | "updated_at"
>

export type InventoryUpdate = Partial<InventoryInsert>