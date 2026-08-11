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

}

export type InventoryInsert = Omit<
  InventoryMaterial,
  "id" | "created_at" | "updated_at"
>

export type InventoryUpdate = Partial<InventoryInsert>