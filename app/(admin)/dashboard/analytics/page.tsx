"use client"

import { useState } from "react"

import { DollarSign, ShoppingCart, RotateCcw, Star } from "lucide-react"

import AnalyticsSummaryCard from "./components/analytics-summary-card"
import AnalyticsFilter from "./components/analytics-filter"

import RevenueChart from "./components/revenue-chart"
import OrdersChart from "./components/orders-chart"

import TopProductsTable from "./components/top-products-table"
import MaterialsUsageTable from "./components/materials-usage-table"

import {
  RevenueData,
  OrdersData,
  TopProduct,
  MaterialUsage,
} from "./types/analytics"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const revenueData: RevenueData[] = [
  { month: "Jan", revenue: 80000 },
  { month: "Feb", revenue: 95000 },
  { month: "Mar", revenue: 110000 },
  { month: "Apr", revenue: 125000 },
  { month: "May", revenue: 140000 },
  { month: "Jun", revenue: 170000 },
]

const ordersData: OrdersData[] = [
  { month: "Jan", orders: 12 },
  { month: "Feb", orders: 15 },
  { month: "Mar", orders: 18 },
  { month: "Apr", orders: 20 },
  { month: "May", orders: 23 },
  { month: "Jun", orders: 30 },
]

const topProducts: TopProduct[] = [
  {
    id: 1,
    productName: "Tempered Glass Door",
    orders: 38,
    revenue: 420000,
  },

  {
    id: 2,
    productName: "Sliding Window",
    orders: 35,
    revenue: 360000,
  },

  {
    id: 3,
    productName: "Storefront Glass",
    orders: 28,
    revenue: 310000,
  },

  {
    id: 4,
    productName: "Shower Enclosure",
    orders: 22,
    revenue: 250000,
  },
]

const materialsUsage: MaterialUsage[] = [
  {
    id: 1,
    materialName: '1/4" Clear Glass',
    quantityUsed: 320,
    unit: "Sheets",
  },

  {
    id: 2,
    materialName: '1/2" Tempered Glass',
    quantityUsed: 210,
    unit: "Sheets",
  },

  {
    id: 3,
    materialName: "798 Series Aluminum",
    quantityUsed: 185,
    unit: "Pieces",
  },

  {
    id: 4,
    materialName: "Sliding Door Track",
    quantityUsed: 130,
    unit: "Sets",
  },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("monthly")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

          <p className="text-muted-foreground">
            Monitor company performance, sales trends, and business insights.
          </p>
        </div>

        <AnalyticsFilter value={period} onChange={setPeriod} />
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsSummaryCard
          title="Total Revenue"
          value="₱1,250,000"
          description="+18% from last month"
          icon={<DollarSign className="h-8 w-8 text-green-600" />}
        />

        <AnalyticsSummaryCard
          title="Completed Orders"
          value="145"
          description="+12 this month"
          icon={<ShoppingCart className="h-8 w-8 text-blue-600" />}
        />

        <AnalyticsSummaryCard
          title="Return Requests"
          value="12"
          description="-10% from last month"
          icon={<RotateCcw className="h-8 w-8 text-orange-600" />}
        />

        <AnalyticsSummaryCard
          title="Customer Satisfaction"
          value="4.8 / 5"
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
              📈 Revenue increased by <strong>18%</strong>
              compared to the previous month.
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
