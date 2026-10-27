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
  getPreviousAnalyticsPeriod,
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

  const [previousSummary, setPreviousSummary] = useState({
    totalRevenue: 0,
    completedOrders: 0,
    returnRequests: 0,
    customerSatisfaction: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)

        const previousPeriod = getPreviousAnalyticsPeriod(period)

        const [
          summaryData,
          previousSummaryData,
          trendsData,
          topProductsData,
          materialsUsageData,
        ] = await Promise.all([
          getAnalyticsSummary(period),
          getAnalyticsSummary(previousPeriod),
          getAnalyticsTrends(period),
          getTopProducts(period),
          getMaterialsUsage(period),
        ])

        setSummary(summaryData)
        setPreviousSummary(previousSummaryData)

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
  function getPercentageChange(current: number, previous: number) {
    if (previous === 0) {
      return null
    }

    return ((current - previous) / previous) * 100
  }

  function getComparisonLabel() {
    if (month !== null) {
      return "the previous month"
    }

    if (quarter !== null) {
      return "the previous quarter"
    }

    return "the previous year"
  }

  const revenueChange = getPercentageChange(
    summary.totalRevenue,
    previousSummary.totalRevenue
  )

  const orderChange = getPercentageChange(
    summary.completedOrders,
    previousSummary.completedOrders
  )

  const comparisonLabel = getComparisonLabel()

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
              Revenue for the selected period reached{" "}
              <strong>
                ₱
                {summary.totalRevenue.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
              {revenueChange !== null ? (
                <>
                  , which is{" "}
                  <strong>
                    {Math.abs(revenueChange).toFixed(1)}%{" "}
                    {revenueChange >= 0 ? "higher" : "lower"}
                  </strong>{" "}
                  than {comparisonLabel}.
                </>
              ) : (
                <>. No previous-period revenue is available for comparison.</>
              )}
            </li>

            <li>
              <strong>{summary.completedOrders}</strong>{" "}
              {summary.completedOrders === 1 ? "order was" : "orders were"}{" "}
              completed during the selected period
              {orderChange !== null ? (
                <>
                  , which is{" "}
                  <strong>
                    {Math.abs(orderChange).toFixed(1)}%{" "}
                    {orderChange >= 0 ? "higher" : "lower"}
                  </strong>{" "}
                  than {comparisonLabel}.
                </>
              ) : (
                <>
                  . No previous-period completed orders are available for
                  comparison.
                </>
              )}
            </li>

            {topProducts.length > 0 ? (
              <li>
                <strong>{topProducts[0].productName}</strong> is the
                top-performing product for the selected period, generating{" "}
                <strong>
                  ₱
                  {topProducts[0].revenue.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>{" "}
                in revenue.
              </li>
            ) : (
              <li>
                No delivered product sales were recorded for the selected
                period.
              </li>
            )}

            <li>
              <strong>{summary.returnRequests}</strong>{" "}
              {summary.returnRequests === 1
                ? "return request was"
                : "return requests were"}{" "}
              submitted during the selected period.
            </li>

            <li>
              Customer satisfaction for the selected period is{" "}
              <strong>{summary.customerSatisfaction.toFixed(1)} / 5</strong>.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
