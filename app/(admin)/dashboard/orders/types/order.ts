export type OrderType = "standard" | "custom"

export type OrderStatus =
  | "pending"
  | "quoted"
  | "approved"
  | "in_production"
  | "ready_for_delivery"
  | "delivered"
  | "cancelled"
  | "denied"

export interface MaterialSnapshot {
  material_id: string
  material_name: string
  quantity: number
  unit: string
  unit_cost: number
  markup_percentage: number
  subtotal: number
}

export interface LaborSnapshot {
  service_id: string
  service_name: string
  quantity: number
  unit: string
  labor_cost: number
  markup_percentage: number
  subtotal: number
}

export interface OrderItem {
  id: string
  order_id: string

  product_id: string
  product_name_snapshot: string

  quantity: number

  material_subtotal: number
  labor_subtotal: number
  markup_amount: number

  unit_price_snapshot: number
  line_total: number

  materials_snapshot: MaterialSnapshot[]
  labor_snapshot: LaborSnapshot[]

  width?: number | null
  height?: number | null
  depth?: number | null
  dimensionUnit?: string | null
}

export interface Order {
  id: string
  order_number: string

  customer_id: string

  order_type: OrderType
  status: OrderStatus

  subtotal: number
  labor_total: number
  delivery_fee: number
  total_amount: number

  quotation: Record<string, any> | null

  denial_reason: string | null
  notes: string | null

  created_at: string
  updated_at: string

  items?: OrderItem[]

  profiles?: {
  id: string
  first_name: string
  last_name: string
} | null
}

export interface CreateOrderItemInput {
  product_id: string
  quantity: number

  width?: number | null
  height?: number | null
  depth?: number | null

  dimension_unit?: string

  aluminum_variant_id?: string | null
  glass_variant_id?: string | null
}

export interface CreateOrderInput {
  customer_id: string
  order_type: OrderType
  items: CreateOrderItemInput[]
  delivery_fee?: number
  notes?: string
}

export interface OrderProfile {
  id: string
  first_name: string | null
  last_name: string | null

}
