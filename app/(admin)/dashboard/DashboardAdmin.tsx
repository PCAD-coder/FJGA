"use client"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

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
function CategoryTooltip({
  active,
  payload,
}: CategoryTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const data = payload[0].payload

  return (
    <div className="rounded-md border bg-white p-3 shadow-md">
      <p className="font-medium text-black">{data.name}</p>

      <p className="text-sm text-black">
        Sales Share: {data.value}%
      </p>

      <p className="text-sm text-black">
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

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="text-muted-foreground">
          Welcome back{profile.first_name ? `, ${profile.first_name}` : ""}!
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
  title="Total Sales"
  value={
    loading
      ? "..."
      : `₱${stats.sixMonthSales.toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
  }
  description="Delivered sales in the past 6 months"
  icon={TrendingUp}
  color="text-green-500"
/>

        <DashboardCard
          title="Active Orders"
          value={loading ? "..." : String(stats.activeOrders)}
          description={
            loading ? "Loading..." : `${stats.productionOrders} in production`
          }
          icon={ClipboardList}
          color="text-blue-500"
        />

        <DashboardCard
          title="Low Stock Items"
          value={loading ? "..." : String(stats.lowStockItems)}
          description="Reorder required"
          icon={AlertTriangle}
          color="text-orange-500"
        />

        <DashboardCard
          title="Pending Deliveries"
          value={loading ? "..." : String(stats.pendingDeliveries)}
          description="Deliveries still pending"
          icon={Truck}
          color="text-purple-500"
        />
      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>Monthly revenue trend (₱)</CardDescription>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) =>
                    `₱${Number(value).toLocaleString("en-PH")}`
                  }
                />

                <Tooltip
                  formatter={(value) =>
                    `₱${Number(value).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  }
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                  labelStyle={{
                    color: "#000",
                    fontWeight: "500",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Category Distribution</CardTitle>

            <CardDescription>Sales by category (%)</CardDescription>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CategoryTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-2">
              {categoryData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="font-medium">{item.name}</span>

                  <span className="text-muted-foreground">({item.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RECENT ACTIVITY */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>

          <CardDescription>
            Latest actions performed in the system
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-3">
              <span>Admin added new aluminum profile</span>
              <span className="text-muted-foreground">10 mins ago</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>Staff updated inventory stock</span>
              <span className="text-muted-foreground">35 mins ago</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>New custom order approved</span>
              <span className="text-muted-foreground">1 hour ago</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery marked as completed</span>
              <span className="text-muted-foreground">3 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

