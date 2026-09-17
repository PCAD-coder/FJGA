export type PaymentMethod =
  | "cash"
  | "cash_on_delivery"
  | "card"
  | "gcash"
  | "online_banking"
  | "qrph"

export type SalesPaymentStatus =
  | "unpaid"
  | "partial"
  | "paid"

export interface SalesPayment {
  id: string
  orderId: string
  amount: number
  paymentDate: string
  paymentMethod: PaymentMethod
  nextPaymentDue: string | null
  referenceNumber: string | null
  receivedByEmployee: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface SalesRecord {
  orderId: string
  orderNumber: string

  customerId: string
  customerName: string
  contactNumber: string | null

  orderType: "standard" | "custom"
  orderStatus: string

  paymentMethod: PaymentMethod | null

  totalAmount: number

  /**
   * Amount that must be paid before production can start.
   * Currently 50% of the order total.
   */
  requiredDownPayment: number

  /**
   * Remaining amount needed to satisfy the
   * initial 50% payment requirement.
   */
  downPaymentRemaining: number

  /**
   * Total amount actually received from the customer.
   */
  amountPaid: number

  /**
   * Remaining unpaid amount for the entire order.
   */
  balance: number

  /**
   * Whether the customer has paid enough
   * for production to begin.
   */
  productionPaymentComplete: boolean

  paymentStatus: SalesPaymentStatus

  lastPaymentDate: string | null
  nextPaymentDue: string | null

  createdAt: string

  payments: SalesPayment[]
}

export type PaymentSubmissionStatus =
  | "pending"
  | "approved"
  | "rejected"

export interface PaymentSubmission {
  id: string
  orderId: string
  orderNumber: string

  customerId: string
  customerName: string
  contactNumber: string | null

  amount: number
  paymentMethod: PaymentMethod
  paymentDate: string

  referenceNumber: string | null
  proofImagePath: string | null
  notes: string | null

  verificationStatus: PaymentSubmissionStatus

  submittedAt: string
  verifiedAt: string | null
  verifiedBy: string | null
  rejectionReason: string | null

  createdAt: string
  updatedAt: string
}