"use client"

import { useMemo, useState } from "react"
import {
  BadgeCheck,
  ClipboardList,
  CreditCard,
  RefreshCw,
  Search,
  WalletCards,
} from "lucide-react"
import { DashboardCard } from "@/components/dashboard_cards"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useOnSiteSales } from "../hooks/use-on-site-sales"
import type { OnSitePaymentFilter } from "../types/on-site-sales"
import {
  filterOnSiteTransactions,
  formatOnSiteCurrency,
  formatOnSiteDate,
  formatOnSitePaymentMethod,
  summarizeOnSiteTransactions,
} from "../utils/on-site-sales"
import { OnSitePaymentBadge } from "./on-site-payment-badge"
import { OnSiteSaleDetailsDialog } from "./on-site-sale-details-dialog"

const PAGE_SIZE = 10

export default function OnSiteServices() {
  const { records, loading, error, refresh } = useOnSiteSales()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<OnSitePaymentFilter>("all")
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const summary = useMemo(() => summarizeOnSiteTransactions(records), [records])
  const filtered = useMemo(
    () => filterOnSiteTransactions(records, search, status),
    [records, search, status]
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const transactions = filtered.slice(start, start + PAGE_SIZE)
  const selected = records.find((record) => record.id === selectedId) ?? null

  if (loading)
    return (
      <div
        role="status"
        aria-label="Loading on-site service transactions"
        className="space-y-4"
      >
        <span className="sr-only">Loading on-site service transactions...</span>
        <div
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
          aria-hidden="true"
        >
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-28 rounded-xl" />
          ))}
        </div>
        <DataTableSkeleton rows={10} columns={5} />
      </div>
    )

  if (error)
    return (
      <Card>
        <CardContent className="space-y-3 pt-6">
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
          <Button variant="outline" onClick={refresh}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total Collected"
          value={formatOnSiteCurrency(summary.totalCollected)}
          description="Confirmed paid service transactions only"
          icon={WalletCards}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <DashboardCard
          title="Unpaid Service Fees"
          value={formatOnSiteCurrency(summary.unpaidServiceFees)}
          description="Unconfirmed charges; excluded from collected revenue"
          icon={CreditCard}
          color="text-amber-600 dark:text-amber-400"
        />
        <DashboardCard
          title="Paid Transactions"
          value={String(summary.paidTransactions)}
          description="Visits with confirmed payments"
          icon={BadgeCheck}
          color="text-primary"
        />
        <DashboardCard
          title="Total On-Site Visits"
          value={String(summary.totalVisits)}
          description="All on-site visit records"
          icon={ClipboardList}
          color="text-blue-600 dark:text-blue-400"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative w-full md:max-w-md">
              <Search
                aria-hidden="true"
                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                aria-label="Search on-site visits by visit number or customer name"
                placeholder="Search visit number or customer..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                if (value === "all" || value === "paid" || value === "unpaid") {
                  setStatus(value)
                  setPage(1)
                }
              }}
            >
              <SelectTrigger
                className="w-full md:w-[200px]"
                aria-label="On-site payment status"
              >
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={refresh} className="md:ml-auto">
              <RefreshCw className="mr-2 size-4" aria-hidden="true" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>On-Site Service Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} of {records.length} records. Summary cards
            include all visits, regardless of filters.
          </p>
          <p className="text-xs text-muted-foreground">
            Newest payment first; visits without a payment date use the request
            date. All times are Philippine time (Asia/Manila).
          </p>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {records.length === 0
                ? "No on-site service transactions yet."
                : "No transactions match the selected filters."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      "Visit Number",
                      "Customer Name",
                      "Service Name",
                      "Service Fee",
                      "Travel Fee",
                      "Total Amount",
                      "Payment Status",
                      "Payment Date",
                      "Payment Method",
                      "Received By",
                      "Actions",
                    ].map((label) => (
                      <TableHead key={label} className="whitespace-nowrap">
                        {label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {record.visitNumber || "—"}
                      </TableCell>
                      <TableCell className="min-w-40">
                        {record.customerName}
                      </TableCell>
                      <TableCell className="min-w-40">
                        {record.serviceName || "—"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap tabular-nums">
                        {formatOnSiteCurrency(record.serviceFee)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap tabular-nums">
                        {formatOnSiteCurrency(record.travelFee)}
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap tabular-nums">
                        {formatOnSiteCurrency(record.totalFee)}
                      </TableCell>
                      <TableCell>
                        <OnSitePaymentBadge status={record.paymentStatus} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatOnSiteDate(record.paidAt)}
                      </TableCell>
                      <TableCell>
                        {formatOnSitePaymentMethod(record.paymentMethod)}
                      </TableCell>
                      <TableCell className="min-w-32">
                        {record.paymentReceivedBy || "—"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          aria-label={`View details for ${record.visitNumber || "on-site visit"}`}
                          onClick={() => setSelectedId(record.id)}
                        >
                          View Details
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

      {filtered.length > 0 && (
        <nav
          aria-label="On-site transactions pagination"
          className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {start + 1} to{" "}
            {Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
            records
          </p>
          <div className="flex items-center gap-3">
            <Button
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
      <OnSiteSaleDetailsDialog
        transaction={selected}
        onClose={() => setSelectedId(null)}
      />
    </div>
  )
}
