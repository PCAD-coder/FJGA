export interface DashboardSummary {
  readyForDelivery: number

  ordersInProduction: number

  totalBalance: number
}

export interface ProjectStatus {
  name: string

  value: number
}

export interface ClientNotification {
  id: number

  title: string

  message: string

  time: string

  type:
    | "quotation"
    | "production"
    | "approval"
    | "payment"
    | "delivery"
}

export interface RecentOrder {
  id: string

  orderNumber: string

  productName: string

  product: string

  status:
    | "Pending"
    | "Quoted"
    | "Approved"
    | "In Production"
    | "Ready for Delivery"
    | "Delivered"
    | "Cancelled"
    | "Denied"

  date: string
}