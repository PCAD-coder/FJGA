"use client"

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

import { SaleDetailsDialog } from "./sale-details-dialog"

import { RecordPaymentDialog } from "./record-payment-dialog"

import { getSalesRecords } from "../services/sales-service"

import type {
  PaymentSubmission,
  SalesRecord,
} from "../types/sales"

import { getPendingPaymentSubmissions } from "../services/payment-verification-service"
import PendingPaymentSubmissions from "./pending-payment-submissions"
import { approvePaymentSubmission } from "../services/payment-service"

function formatCurrency(value: number) {
  return `₱${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
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
      return "—"
  }
}

export default function Sales() {
  const [sales, setSales] = useState<SalesRecord[]>([])
  const [pendingPayments, setPendingPayments] =
  useState<PaymentSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
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

    if (!searchValue) {
      return sales
    }

    return sales.filter((sale) => {
      return (
        sale.orderNumber.toLowerCase().includes(searchValue) ||
        sale.customerName.toLowerCase().includes(searchValue) ||
        sale.contactNumber?.toLowerCase().includes(searchValue)
      )
    })
  }, [sales, search])

  const totalSales = useMemo(() => {
    return sales.reduce((total, sale) => total + sale.totalAmount, 0)
  }, [sales])

  const totalCollected = useMemo(() => {
    return sales.reduce((total, sale) => total + sale.amountPaid, 0)
  }, [sales])

  const totalOutstanding = useMemo(() => {
    return sales.reduce((total, sale) => total + sale.balance, 0)
  }, [sales])

  const paidOrders = useMemo(() => {
    return sales.filter((sale) => sale.paymentStatus === "paid").length
  }, [sales])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales</h1>

        <p className="text-muted-foreground">
          Monitor orders, payments, and outstanding balances.
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>

            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSales)}
            </div>

            <p className="text-xs text-muted-foreground">
              Across {sales.length} order
              {sales.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Amount Collected
            </CardTitle>

            <WalletCards className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalCollected)}
            </div>

            <p className="text-xs text-muted-foreground">
              Actual payments recorded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Outstanding Balance
            </CardTitle>

            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalOutstanding)}
            </div>

            <p className="text-xs text-muted-foreground">
              Remaining amount to collect
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>

            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{paidOrders}</div>

            <p className="text-xs text-muted-foreground">Fully paid orders</p>
          </CardContent>
        </Card>
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
            console.error(
              "Failed to refresh payment submissions:",
              error
            )
          }
        }}
      />

      {/* SEARCH */}

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search order or customer..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* SALES TABLE */}

      <Card>
        <CardHeader>
          <CardTitle>Sales Records</CardTitle>
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
                  {filteredSales.map((sale) => (
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
            const data = await getSalesRecords()
            setSales(data)
          } catch (error) {
            console.error("Failed to refresh sales after payment:", error)
          }
        }}
      />
    </div>
  )
}
