export interface RevenueData {
  month: string

  revenue: number
}

export interface OrdersData {
  month: string

  orders: number
}

export interface TopProduct {
  id: number

  productName: string

  orders: number

  revenue: number
}

export interface MaterialUsage {
  id: number

  materialName: string

  quantityUsed: number

  unit: string
}

export interface AnalyticsSummary {
  totalRevenue: number

  completedOrders: number

  returnRequests: number

  customerSatisfaction: number
}