"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

import AdminDashboardSkeleton from "./dashboard-skeleton"

import { DashboardCard } from "@/components/dashboard_cards"

import { TrendingUp, ClipboardList, AlertTriangle, Truck } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type DashboardStats = {
  sixMonthSales: number
  activeOrders: number
  productionOrders: number
  lowStockItems: number
  pendingDeliveries: number
}
type CategoryTooltipProps = {
  active?: boolean
  payload?: Array<{
    payload: {
      name: string
      value: number
      quantity: number
    }
  }>
}
function CategoryTooltip({ active, payload }: CategoryTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const data = payload[0].payload

  return (
    <div className="rounded-xl border bg-popover p-3 text-popover-foreground shadow-md">
      <p className="text-sm font-medium">{data.name}</p>

      <p className="text-sm text-muted-foreground">
        Sales Share: {data.value}%
      </p>

      <p className="text-sm text-muted-foreground">
        Products Sold: {data.quantity}
      </p>
    </div>
  )
}

type DashboardClientProps = {
  profile: {
    id: string
    role: string
    first_name?: string | null
    last_name?: string | null
  }
}

export default function DashboardClient({ profile }: DashboardClientProps) {
  const [stats, setStats] = useState<DashboardStats>({
    sixMonthSales: 0,
    activeOrders: 0,
    productionOrders: 0,
    lowStockItems: 0,
    pendingDeliveries: 0,
  })

  const [loading, setLoading] = useState(true)
  const [revenueData, setRevenueData] = useState<
    { month: string; revenue: number }[]
  >([])

  const [categoryData, setCategoryData] = useState<
    {
      name: string
      value: number
      quantity: number
      color: string
    }[]
  >([])

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        const supabase = createClient()

        const now = new Date()

        // Start of the 7-month revenue range
        const revenueStart = new Date(now.getFullYear(), now.getMonth() - 5, 1)

        const revenueEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)

        const [
          activeOrdersResult,
          productionOrdersResult,
          lowStockResult,
          deliveriesResult,
          returnDeliveriesResult,
          revenueTrendResult,
          categoryDistributionResult,
        ] = await Promise.all([
          supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .in("status", ["in_production", "ready_for_delivery"]),

          supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("status", "in_production"),

          supabase
            .from("inventory_materials")
            .select("id, stock_quantity, minimum_stock")
            .eq("is_active", true),

          supabase
            .from("deliveries")
            .select("id", { count: "exact", head: true })
            .not("delivery_status", "in", "(delivered,cancelled)"),

          supabase
            .from("return_deliveries")
            .select("id", { count: "exact", head: true })
            .not("delivery_status", "in", "(delivered,cancelled)"),
          supabase
            .from("orders")
            .select("created_at, total_amount")
            .eq("status", "delivered")
            .gte("created_at", revenueStart.toISOString())
            .lt("created_at", revenueEnd.toISOString()),

          supabase
            .from("order_items")
            .select(
              `
    quantity,
    line_total,
    products!inner (
      category
    ),
    orders!inner (
      status,
      created_at
    )
  `
            )
            .eq("orders.status", "delivered")
            .gte("orders.created_at", revenueStart.toISOString())
            .lt("orders.created_at", revenueEnd.toISOString()),
        ])

        if (activeOrdersResult.error) {
          throw activeOrdersResult.error
        }

        if (productionOrdersResult.error) {
          throw productionOrdersResult.error
        }

        if (lowStockResult.error) {
          throw lowStockResult.error
        }

        if (deliveriesResult.error) {
          throw deliveriesResult.error
        }

        if (returnDeliveriesResult.error) {
          throw returnDeliveriesResult.error
        }
        if (revenueTrendResult.error) {
          throw revenueTrendResult.error
        }

        if (categoryDistributionResult.error) {
          throw categoryDistributionResult.error
        }

        const sixMonthSales = (revenueTrendResult.data ?? []).reduce(
          (total, order) => total + Number(order.total_amount ?? 0),
          0
        )

        const pendingDeliveries =
          (deliveriesResult.count ?? 0) + (returnDeliveriesResult.count ?? 0)
        // Build the last 6 months of revenue data
        const revenueByMonth = new Map<string, number>()

        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)

          const key = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`

          revenueByMonth.set(key, 0)
        }

        for (const order of revenueTrendResult.data ?? []) {
          const date = new Date(order.created_at)

          const key = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`

          if (revenueByMonth.has(key)) {
            revenueByMonth.set(
              key,
              (revenueByMonth.get(key) ?? 0) + Number(order.total_amount ?? 0)
            )
          }
        }

        const formattedRevenueData = Array.from(revenueByMonth.entries()).map(
          ([key, revenue]) => {
            const [year, month] = key.split("-").map(Number)

            const date = new Date(year, month - 1, 1)

            return {
              month: date.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              }),
              revenue,
            }
          }
        )

        // Build product category sales distribution
        const categoryRevenue = new Map<string, number>()
        const categoryQuantity = new Map<string, number>()

        for (const item of categoryDistributionResult.data ?? []) {
          const product = Array.isArray(item.products)
            ? item.products[0]
            : item.products

          const category = product?.category?.trim() || "Uncategorized"

          categoryRevenue.set(
            category,
            (categoryRevenue.get(category) ?? 0) + Number(item.line_total ?? 0)
          )

          categoryQuantity.set(
            category,
            (categoryQuantity.get(category) ?? 0) + Number(item.quantity ?? 0)
          )
        }

        const totalCategoryRevenue = Array.from(
          categoryRevenue.values()
        ).reduce((total, value) => total + value, 0)

        const categoryColors = [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#8b5cf6",
          "#ef4444",
          "#06b6d4",
        ]

        const formattedCategoryData = Array.from(categoryRevenue.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name, revenue], index) => ({
            name,
            value:
              totalCategoryRevenue > 0
                ? Number(((revenue / totalCategoryRevenue) * 100).toFixed(1))
                : 0,
            quantity: categoryQuantity.get(name) ?? 0,
            color: categoryColors[index % categoryColors.length],
          }))
        setRevenueData(formattedRevenueData)
        setCategoryData(formattedCategoryData)

        setStats({
          sixMonthSales,
          activeOrders: activeOrdersResult.count ?? 0,
          productionOrders: productionOrdersResult.count ?? 0,
          lowStockItems: (lowStockResult.data ?? []).filter(
            (material) =>
              Number(material.stock_quantity ?? 0) <=
              Number(material.minimum_stock ?? 0)
          ).length,
          pendingDeliveries,
        })
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error)

        if (error && typeof error === "object") {
          console.error(
            "Dashboard error details:",
            JSON.stringify(error, null, 2)
          )
        }
      } finally {
        setLoading(false)
      }
    }

    loadDashboardStats()
  }, [])

  {
    /*
    useEffect(() => {
  async function loadDashboardStats() {
    try {
      const supabase = createClient()

      const now = new Date()

      // ==========================================
      // CURRENT WEEK
      // Sunday 00:00 -> next Sunday 00:00
      // ==========================================
      const startOfWeek = new Date(now)
      startOfWeek.setHours(0, 0, 0, 0)
      startOfWeek.setDate(now.getDate() - now.getDay())

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 7)

      // ==========================================
      // LAST 7 MONTHS
      // ==========================================
      const revenueStart = new Date(
        now.getFullYear(),
        now.getMonth() - 6,
        1
      )

      const revenueEnd = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
      )

      const [
        weeklySalesResult,
        activeOrdersResult,
        productionOrdersResult,
        lowStockResult,
        deliveriesResult,
        returnDeliveriesResult,
        revenueTrendResult,
        categoryDistributionResult,
      ] = await Promise.all([
        // ==========================================
        // WEEKLY SALES
        // ==========================================
        supabase
          .from("orders")
          .select("total_amount")
          .eq("status", "delivered")
          .gte("created_at", startOfWeek.toISOString())
          .lt("created_at", endOfWeek.toISOString()),

        // ==========================================
        // ACTIVE ORDERS
        // ==========================================
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .in("status", ["in_production", "ready_for_delivery"]),

        // ==========================================
        // PRODUCTION ORDERS
        // ==========================================
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("status", "in_production"),

        // ==========================================
        // LOW STOCK
        // ==========================================
        supabase
          .from("inventory_materials")
          .select("id, stock_quantity, minimum_stock")
          .eq("is_active", true),

        // ==========================================
        // PENDING DELIVERIES
        // ==========================================
        supabase
          .from("deliveries")
          .select("id", { count: "exact", head: true })
          .not("delivery_status", "in", "(delivered,cancelled)"),

        // ==========================================
        // PENDING RETURN DELIVERIES
        // ==========================================
        supabase
          .from("return_deliveries")
          .select("id", { count: "exact", head: true })
          .not("delivery_status", "in", "(delivered,cancelled)"),

        // ==========================================
        // REVENUE ANALYTICS
        // ==========================================
        supabase
          .from("orders")
          .select("created_at, total_amount")
          .eq("status", "delivered")
          .gte("created_at", revenueStart.toISOString())
          .lt("created_at", revenueEnd.toISOString()),

        // ==========================================
        // PRODUCT CATEGORY DISTRIBUTION
        // ==========================================
        supabase
          .from("order_items")
          .select(`
            line_total,
            products!inner (
              category
            ),
            orders!inner (
              status
            )
          `)
          .eq("orders.status", "delivered"),
      ])

      // ==========================================
      // ERROR HANDLING
      // ==========================================

      if (weeklySalesResult.error) {
        throw weeklySalesResult.error
      }

      if (activeOrdersResult.error) {
        throw activeOrdersResult.error
      }

      if (productionOrdersResult.error) {
        throw productionOrdersResult.error
      }

      if (lowStockResult.error) {
        throw lowStockResult.error
      }

      if (deliveriesResult.error) {
        throw deliveriesResult.error
      }

      if (returnDeliveriesResult.error) {
        throw returnDeliveriesResult.error
      }

      if (revenueTrendResult.error) {
        throw revenueTrendResult.error
      }

      if (categoryDistributionResult.error) {
        throw categoryDistributionResult.error
      }

      // ==========================================
      // TOTAL WEEKLY SALES
      // ==========================================

      const weeklySales = (
        weeklySalesResult.data ?? []
      ).reduce(
        (total, order) =>
          total + Number(order.total_amount ?? 0),
        0
      )

      // ==========================================
      // PENDING DELIVERIES
      // ==========================================

      const pendingDeliveries =
        (deliveriesResult.count ?? 0) +
        (returnDeliveriesResult.count ?? 0)

      // ==========================================
      // REVENUE BY MONTH
      // ==========================================

      const revenueByMonth = new Map<string, number>()

      // Create all 7 months first,
      // including months with zero sales.
      for (let i = 6; i >= 0; i--) {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1
        )

        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`

        revenueByMonth.set(key, 0)
      }

      // Add every delivered order to its month
      for (const order of revenueTrendResult.data ?? []) {
        const date = new Date(order.created_at)

        const key = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`

        if (revenueByMonth.has(key)) {
          revenueByMonth.set(
            key,
            (revenueByMonth.get(key) ?? 0) +
              Number(order.total_amount ?? 0)
          )
        }
      }

      const formattedRevenueData = Array.from(
        revenueByMonth.entries()
      ).map(([key, revenue]) => {
        const [year, month] = key.split("-").map(Number)

        const date = new Date(year, month - 1, 1)

        return {
          month: date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }),
          revenue,
        }
      })

      // IMPORTANT:
      // This was missing from your original code.
      setRevenueData(formattedRevenueData)

      // ==========================================
      // PRODUCT CATEGORY DISTRIBUTION
      // ==========================================

      const categoryTotals = new Map<string, number>()

      for (
        const item of categoryDistributionResult.data ?? []
      ) {
        const product = Array.isArray(item.products)
          ? item.products[0]
          : item.products

        const category =
          product?.category ?? "Uncategorized"

        const lineTotal = Number(item.line_total ?? 0)

        categoryTotals.set(
          category,
          (categoryTotals.get(category) ?? 0) + lineTotal
        )
      }

      // Total revenue from all categories
      const totalCategorySales = Array.from(
        categoryTotals.values()
      ).reduce(
        (total, value) => total + value,
        0
      )

      const colors = [
        "#3b82f6",
        "#22c55e",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#06b6d4",
        "#ec4899",
        "#84cc16",
      ]

      const formattedCategoryData = Array.from(
        categoryTotals.entries()
      ).map(([name, value], index) => ({
        name,
        value:
          totalCategorySales > 0
            ? Number(
                ((value / totalCategorySales) * 100).toFixed(1)
              )
            : 0,
        color: colors[index % colors.length],
      }))

      // IMPORTANT:
      // This was also missing from your original code.
      setCategoryData(formattedCategoryData)

      // ==========================================
      // SET KPI STATS
      // ==========================================

      setStats({
        weeklySales,
        activeOrders: activeOrdersResult.count ?? 0,
        productionOrders:
          productionOrdersResult.count ?? 0,
        lowStockItems: (
          lowStockResult.data ?? []
        ).filter(
          (material) =>
            Number(material.stock_quantity ?? 0) <=
            Number(material.minimum_stock ?? 0)
        ).length,
        pendingDeliveries,
      })
    } catch (error) {
      console.error(
        "Failed to load dashboard statistics:",
        error
      )

      if (
        error &&
        typeof error === "object"
      ) {
        console.error(
          "Dashboard error details:",
          JSON.stringify(error, null, 2)
        )
      }
    } finally {
      setLoading(false)
    }
  }

  loadDashboardStats()
}, [])

    */
  }

  if (loading) {
    return <AdminDashboardSkeleton />
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/70 pb-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Dashboard
        </h1>

        <p className="text-sm leading-5 text-muted-foreground">
          Welcome back{profile.first_name ? `, ${profile.first_name}` : ""}!
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Sales"
          value={
            loading
              ? "..."
              : `\u20B1${stats.sixMonthSales.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
          }
          description="Delivered sales in the past 6 months"
          icon={TrendingUp}
          color="text-emerald-600 dark:text-emerald-400"
        />

        <DashboardCard
          title="Active Orders"
          value={loading ? "..." : String(stats.activeOrders)}
          description={
            loading ? "Loading..." : `${stats.productionOrders} in production`
          }
          icon={ClipboardList}
          color="text-blue-600 dark:text-blue-400"
        />

        <DashboardCard
          title="Low Stock Items"
          value={loading ? "..." : String(stats.lowStockItems)}
          description="Reorder required"
          icon={AlertTriangle}
          color="text-amber-600 dark:text-amber-400"
        />

        <DashboardCard
          title="Pending Deliveries"
          value={loading ? "..." : String(stats.pendingDeliveries)}
          description="Deliveries still pending"
          icon={Truck}
          color="text-primary"
        />
      </div>

      {/* CHARTS */}
      <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
        <Card className="h-[360px] min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
          <CardHeader className="min-h-[88px] shrink-0 gap-1 border-b border-border/60 px-5 py-5 sm:px-6">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Revenue Analytics
            </CardTitle>
            <CardDescription className="text-sm leading-5">
              Monthly revenue trend (&#8369;)
            </CardDescription>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueData}
                margin={{ top: 15, right: 12, left: 12, bottom: 8 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                  opacity={0.6}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickMargin={12}
                  minTickGap={20}
                />
                <YAxis
                  width={85}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value) =>
                    `\u20B1${Number(value).toLocaleString("en-PH")}`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `\u20B1${Number(value).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  }
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                  }}
                  labelStyle={{
                    color: "var(--popover-foreground)",
                    fontWeight: "500",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--card)", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="h-[360px] min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
          <CardHeader className="min-h-[88px] shrink-0 gap-1 border-b border-border/60 px-5 py-5 sm:px-6">
            <CardTitle className="text-lg font-semibold tracking-tight">
              Product Category Distribution
            </CardTitle>

            <CardDescription className="text-sm leading-5">
              Sales by category (%)
            </CardDescription>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-6">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                  cornerRadius={5}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CategoryTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto">
              {categoryData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm"
                >
                  <div
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="min-w-0 flex-1 font-medium wrap-break-word">
                    {item.name}
                  </span>

                  <span className="font-medium text-muted-foreground tabular-nums">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RECENT ACTIVITY */}
      <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
        <CardHeader className="gap-1 border-b border-border/60 px-5 py-5 sm:px-6">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Recent Activities
          </CardTitle>

          <CardDescription className="text-sm leading-5">
            Latest actions performed in the system
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 py-5 sm:px-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-1 border-b border-border/60 pb-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span>Admin added new aluminum profile</span>
              <span className="shrink-0 text-sm text-muted-foreground">
                10 mins ago
              </span>
            </div>

            <div className="flex flex-col gap-1 border-b border-border/60 pb-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span>Staff updated inventory stock</span>
              <span className="shrink-0 text-sm text-muted-foreground">
                35 mins ago
              </span>
            </div>

            <div className="flex flex-col gap-1 border-b border-border/60 pb-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span>New custom order approved</span>
              <span className="shrink-0 text-sm text-muted-foreground">
                1 hour ago
              </span>
            </div>

            <div className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span>Delivery marked as completed</span>
              <span className="shrink-0 text-sm text-muted-foreground">
                3 hours ago
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
