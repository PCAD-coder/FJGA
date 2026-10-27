import { createClient } from "@/lib/supabase/client"

import type {
  AnalyticsSummary,
  RevenueData,
  OrdersData,
  TopProduct,
  MaterialUsage,
} from "../types/analytics"

export type AnalyticsPeriod = string

interface DateRange {
  start: Date
  end: Date
}

export function getPreviousAnalyticsPeriod(
  period: AnalyticsPeriod
): AnalyticsPeriod {
  if (period.startsWith("year-")) {
    const year = Number(period.replace("year-", ""))

    return `year-${year - 1}`
  }

  if (period.startsWith("quarter-")) {
    const [, yearValue, quarterValue] = period.split("-")

    const year = Number(yearValue)
    const quarter = Number(quarterValue)

    if (quarter === 1) {
      return `quarter-${year - 1}-4`
    }

    return `quarter-${year}-${quarter - 1}`
  }

  const [yearValue, monthValue] = period.split("-")

  const year = Number(yearValue)
  const month = Number(monthValue)

  if (month === 1) {
    return `${year - 1}-12`
  }

  return `${year}-${String(month - 1).padStart(2, "0")}`
}

function getDateRange(period: AnalyticsPeriod): DateRange {
  if (period.startsWith("year-")) {
    const year = Number(period.replace("year-", ""))

    if (Number.isInteger(year)) {
      return {
        start: new Date(year, 0, 1),
        end: new Date(year + 1, 0, 1),
      }
    }
  }

  if (period.startsWith("quarter-")) {
    const [, yearValue, quarterValue] = period.split("-")

    const year = Number(yearValue)
    const quarter = Number(quarterValue)

    if (
      Number.isInteger(year) &&
      Number.isInteger(quarter) &&
      quarter >= 1 &&
      quarter <= 4
    ) {
      const startMonth = (quarter - 1) * 3

      return {
        start: new Date(year, startMonth, 1),
        end: new Date(year, startMonth + 3, 1),
      }
    }
  }

  const [yearValue, monthValue] = period.split("-")

  const year = Number(yearValue)
  const month = Number(monthValue) - 1

  if (
    Number.isInteger(year) &&
    Number.isInteger(month) &&
    month >= 0 &&
    month <= 11
  ) {
    return {
      start: new Date(year, month, 1),
      end: new Date(year, month + 1, 1),
    }
  }

  const now = new Date()

  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
  }
}

