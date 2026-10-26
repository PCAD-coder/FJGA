"use client"

import { useEffect, useState } from "react"

import { DollarSign, ShoppingCart, RotateCcw, Star } from "lucide-react"

import { DashboardCard } from "@/components/dashboard_cards"
import AnalyticsSkeleton from "./analytics-skeleton"
import { toast } from "sonner"
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

import AnalyticsExportMenu from "./analytics-export-menu"

export default function Analytics() {
  const [materialsUsage, setMaterialsUsage] = useState<MaterialUsage[]>([])

  const [topProducts, setTopProducts] = useState<TopProduct[]>([])

  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [ordersData, setOrdersData] = useState<OrdersData[]>([])
const now = new Date()

const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1
const currentQuarter = Math.floor(now.getMonth() / 3) + 1

const [year, setYear] = useState(currentYear)
const [quarter, setQuarter] = useState<number | null>(currentQuarter)
const [month, setMonth] = useState<number | null>(currentMonth)

const period: AnalyticsPeriod =
  month !== null
    ? `${year}-${String(month).padStart(2, "0")}`
    : quarter !== null
      ? `quarter-${year}-${quarter}`
      : `year-${year}`

  function handleYearChange(selectedYear: number) {
  setYear(selectedYear)
  setQuarter(null)
  setMonth(null)
}

function handleQuarterChange(selectedQuarter: number | null) {
  setQuarter(selectedQuarter)
  setMonth(null)
}

function handleMonthChange(selectedMonth: number | null) {
  setMonth(selectedMonth)

  if (selectedMonth !== null) {
    setQuarter(Math.floor((selectedMonth - 1) / 3) + 1)
  }
}

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
        toast.error("Unable to load analytics. Please try again.", {
          id: "analytics-load-error",
        })
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [period])

  if (loading) return <AnalyticsSkeleton />

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Analytics Dashboard
          </h1>

          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Monitor company performance, sales trends, and business insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <AnalyticsFilter
  year={year}
  quarter={quarter}
  month={month}
  onYearChange={handleYearChange}
  onQuarterChange={handleQuarterChange}
  onMonthChange={handleMonthChange}
/>

          <AnalyticsExportMenu
            period={period}
            summary={summary}
            revenueData={revenueData}
            ordersData={ordersData}
            topProducts={topProducts}
            materialsUsage={materialsUsage}
          />
        </div>
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
        <DashboardCard
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
          icon={DollarSign}
          color="text-emerald-600 dark:text-emerald-400"
        />

        <DashboardCard
          title="Completed Orders"
          value={loading ? "Loading..." : summary.completedOrders.toString()}
          description="Orders with delivered status"
          icon={ShoppingCart}
          color="text-blue-600 dark:text-blue-400"
        />

        <DashboardCard
          title="Return Requests"
          value={loading ? "Loading..." : summary.returnRequests.toString()}
          description="Requests submitted during the selected period"
          icon={RotateCcw}
          color="text-orange-600 dark:text-orange-400"
        />

        <DashboardCard
          title="Customer Satisfaction"
          value={loading ? "Loading..." : `${summary.customerSatisfaction} / 5`}
          description="Based on client feedback"
          icon={Star}
          color="text-yellow-600 dark:text-yellow-400"
        />
      </div>

      {/* CHARTS */}

      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart data={revenueData} />

        <OrdersChart data={ordersData} />
      </div>

      {/* TABLES */}

      <div className="grid gap-6 xl:grid-cols-2">
        <TopProductsTable key={`products-${period}`} products={topProducts} />

        <MaterialsUsageTable
          key={`materials-${period}`}
          materials={materialsUsage}
        />
      </div>

      {/* INSIGHTS */}

      <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
        <CardHeader className="border-b px-5 py-4">
          <CardTitle className="text-base font-semibold">
            Business Insights
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5">
          <ul className="list-disc space-y-3 pl-5 text-sm leading-6 marker:text-primary">
            <li>
              Revenue increased by <strong>18%</strong> compared to the previous
              month.
            </li>

            <li>
              <strong>Tempered Glass Door</strong> remains the highest-selling
              product.
            </li>

            <li>Order volume grew steadily over the last 6 months.</li>

            <li>
              Return requests decreased by <strong>10%</strong>, indicating
              improved product quality.
            </li>

            <li>
              Customer satisfaction remains high at <strong>4.8 / 5</strong>.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
