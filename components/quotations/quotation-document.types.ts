export interface QuotationDocumentItem {
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

export interface QuotationDocumentData {
  id: string
  quotationNumber: string
  projectName: string
  customerAddressSnapshot: string | null

  subtotal: number
  deliveryFee: number
  totalAmount: number

  notes: string | null

  createdAt: string
  sentAt: string | null

  items: QuotationDocumentItem[]
}