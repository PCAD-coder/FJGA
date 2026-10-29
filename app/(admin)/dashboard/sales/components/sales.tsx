"use client"

import SalesSkeleton from "./sales-skeleton"
import { DashboardCard } from "@/components/dashboard_cards"

import { useEffect, useMemo, useState } from "react"

import { CreditCard, DollarSign, Eye, Search, WalletCards } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { SaleDetailsDialog } from "./sale-details-dialog"

import { RecordPaymentDialog } from "./record-payment-dialog"

import { getSalesRecords } from "../services/sales-service"

import type { PaymentSubmission, SalesRecord } from "../types/sales"

import { getPendingPaymentSubmissions } from "../services/payment-verification-service"
import PendingPaymentSubmissions from "./pending-payment-submissions"
import { approvePaymentSubmission } from "../services/payment-service"
import { SalesExportMenu } from "./sales-export-menu"

function formatCurrency(value: number) {
  return `\u20B1${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value: string | null) {
  if (!value) {
    return "\u2014"
  }

  return new Date(value).toLocaleDateString()
}

function getPaymentStatusBadge(status: SalesRecord["paymentStatus"]) {
  switch (status) {
    case "paid":
      return <Badge variant="default">Paid</Badge>

    case "partial":
      return <Badge variant="secondary">Partial</Badge>

    case "unpaid":
      return <Badge variant="destructive">Unpaid</Badge>
  }
}

function getPaymentMethodLabel(paymentMethod: SalesRecord["paymentMethod"]) {
  switch (paymentMethod) {
    case "cash_on_delivery":
      return "Cash on Delivery"

    case "card":
      return "Card"

    case "gcash":
      return "GCash"

    default:
      return "\u2014"
  }
}

type PaymentStatusFilter = "all" | SalesRecord["paymentStatus"]

const PAGE_SIZE = 10

export default function Sales() {
  const [page, setPage] = useState(1)
  const [sales, setSales] = useState<SalesRecord[]>([])
  const [pendingPayments, setPendingPayments] = useState<PaymentSubmission[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState<PaymentStatusFilter>("all")
  const [error, setError] = useState<string | null>(null)
  const [selectedSale, setSelectedSale] = useState<SalesRecord | null>(null)
  const [paymentSale, setPaymentSale] = useState<SalesRecord | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadSales() {
      try {
        setLoading(true)
        setError(null)

        const data = await getSalesRecords()
        const pendingPayments = await getPendingPaymentSubmissions()

        if (!cancelled) {
          setSales(data)
          setPendingPayments(pendingPayments)
        }
      } catch (err) {
        console.error("Failed to load sales:", err)

        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load sales records"
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadSales()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredSales = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return sales.filter((sale) => {
      const matchesSearch =
        !searchValue ||
        sale.orderNumber.toLowerCase().includes(searchValue) ||
        sale.customerName.toLowerCase().includes(searchValue) ||
        sale.contactNumber?.toLowerCase().includes(searchValue)

      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        sale.paymentStatus === paymentStatusFilter

      return matchesSearch && matchesPaymentStatus
    })
  }, [sales, search, paymentStatusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredSales.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedSales = filteredSales.slice(startIndex, startIndex + PAGE_SIZE)

  const totalSales = useMemo(() => {
    return sales.reduce((total, sale) => total + sale.totalAmount, 0)
  }, [sales])

  const totalCollected = useMemo(() => {
    return sales.reduce((total, sale) => total + sale.amountPaid, 0)
  }, [sales])

  const totalOutstanding = useMemo(() => {
    return sales.reduce((total, sale) => total + sale.balance, 0)
  }, [sales])

const totalProfit = useMemo(() => {
  return sales
    .filter(
      (sale) =>
        sale.orderStatus === "delivered" &&
        sale.paymentStatus === "paid"
    )
    .reduce((total, sale) => total + sale.profit, 0)
}, [sales])

  if (loading) {
    return <SalesSkeleton />
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales</h1>

        <p className="text-muted-foreground">
          Monitor orders, payments, and outstanding balances.
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Sales"
          value={formatCurrency(totalSales)}
          description={`Across ${sales.length} order${sales.length !== 1 ? "s" : ""}`}
          icon={DollarSign}
          color="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard
          title="Amount Collected"
          value={formatCurrency(totalCollected)}
          description="Actual payments recorded"
          icon={WalletCards}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <DashboardCard
          title="Outstanding Balance"
          value={formatCurrency(totalOutstanding)}
          description="Remaining amount to collect"
          icon={CreditCard}
          color="text-amber-600 dark:text-amber-400"
        />
        <DashboardCard
          title="Total Profit"
          value={formatCurrency(totalProfit)}
          description="Profit from fully paid delivered orders"
          icon={DollarSign}
          color="text-primary"
        />
      </div>
      {/* PENDING PAYMENT SUBMISSIONS */}

      <PendingPaymentSubmissions
        submissions={pendingPayments}
        onUpdated={async () => {
          try {
            const [salesData, pendingData] = await Promise.all([
              getSalesRecords(),
              getPendingPaymentSubmissions(),
            ])

            setSales(salesData)
            setPendingPayments(pendingData)
          } catch (error) {
            console.error("Failed to refresh payment submissions:", error)
          }
        }}
      />

      {/* FILTERS & SEARCH */}

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Search order or customer..."
                className="pl-9"
              />
            </div>

            <Select
              value={paymentStatusFilter}
              onValueChange={(value) => {
                setPaymentStatusFilter(value as PaymentStatusFilter)
                setPage(1)
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partial">Partially Paid</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SALES TABLE */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Sales Records</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Showing {filteredSales.length} of {sales.length} records
            </p>
          </div>

          <SalesExportMenu
            sales={filteredSales}
            paymentStatusFilter={paymentStatusFilter}
            search={search}
          />
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading sales records...
            </div>
          ) : error ? (
            <div className="py-10 text-center text-sm text-destructive">
              {error}
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No sales records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>

                    <TableHead>Customer</TableHead>

                    <TableHead>Total</TableHead>

                    <TableHead>Profit</TableHead>

                    <TableHead>Paid</TableHead>

                    <TableHead>Balance</TableHead>

                    <TableHead>Payment Method</TableHead>

                    <TableHead>Status</TableHead>

                    <TableHead>Last Payment</TableHead>

                    <TableHead>Next Due</TableHead>

                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedSales.map((sale) => (
                    <TableRow key={sale.orderId}>
                      <TableCell className="font-medium">
                        {sale.orderNumber}
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium">{sale.customerName}</p>

                          {sale.contactNumber && (
                            <p className="text-xs text-muted-foreground">
                              {sale.contactNumber}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>{formatCurrency(sale.totalAmount)}</TableCell>

<TableCell className="font-medium">
  {sale.paymentStatus === "paid" ? (
    formatCurrency(sale.profit)
  ) : (
    <span className="text-muted-foreground">—</span>
  )}
</TableCell>

                      <TableCell>{formatCurrency(sale.amountPaid)}</TableCell>

                      <TableCell>
                        <span
                          className={
                            sale.balance > 0
                              ? "font-medium"
                              : "text-muted-foreground"
                          }
                        >
                          {formatCurrency(sale.balance)}
                        </span>
                      </TableCell>

                      <TableCell>
                        {getPaymentMethodLabel(sale.paymentMethod)}
                      </TableCell>

                      <TableCell>
                        {getPaymentStatusBadge(sale.paymentStatus)}
                      </TableCell>

                      <TableCell>{formatDate(sale.lastPaymentDate)}</TableCell>

                      <TableCell>{formatDate(sale.nextPaymentDue)}</TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          title="View sale"
                          onClick={() => setSelectedSale(sale)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {!error && filteredSales.length > 0 && (
        <nav
          aria-label="Sales records pagination"
          className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + PAGE_SIZE, filteredSales.length)} of{" "}
            {filteredSales.length} records
          </p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </nav>
      )}
      <SaleDetailsDialog
        sale={selectedSale}
        open={!!selectedSale}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSale(null)
          }
        }}
        formatDate={formatDate}
        formatCurrency={formatCurrency}
        getPaymentMethodLabel={getPaymentMethodLabel}
        getPaymentStatusBadge={getPaymentStatusBadge}
        onRecordPayment={() => {
          if (selectedSale) {
            setPaymentSale(selectedSale)
            setSelectedSale(null)
          }
        }}
      />

      <RecordPaymentDialog
        sale={paymentSale}
        open={!!paymentSale}
        onOpenChange={(open) => {
          if (!open) {
            setPaymentSale(null)
          }
        }}
        onPaymentRecorded={async () => {
          setPaymentSale(null)

          try {
            const [salesData, pendingData] = await Promise.all([
              getSalesRecords(),
              getPendingPaymentSubmissions(),
            ])

            setSales(salesData)
            setPendingPayments(pendingData)
          } catch (error) {
            console.error("Failed to refresh sales after payment:", error)
          }
        }}
      />
    </div>
  )
}
