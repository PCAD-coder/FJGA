export type CustomOrderRequestStatus =
  | "pending"
  | "quoted"
  | "approved"
  | "denied"

  export interface CustomOrderRequestListItem {
  id: string
  request_number: string | null
  project_name: string
  product_category: string | null
  quantity: number

  width: number | null
  height: number | null
  depth: number | null
  dimension_unit: string | null

  status: CustomOrderRequestStatus
  quotation: unknown | null
  denial_reason: string | null

  created_at: string
  updated_at: string

  reference_image_path: string | null
  reference_image_url: string | null
}

export interface CustomOrderRequest {
  id: string
  request_number: string | null
  customer_id: string

  project_name: string
  product_category: string | null
  quantity: number
  description: string | null

  width: number | null
  height: number | null
  depth: number | null
  dimension_unit: string | null
  measurements_approximate: boolean

  specifications: Record<string, string>

  preferred_frame: string | null
  preferred_glass: string | null
  preferred_finish: string | null
  let_fjga_recommend: boolean
  other_preferences: string | null

  reference_notes: string | null

  status: CustomOrderRequestStatus
  quotation: unknown | null
  denial_reason: string | null

  created_at: string
  updated_at: string
}

export interface CustomOrderImage {
  id: string
  request_id: string
  image_url: string
  display_order: number
  created_at: string
}
export interface CustomOrderRequestImageDetail {
  id: string
  image_url: string
  display_order: number
  signed_url: string | null
}

export interface CustomOrderRequestDetail {
  id: string
  request_number: string | null
  customer_id: string

  project_name: string
  product_category: string | null
  quantity: number
  description: string | null

  width: number | null
  height: number | null
  depth: number | null
  dimension_unit: string | null
  measurements_approximate: boolean

  specifications: Record<string, string>

  preferred_frame: string | null
  preferred_glass: string | null
  preferred_finish: string | null
  let_fjga_recommend: boolean
  other_preferences: string | null

  reference_notes: string | null

  status: CustomOrderRequestStatus
  quotation: unknown | null
  denial_reason: string | null

  created_at: string
  updated_at: string

  images: CustomOrderRequestImageDetail[]
}
export type ClientQuotationStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"

export interface ClientQuotationSummary {
  id: string
  quotationNumber: string
  customRequestId: string
  status: ClientQuotationStatus
  projectName: string
  subtotal: number
  deliveryFee: number
  totalAmount: number
  sentAt: string | null
  acceptedAt: string | null
  declinedAt: string | null
}
export interface ClientQuotationItem {
  id: string
  itemNumber: number
  itemName: string
  details: string | null

  width: number | null
  height: number | null
  depth: number | null
  dimensionUnit: string | null

  quantity: number
  unitPrice: number
  lineTotal: number
}

export interface ClientQuotationDetail
  extends ClientQuotationSummary {
  customerAddressSnapshot: string | null
  notes: string | null
  createdAt: string

  items: ClientQuotationItem[]
}