export async function getAnalyticsSummary(
  period: AnalyticsPeriod
): Promise<AnalyticsSummary> {
  const supabase = createClient()

  const { start, end } = getDateRange(period)

  const startDate = start.toISOString()
  const endDate = end.toISOString()

  const [deliveredOrdersResult, returnRequestsResult, feedbackResult] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id, total_amount")
        .eq("status", "delivered")
        .gte("created_at", startDate)
        .lt("created_at", endDate),

      supabase
        .from("return_requests")
        .select("id")
        .gte("submitted_at", startDate)
        .lt("submitted_at", endDate),

      supabase
        .from("feedback")
        .select("rating")
        .eq("status", "published")
        .gte("created_at", startDate)
        .lt("created_at", endDate),
    ])

  if (deliveredOrdersResult.error) {
    throw deliveredOrdersResult.error
  }

  if (returnRequestsResult.error) {
    throw returnRequestsResult.error
  }

  if (feedbackResult.error) {
    throw feedbackResult.error
  }

  const deliveredOrders = deliveredOrdersResult.data ?? []
  const returnRequests = returnRequestsResult.data ?? []
  const feedbacks = feedbackResult.data ?? []

  const totalRevenue = deliveredOrders.reduce(
    (total, order) => total + Number(order.total_amount ?? 0),
    0
  )

  const customerSatisfaction =
    feedbacks.length > 0
      ? feedbacks.reduce(
          (total, feedback) => total + Number(feedback.rating ?? 0),
          0
        ) / feedbacks.length
      : 0

  return {
    totalRevenue,
    completedOrders: deliveredOrders.length,
    returnRequests: returnRequests.length,
    customerSatisfaction,
  }
}
export async function getAnalyticsTrends(
  period: AnalyticsPeriod
): Promise<{
  revenueData: RevenueData[]
  ordersData: OrdersData[]
}> {
  const supabase = createClient()

  const { start, end } = getDateRange(period)

  const { data, error } = await supabase
    .from("orders")
    .select("created_at, total_amount")
    .eq("status", "delivered")
    .gte("created_at", start.toISOString())
    .lt("created_at", end.toISOString())
    .order("created_at", { ascending: true })

  if (error) {
    throw error
  }

  const orders = data ?? []

  const isMonthly =
    !period.startsWith("quarter-") &&
    !period.startsWith("year-")

  /*
   * MONTH VIEW
   * Group chart data by day.
   */
  if (isMonthly) {
    const year = start.getFullYear()
    const month = start.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const revenueMap = new Map<string, number>()
    const ordersMap = new Map<string, number>()

    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${month}-${day}`

      revenueMap.set(key, 0)
      ordersMap.set(key, 0)
    }

    for (const order of orders) {
      const date = new Date(order.created_at)

      const key =
        `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

      revenueMap.set(
        key,
        (revenueMap.get(key) ?? 0) +
          Number(order.total_amount ?? 0)
      )

      ordersMap.set(
        key,
        (ordersMap.get(key) ?? 0) + 1
      )
    }

    const revenueData: RevenueData[] = []
    const ordersData: OrdersData[] = []

    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${month}-${day}`

      const label = new Date(
        year,
        month,
        day
      ).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
      })

      revenueData.push({
        month: label,
        revenue: revenueMap.get(key) ?? 0,
      })

      ordersData.push({
        month: label,
        orders: ordersMap.get(key) ?? 0,
      })
    }

    return {
      revenueData,
      ordersData,
    }
  }

  /*
   * QUARTER / YEAR VIEW
   * Group chart data by month.
   */
  const revenueMap = new Map<string, number>()
  const ordersMap = new Map<string, number>()

  const months: Date[] = []

  const cursor = new Date(
    start.getFullYear(),
    start.getMonth(),
    1
  )

  while (cursor < end) {
    months.push(new Date(cursor))

    cursor.setMonth(cursor.getMonth() + 1)
  }

  for (const date of months) {
    const key = `${date.getFullYear()}-${date.getMonth()}`

    revenueMap.set(key, 0)
    ordersMap.set(key, 0)
  }

  for (const order of orders) {
    const date = new Date(order.created_at)

    const key = `${date.getFullYear()}-${date.getMonth()}`

    revenueMap.set(
      key,
      (revenueMap.get(key) ?? 0) +
        Number(order.total_amount ?? 0)
    )

    ordersMap.set(
      key,
      (ordersMap.get(key) ?? 0) + 1
    )
  }

  const revenueData: RevenueData[] = months.map((date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}`

    return {
      month: date.toLocaleDateString("en-PH", {
        month: "short",
        year: "numeric",
      }),
      revenue: revenueMap.get(key) ?? 0,
    }
  })

  const ordersData: OrdersData[] = months.map((date) => {
    const key = `${date.getFullYear()}-${date.getMonth()}`

    return {
      month: date.toLocaleDateString("en-PH", {
        month: "short",
        year: "numeric",
      }),
      orders: ordersMap.get(key) ?? 0,
    }
  })

  return {
    revenueData,
    ordersData,
  }
}
export async function getTopProducts(
  period: AnalyticsPeriod
): Promise<TopProduct[]> {
  const supabase = createClient()

  const { start, end } = getDateRange(period)

  const { data, error } = await supabase
    .from("order_items")
    .select(
      `
      id,
      order_id,
      product_id,
      product_name_snapshot,
      quantity,
      line_total,
      orders!inner (
        status,
        created_at
      )
    `
    )
    .eq("orders.status", "delivered")
    .gte("orders.created_at", start.toISOString())
    .lt("orders.created_at", end.toISOString())

  if (error) {
    throw error
  }

  const items = data ?? []

  const productMap = new Map<
    string,
    {
      productName: string
      orderIds: Set<string>
      revenue: number
    }
  >()

  for (const item of items) {
    const existing = productMap.get(item.product_id)

    if (existing) {
      existing.orderIds.add(item.order_id)
      existing.revenue += Number(item.line_total ?? 0)
      continue
    }

    productMap.set(item.product_id, {
      productName: item.product_name_snapshot,
      orderIds: new Set([item.order_id]),
      revenue: Number(item.line_total ?? 0),
    })
  }

  return Array.from(productMap.entries())
    .map(([productId, product]) => ({
      id: productId,
      productName: product.productName,
      orders: product.orderIds.size,
      revenue: product.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
}
export async function getMaterialsUsage(
  period: AnalyticsPeriod
): Promise<MaterialUsage[]> {
  const supabase = createClient()

  const { start, end } = getDateRange(period)

  const { data, error } = await supabase
    .from("production_material_consumption")
    .select(
      `
      id,
      material_id,
      quantity,
      consumed_at,
      inventory_materials!inner (
        material_name,
        unit
      )
    `
    )
    .gte("consumed_at", start.toISOString())
    .lt("consumed_at", end.toISOString())

  if (error) {
    throw error
  }

  const consumptions = data ?? []

  const materialMap = new Map<
    string,
    {
      materialName: string
      quantityUsed: number
      unit: string
    }
  >()

  for (const consumption of consumptions) {
    const material = Array.isArray(consumption.inventory_materials)
      ? consumption.inventory_materials[0]
      : consumption.inventory_materials

    if (!material) {
      continue
    }

    const existing = materialMap.get(consumption.material_id)

    if (existing) {
      existing.quantityUsed += Number(consumption.quantity ?? 0)
      continue
    }

    materialMap.set(consumption.material_id, {
      materialName: material.material_name,
      quantityUsed: Number(consumption.quantity ?? 0),
      unit: material.unit,
    })
  }

  return Array.from(materialMap.entries())
    .map(([materialId, material]) => ({
      id: materialId,
      materialName: material.materialName,
      quantityUsed: material.quantityUsed,
      unit: material.unit,
    }))
    .sort((a, b) => b.quantityUsed - a.quantityUsed)
    .slice(0, 5)
}
