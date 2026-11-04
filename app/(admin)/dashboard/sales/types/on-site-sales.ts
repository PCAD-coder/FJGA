export type OnSitePaymentStatus = "paid" | "unpaid"
export type OnSitePaymentFilter = "all" | OnSitePaymentStatus

export interface OnSiteTransaction {
  id: string
  visitNumber: string | null
  customerName: string
  serviceName: string | null
  serviceFee: number | null
  travelFee: number | null
  totalFee: number | null
  paymentStatus: OnSitePaymentStatus | null
  paymentMethod: string | null
  paidAt: string | null
  paymentReceivedBy: string | null
  createdAt: string | null
}

export interface OnSiteTransactionRow {
  id: string
  visit_number: string | null
  service_name_snapshot: string | null
  service_fee: number | string | null
  travel_fee: number | string | null
  total_fee: number | string | null
  payment_status: string | null
  payment_method: string | null
  paid_at: string | null
  payment_received_by: string | null
  created_at: string | null
  customer: {
    first_name: string | null
    last_name: string | null
    full_name: string | null
  } | null
}
