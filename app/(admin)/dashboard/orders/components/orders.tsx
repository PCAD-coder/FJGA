"use client"

import { DashboardCard } from "@/components/dashboard_cards"
import OrdersSkeleton, { OrdersListSkeleton } from "./orders-skeleton"
import OrdersPagination from "./toolbar/orders-pagination"
import { toast } from "sonner"

import { useMemo, useState } from "react"
import { useOrders } from "../hooks/use-orders"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import CustomOrderCard from "./cards/custom-order-card"
import ViewRequestDialog from "./dialogs/view-request-dialog"
import { useQuotations } from "../hooks/use-quotations"

import type { CustomOrder } from "../types/custom-order"

import { useCustomOrderRequests } from "../hooks/use-custom-order-requests"
import ViewOrderDialog from "./dialogs/view-order-dialog"
import CreateQuotationDialog from "./dialogs/create-quotation-dialog"
import QuotationCard from "./quotations/quotation-card"
import { getQuotationById } from "../services/quotations"
import type { QuotationDetail } from "../types/quotation"
import QuotationDetailsDialog from "./quotations/quotation-details-dialog"
import type { Order } from "../types/order"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Search,
  ClipboardList,
  Clock3,
  CircleCheck,
  Factory,
  FileText,
} from "lucide-react"
import { formatCustomerName } from "../utils/format-customer-name"

const PAGE_SIZE = 10

