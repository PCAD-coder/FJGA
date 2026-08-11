export type CustomOrderStatus =
  | "pending"
  | "quoted"
  | "approved"
  | "denied"

export interface QuotationMaterial {
  id: number
  material: string
  quantity: number
  unitPrice: number
}

export interface Quotation {
  materials: QuotationMaterial[]
  laborCost: number
  deliveryFee: number
  totalCost: number
}

export interface CustomOrder {
  id: string

  customerId: string
  clientName: string

  projectName: string

  image: string | null

  width: number | null
  height: number | null

  notes: string | null

  status: CustomOrderStatus

  quotation?: Quotation | null

  denialReason?: string | null

  submittedAt: string
}