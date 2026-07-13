export interface QuoteItem {
  id: number

  material: string

  quantity: number

  unitPrice: number
}

export interface Quotation {
  materials: QuoteItem[]

  laborCost: number

  deliveryFee: number

  totalCost: number
}

export interface CustomOrder {
  id: number

  projectName: string

  clientName: string

  image: string

  width: number

  height: number

  notes: string

  status:
    | "pending"
    | "quoted"
    | "approved"
    | "denied"

  quotation?: Quotation

  denialReason?: string

  submittedAt: string
}