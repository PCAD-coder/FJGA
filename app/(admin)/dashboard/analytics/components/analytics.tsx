"use client"

import { useEffect, useState } from "react"

import { DollarSign, ShoppingCart, RotateCcw, Star } from "lucide-react"

import AnalyticsSummaryCard from "./analytics-summary-card"
import AnalyticsFilter from "./analytics-filter"

import RevenueChart from "./revenue-chart"
import OrdersChart from "./orders-chart"

import TopProductsTable from "./top-products-table"
import MaterialsUsageTable from "./materials-usage-table"

import {
  RevenueData,
  OrdersData,
  TopProduct,
  MaterialUsage,
} from "../types/analytics"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  getAnalyticsSummary,
  getAnalyticsTrends,
  getTopProducts,
  getMaterialsUsage,
  type AnalyticsPeriod,
} from "../services/analytics-service"

export default function Analytics() {
  const [materialsUsage, setMaterialsUsage] = useState<MaterialUsage[]>([])

  const [topProducts, setTopProducts] = useState<TopProduct[]>([])

  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [ordersData, setOrdersData] = useState<OrdersData[]>([])
  const [period, setPeriod] = useState<AnalyticsPeriod>("monthly")

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    completedOrders: 0,
    returnRequests: 0,
    customerSatisfaction: 4.8,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)

        const [summaryData, trendsData, topProductsData, materialsUsageData] =
          await Promise.all([
            getAnalyticsSummary(period),
            getAnalyticsTrends(period),
            getTopProducts(period),
            getMaterialsUsage(period),
          ])

        setSummary(summaryData)

        setRevenueData(trendsData.revenueData)
        setOrdersData(trendsData.ordersData)

        setTopProducts(topProductsData)
        setMaterialsUsage(materialsUsageData)
      } catch (error) {
        console.error("Failed to load analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [period])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

          <p className="text-muted-foreground">
            Monitor company performance, sales trends, and business insights.
          </p>
        </div>

        <AnalyticsFilter
          value={period}
          onChange={(value) => {
            if (
              value === "monthly" ||
              value === "quarterly" ||
              value === "yearly"
            ) {
              setPeriod(value)
            }
          }}
        />
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsSummaryCard
          title="Total Revenue"
          value={
            loading
              ? "Loading..."
              : `₱${summary.totalRevenue.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
          }
          description="Revenue from delivered orders"
          icon={<DollarSign className="h-8 w-8 text-green-600" />}
        />

        <AnalyticsSummaryCard
          title="Completed Orders"
          value={loading ? "Loading..." : summary.completedOrders.toString()}
          description="Orders with delivered status"
          icon={<ShoppingCart className="h-8 w-8 text-blue-600" />}
        />

        <AnalyticsSummaryCard
          title="Return Requests"
          value={loading ? "Loading..." : summary.returnRequests.toString()}
          description="Requests submitted during the selected period"
          icon={<RotateCcw className="h-8 w-8 text-orange-600" />}
        />

        <AnalyticsSummaryCard
          title="Customer Satisfaction"
           value={loading ? "Loading..." : `${summary.customerSatisfaction} / 5`}
          description="Based on client feedback"
          icon={<Star className="h-8 w-8 text-yellow-500" />}
        />
      </div>

      {/* CHARTS */}

      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart data={revenueData} />

        <OrdersChart data={ordersData} />
      </div>

      {/* TABLES */}

      <div className="grid gap-6 xl:grid-cols-2">
        <TopProductsTable products={topProducts} />

        <MaterialsUsageTable materials={materialsUsage} />
      </div>

      {/* INSIGHTS */}

      <Card>
        <CardHeader>
          <CardTitle>Business Insights</CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="space-y-3 text-sm">
            <li>
              📈 Revenue increased by <strong>18%</strong> compared to the
              previous month.
            </li>

            <li>
              🏆 <strong>Tempered Glass Door</strong> remains the
              highest-selling product.
            </li>

            <li>📦 Order volume grew steadily over the last 6 months.</li>

            <li>
              🔧 Return requests decreased by <strong>10%</strong>, indicating
              improved product quality.
            </li>

            <li>
              ⭐ Customer satisfaction remains high at <strong>4.8 / 5</strong>.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
