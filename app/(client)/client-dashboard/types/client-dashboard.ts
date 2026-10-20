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
  id: string

  type:
    | "custom_request"
    | "quotation"
    | "payment"
    | "production"
    | "delivery"
    | "return"
    | "system"

  title: string

  message: string

  link: string | null

  isRead: boolean

  createdAt: string
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