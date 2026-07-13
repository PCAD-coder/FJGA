export interface DashboardSummary {
  activeQuotations: number

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
  id: number

  orderNumber: string

  productName: string

  product: string

  status:
    | "Pending"
    | "In Production"
    | "Installation Scheduled"
    | "Completed"

  date: string
}