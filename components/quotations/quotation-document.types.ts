export interface QuotationDocumentMaterial {
  materialName: string
  quantity: number
  unit: string
}

export interface QuotationDocumentItem {
  id: string
  itemNumber: number
  itemName: string

  materials: QuotationDocumentMaterial[]

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
  vatRate: number
  vatAmount: number
  deliveryFee: number
  totalAmount: number

notes: string | null
termsAndConditions: string | null

createdByName?: string | null
createdAt: string
sentAt: string | null

  items: QuotationDocumentItem[]
}