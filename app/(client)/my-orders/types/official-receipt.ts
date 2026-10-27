export interface OfficialReceiptAddressSnapshot {
  house_building_number: string | null
  street: string | null
  building_subdivision: string | null
  unit_floor: string | null

  region_psgc_code: string | null
  region_name: string | null

  province_psgc_code: string | null
  province_name: string | null

  city_psgc_code: string | null
  city_name: string | null

  barangay_psgc_code: string | null
  barangay_name: string | null

  postal_code: string | null
  landmark: string | null
}

export interface OfficialReceiptMaterialSnapshot {
  unit?: string | null
  color?: string | null
  series?: string | null
  quantity?: number | null
  subtotal?: number | null
  thickness?: string | number | null
  unit_cost?: number | null
  material_id?: string | null
  material_name?: string | null
  markup_percentage?: number | null
}

export interface OfficialReceiptLaborSnapshot {
  unit?: string | null
  quantity?: number | null
  subtotal?: number | null
  labor_cost?: number | null
  service_id?: string | null
  service_name?: string | null
  markup_percentage?: number | null
}

export interface OfficialReceiptItem {
  id: string
  official_receipt_id: string
  order_item_id: string | null

  product_name: string
  quantity: number

  width: number | null
  height: number | null
  depth: number | null
  dimension_unit: string | null

  material_subtotal: number
  labor_subtotal: number
  markup_amount: number

  unit_price: number
  line_total: number

  materials_snapshot: OfficialReceiptMaterialSnapshot[] | null
  labor_snapshot: OfficialReceiptLaborSnapshot[] | null

  created_at: string
}

export interface OfficialReceipt {
  id: string
  receipt_number: string

  order_id: string
  customer_id: string
  final_payment_id: string

  order_number: string | null
  project_name: string | null

  issued_at: string

  customer_name: string
  customer_email: string | null
  customer_contact_number: string | null

  billing_address: string | null
  billing_address_snapshot: OfficialReceiptAddressSnapshot | null

  payment_method: string
  payment_reference_number: string | null
  received_by_employee: string | null

  subtotal: number
  labor_total: number
  delivery_fee: number
  vat_rate: number
  vat_amount: number
  total_amount: number

  amount_paid_before_final: number
  final_payment_amount: number
  total_paid: number
  remaining_balance: number

  payment_status: "paid" | "void"

  email_status: "pending" | "sent" | "failed"
  emailed_at: string | null
  email_attempts: number
  email_last_error: string | null

  created_at: string
  updated_at: string

  items: OfficialReceiptItem[]
}