export default function OrdersModule() {
  const [ordersPage, setOrdersPage] = useState(1)
  const [requestsPage, setRequestsPage] = useState(1)
  const [quotationsPage, setQuotationsPage] = useState(1)
  const {
    orders,
    loading,
    error,
    approve,
    deny,
    changeStatus,
    startProduction,
  } = useOrders()

  const {
    requests: customRequests,
    loading: customRequestsLoading,
    error: customRequestsError,
    refresh: refreshCustomRequests,
  } = useCustomOrderRequests()

  const {
    quotations,
    loading: quotationsLoading,
    error: quotationsError,
    refresh: refreshQuotations,
  } = useQuotations()

  const [selectedCustomRequest, setSelectedCustomRequest] =
    useState<CustomOrder | null>(null)

  const [customRequestViewOpen, setCustomRequestViewOpen] = useState(false)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [viewOpen, setViewOpen] = useState(false)

  const [activeTab, setActiveTab] = useState("orders")

  const [quotationRequest, setQuotationRequest] = useState<CustomOrder | null>(
    null
  )

  const [quotationOpen, setQuotationOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] =
    useState<QuotationDetail | null>(null)

  const [quotationDetailsOpen, setQuotationDetailsOpen] = useState(false)

  const [quotationDetailsLoading, setQuotationDetailsLoading] = useState(false)

  const [quotationDetailsError, setQuotationDetailsError] = useState<
    string | null
  >(null)

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(search.toLowerCase()) ||
        order.customer_id.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ? true : order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, search, statusFilter])

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending").length
  const approvedOrders = orders.filter((o) => o.status === "approved").length
  const productionOrders = orders.filter(
    (o) => o.status === "in_production"
  ).length

  const totalCustomRequests = customRequests.length

  const pendingCustomRequests = customRequests.filter(
    (request) => request.status === "pending"
  ).length

  const quotedCustomRequests = customRequests.filter(
    (request) => request.status === "quoted"
  ).length

  const approvedCustomRequests = customRequests.filter(
    (request) => request.status === "approved"
  ).length

  const orderPage = Math.min(
    ordersPage,
    Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  )
  const requestPage = Math.min(
    requestsPage,
    Math.max(1, Math.ceil(customRequests.length / PAGE_SIZE))
  )
  const quotationPage = Math.min(
    quotationsPage,
    Math.max(1, Math.ceil(quotations.length / PAGE_SIZE))
  )
  const visibleOrders = filteredOrders.slice(
    (orderPage - 1) * PAGE_SIZE,
    orderPage * PAGE_SIZE
  )
  const visibleRequests = customRequests.slice(
    (requestPage - 1) * PAGE_SIZE,
    requestPage * PAGE_SIZE
  )
  const visibleQuotations = quotations.slice(
    (quotationPage - 1) * PAGE_SIZE,
    quotationPage * PAGE_SIZE
  )

  if (loading) {
    return <OrdersSkeleton />
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  async function handleViewQuotation(quotationId: string) {
    setSelectedQuotation(null)
    setQuotationDetailsError(null)
    setQuotationDetailsLoading(true)
    setQuotationDetailsOpen(true)

    try {
      const detail = await getQuotationById(quotationId)

      setSelectedQuotation(detail)
    } catch (error) {
      console.error("Failed to load quotation:", error)

      toast.error(
        error instanceof Error ? error.message : "Unable to load quotation."
      )
      setQuotationDetailsError(
        error instanceof Error ? error.message : "Failed to load quotation."
      )
    } finally {
      setQuotationDetailsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <div className="border-b border-border/70 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Orders
        </h1>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Manage customer orders, quotations, production, and delivery.
        </p>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="h-auto max-w-full flex-wrap justify-start gap-1 rounded-lg border bg-card p-1">
          <TabsTrigger value="orders">Orders</TabsTrigger>

          <TabsTrigger value="custom-requests">Custom Requests</TabsTrigger>

          <TabsTrigger value="quotations">Quotations</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
            <DashboardCard
              title="Total Orders"
              value={String(totalOrders)}
              description="All customer orders"
              icon={ClipboardList}
              color="text-blue-600 dark:text-blue-400"
            />
            <DashboardCard
              title="Pending"
              value={String(pendingOrders)}
              description="Orders awaiting review"
              icon={Clock3}
              color="text-amber-600 dark:text-amber-400"
            />
            <DashboardCard
              title="Approved"
              value={String(approvedOrders)}
              description="Orders approved by the team"
              icon={CircleCheck}
              color="text-emerald-600 dark:text-emerald-400"
            />
            <DashboardCard
              title="In Production"
              value={String(productionOrders)}
              description="Orders being manufactured"
              icon={Factory}
              color="text-primary"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card p-4">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search orders"
                className="h-9 rounded-lg bg-background/50 pl-9"
                placeholder="Search order number or customer..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setOrdersPage(1)
                }}
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value)
                setOrdersPage(1)
              }}
            >
              <SelectTrigger
                aria-label="Filter order status"
                className="h-9 w-full rounded-lg bg-background/50 md:w-56"
              >
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in_production">In Production</SelectItem>
                <SelectItem value="ready_for_delivery">
                  Ready for Delivery
                </SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4">
            {visibleOrders.map((order) => (
              <Card
                key={order.id}
                className="gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0"
              >
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">
                      {order.order_number}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Customer: {formatCustomerName(order.profiles)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Type: {order.order_type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Status: {order.status}
                    </p>
                  </div>

                  <div className="sm:ml-auto sm:text-right">
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-xl font-semibold tracking-tight tabular-nums">
                      &#8369;
                      {order.total_amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 [&>button]:h-9 [&>button]:rounded-lg [&>button]:text-xs">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedOrder(order)
                        setViewOpen(true)
                      }}
                    >
                      View
                    </Button>

                    {(order.status === "pending" ||
                      order.status === "quoted") && (
                      <>
                        <Button
                          onClick={() => approve(order.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => deny(order.id, "Denied by admin")}
                        >
                          Deny
                        </Button>
                      </>
                    )}
                    {/*}
                {order.status === "in_production" && (
                  <Button
                    onClick={() => changeStatus(order.id, "ready_for_delivery")}
                  >
                    Ready for Delivery
                  </Button>
                )}

                {order.status === "ready_for_delivery" && (
                  <Button onClick={() => changeStatus(order.id, "delivered")}>
                    Mark Delivered
                  </Button>
                )}*/}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <OrdersPagination
            label="Orders"
            total={filteredOrders.length}
            page={orderPage}
            onPageChange={setOrdersPage}
          />
          <ViewOrderDialog
            order={selectedOrder}
            open={viewOpen}
            onOpenChange={setViewOpen}
            onApprove={async (id) => {
              await approve(id)
              setViewOpen(false)
            }}
            onDeny={async (id) => {
              await deny(id, "Denied by admin")
              setViewOpen(false)
            }}
            onChangeStatus={async (id, status, options) => {
              await changeStatus(id, status, options)
              setViewOpen(false)
            }}
            onStartProduction={startProduction}
          />
        </TabsContent>

        <TabsContent value="custom-requests" className="space-y-4">
          {customRequestsLoading ? (
            <OrdersListSkeleton />
          ) : customRequestsError ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-sm text-red-500">{customRequestsError}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
                <DashboardCard
                  title="Total Requests"
                  value={String(totalCustomRequests)}
                  description="All custom design requests"
                  icon={ClipboardList}
                  color="text-blue-600 dark:text-blue-400"
                />
                <DashboardCard
                  title="Pending Review"
                  value={String(pendingCustomRequests)}
                  description="Requests awaiting assessment"
                  icon={Clock3}
                  color="text-amber-600 dark:text-amber-400"
                />
                <DashboardCard
                  title="Quoted"
                  value={String(quotedCustomRequests)}
                  description="Requests with a quotation"
                  icon={FileText}
                  color="text-primary"
                />
                <DashboardCard
                  title="Accepted"
                  value={String(approvedCustomRequests)}
                  description="Requests accepted by customers"
                  icon={CircleCheck}
                  color="text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div className="space-y-4">
                {customRequests.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-sm text-muted-foreground">
                        No custom requests found.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  visibleRequests.map((request) => (
                    <CustomOrderCard
                      key={request.id}
                      order={request}
                      onView={() => {
                        setSelectedCustomRequest(request)
                        setCustomRequestViewOpen(true)
                      }}
                    />
                  ))
                )}
              </div>
            </>
          )}
          {!customRequestsLoading && !customRequestsError && (
            <OrdersPagination
              label="Custom requests"
              total={customRequests.length}
              page={requestPage}
              onPageChange={setRequestsPage}
            />
          )}
          <ViewRequestDialog
            order={selectedCustomRequest}
            open={customRequestViewOpen}
            onOpenChange={(open) => {
              setCustomRequestViewOpen(open)

              if (!open) {
                setSelectedCustomRequest(null)
              }
            }}
            onCreateQuotation={() => {
              if (!selectedCustomRequest) return

              setQuotationRequest(selectedCustomRequest)
              setCustomRequestViewOpen(false)
              setQuotationOpen(true)
            }}
          />
          <CreateQuotationDialog
            order={quotationRequest}
            open={quotationOpen}
            onOpenChange={(open) => {
              setQuotationOpen(open)

              if (!open) {
                setQuotationRequest(null)
              }
            }}
            onSent={async () => {
              await refreshCustomRequests()
            }}
          />
        </TabsContent>

        <TabsContent value="quotations" className="space-y-4">
          {quotationsLoading ? (
            <OrdersListSkeleton />
          ) : quotationsError ? (
            <div className="rounded-lg border border-destructive/50 p-6 text-sm text-destructive">
              {quotationsError}
            </div>
          ) : quotations.length === 0 ? (
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">
              No quotations found.
            </div>
          ) : (
            <div className="space-y-4">
              {visibleQuotations.map((quotation) => (
                <QuotationCard
                  key={quotation.id}
                  quotation={quotation}
                  onView={() => void handleViewQuotation(quotation.id)}
                />
              ))}
            </div>
          )}
          {!quotationsLoading && !quotationsError && (
            <OrdersPagination
              label="Quotations"
              total={quotations.length}
              page={quotationPage}
              onPageChange={setQuotationsPage}
            />
          )}
          <QuotationDetailsDialog
            open={quotationDetailsOpen}
            onOpenChange={(open) => {
              setQuotationDetailsOpen(open)

              if (!open) {
                setSelectedQuotation(null)
                setQuotationDetailsError(null)
              }
            }}
            quotation={selectedQuotation}
            loading={quotationDetailsLoading}
            error={quotationDetailsError}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
