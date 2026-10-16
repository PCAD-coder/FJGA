export type CustomOrderStatus =
  | "pending"
  | "quoted"
  | "approved"
  | "denied"

export type QuotationStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "declined"

export interface CustomOrderReferenceImage {
  id: string
  imagePath: string
  displayOrder: number
  signedUrl: string | null
}
export interface CustomOrderDeliveryAddress {
  houseBuildingNumber: string
  street: string
  buildingSubdivision: string | null
  unitFloor: string | null

  regionPsgcCode: string
  regionName: string

  provincePsgcCode: string | null
  provinceName: string | null

  cityPsgcCode: string
  cityName: string

  barangayPsgcCode: string
  barangayName: string

  postalCode: string | null
  landmark: string | null
}

export interface CustomOrder {
  id: string
  requestNumber: string | null

  customerId: string
  clientName: string
  contactNumber: string | null

  projectName: string
  productCategory: string | null
  quantity: number

  deliveryAddress: CustomOrderDeliveryAddress | null

  description: string | null

  width: number | null
  height: number | null
  depth: number | null
  dimensionUnit: string | null
  measurementsApproximate: boolean

  specifications: Record<string, string>

  preferredFrame: string | null
  preferredGlass: string | null
  preferredFinish: string | null
  letFjgaRecommend: boolean
  otherPreferences: string | null

  referenceNotes: string | null
  images: CustomOrderReferenceImage[]

  status: CustomOrderStatus
  denialReason: string | null

  createdAt: string
  
}

export interface QuotationListItem {
  id: string
  quotationNumber: string

  customerId: string
  clientName: string

  sourceType: "catalog" | "custom_request"
  customRequestId: string | null
  requestNumber: string | null

  projectName: string
  status: QuotationStatus

  subtotal: number
  deliveryFee: number
  totalAmount: number

  createdAt: string
  sentAt: string | null
  acceptedAt: string | null
  declinedAt: string | null

  revisionNumber: number | null
}