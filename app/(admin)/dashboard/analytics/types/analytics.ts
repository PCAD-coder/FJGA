export interface RevenueData {
  month: string
  revenue: number
}

export interface OrdersData {
  month: string
  orders: number
}

export interface TopProduct {
  id: string
  productName: string
  orders: number
  revenue: number
}

export interface MaterialUsage {
  id: string
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