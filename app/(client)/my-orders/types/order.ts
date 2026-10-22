export type OrderStatus =
  | "Pending"
  | "Quoted"
  | "Approved"
  | "Production"
  | "Ready for Delivery"
  | "Completed"
  | "Declined"
  | "Cancelled"

export type PaymentSubmissionStatus = "pending" | "approved" | "rejected"

export interface OrderProgress {
  quotation: boolean
  production: boolean
  delivery: boolean
  completed: boolean
}

export interface OrderTimelineItem {
  id: string
  fromStage: string | null
  toStage: string
  notes: string | null
  changedAt: string
  changedBy: string | null
}

export interface OrderPaymentSubmission {
  id: string
  amount: number
  paymentMethod: string
  paymentDate: string
  referenceNumber: string | null
  proofImagePath: string | null
  verificationStatus: PaymentSubmissionStatus
  submittedAt: string
  verifiedAt: string | null
  rejectionReason: string | null
}

export interface OrderDeliveryAddress {
  houseBuildingNumber: string
  street: string
  buildingSubdivision: string | null
  unitFloor: string | null

  regionName: string
  provinceName: string | null
  cityName: string
  barangayName: string

  postalCode: string | null
  landmark: string | null
}

export interface Order {
  id: string

  orderNumber: string
  orderType: "standard" | "custom"

  sourceRequestId: string | null

  customerContactNumber: string | null

  deliveryAddress: OrderDeliveryAddress | null

  productName: string

  image: string

  madeToOrder: boolean

  quantity: number

  width: number | null
  height: number | null
  depth: number | null
  dimensionUnit: string

  orderedAt: string

  estimatedDelivery: string | null

total: number
subtotal: number

vatRate: number
vatAmount: number

deliveryFee: number

  unitPrice: number

  lineTotal: number

  currentStage: string

  progressPercentage: number

  status: OrderStatus

  progress: OrderProgress

  timeline: OrderTimelineItem[]

  createdAt: string

  /*
   * ============================================================
   * PAYMENT INFORMATION
   * ============================================================
   */

  amountPaid: number

  requiredDownPayment: number

  remainingDownPayment: number

  paymentDeadline: string | null

  paymentDaysRemaining: number | null

  productionPaymentComplete: boolean

  paymentSubmission: OrderPaymentSubmission | null
}
