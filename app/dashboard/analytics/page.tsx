'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"

import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Package,
} from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Reports & Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Last 6 Months</Button>
          <Button variant="outline">All Reports</Button>
          <Button variant="outline">Export PDF</Button>
          <Button variant="outline">Export Excel</Button>
        </div>
      </div>

      {/* 🔹 TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        <Card className="flex justify-between items-center p-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">$377,000</p>
            <span className="text-xs text-green-500">
              +15.3% from last period
            </span>
          </div>
          <DollarSign className="text-blue-500" />
        </Card>

        <Card className="flex justify-between items-center p-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">198</p>
            <span className="text-xs text-green-500">
              +8.2% from last period
            </span>
          </div>
          <ShoppingCart className="text-green-500" />
        </Card>

        <Card className="flex justify-between items-center p-4">
          <div>
            <p className="text-sm text-muted-foreground">Avg Order Value</p>
            <p className="text-2xl font-bold">$1904</p>
            <span className="text-xs text-red-500">
              -5.7% from last period
            </span>
          </div>
          <TrendingUp className="text-orange-500" />
        </Card>

        <Card className="flex justify-between items-center p-4">
          <div>
            <p className="text-sm text-muted-foreground">Products Sold</p>
            <p className="text-2xl font-bold">540</p>
            <span className="text-xs text-purple-500">
              +11.4% from last period
            </span>
          </div>
          <Package className="text-purple-500" />
        </Card>

      </div>

      {/* 🔹 CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] flex items-center justify-center text-muted-foreground">
              Line Chart Here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] flex items-center justify-center text-muted-foreground">
              Bar Chart Here
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 🔹 PIE + PAYMENT STATUS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Pie Chart Here
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Status Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">

            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Paid (156 orders)
              </div>
              <span>$487,500</span>
            </div>

            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Partial (34 orders)
              </div>
              <span>$89,200</span>
            </div>

            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Unpaid (18 orders)
              </div>
              <span>$52,300</span>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* 🔹 MOST REQUESTED PRODUCTS */}
      <Card>
        <CardHeader>
          <CardTitle>Most Requested Products</CardTitle>
        </CardHeader>
        <CardContent>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {[1,2,3,4,5].map((rank) => (
                <TableRow key={rank}>
                  <TableCell>
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-muted text-xs">
                      {rank}
                    </span>
                  </TableCell>
                  <TableCell>Sample Product</TableCell>
                  <TableCell>Fixture</TableCell>
                  <TableCell>100</TableCell>
                  <TableCell>$120,000</TableCell>
                  <TableCell>
                    <span className="text-green-500 text-xs">+12%</span>
                  </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>

        </CardContent>
      </Card>

      {/* 🔹 MONTHLY SUMMARY */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Custom Orders</TableHead>
                <TableHead>Premade Orders</TableHead>
                <TableHead>Avg Order Value</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              <TableRow>
                <TableCell>Jan 2026</TableCell>
                <TableCell>$45,000</TableCell>
                <TableCell>23</TableCell>
                <TableCell>15</TableCell>
                <TableCell>8</TableCell>
                <TableCell>$1,957</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Feb 2026</TableCell>
                <TableCell>$52,000</TableCell>
                <TableCell>28</TableCell>
                <TableCell>18</TableCell>
                <TableCell>10</TableCell>
                <TableCell>$1,857</TableCell>
              </TableRow>

            </TableBody>
          </Table>

        </CardContent>
      </Card>

    </div>
  )
}