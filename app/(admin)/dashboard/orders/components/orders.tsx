"use client"

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

import { Search } from "lucide-react"
import { formatCustomerName } from "../utils/format-customer-name"

export default function OrdersModule() {
  const { orders, loading, error, approve, deny, changeStatus, startProduction } = useOrders()

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
  const [
  selectedQuotation,
  setSelectedQuotation,
] = useState<QuotationDetail | null>(null)

const [
  quotationDetailsOpen,
  setQuotationDetailsOpen,
] = useState(false)

const [
  quotationDetailsLoading,
  setQuotationDetailsLoading,
] = useState(false)

const [
  quotationDetailsError,
  setQuotationDetailsError,
] = useState<string | null>(null)

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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  async function handleViewQuotation(
  quotationId: string
) {
  setSelectedQuotation(null)
  setQuotationDetailsError(null)
  setQuotationDetailsLoading(true)
  setQuotationDetailsOpen(true)

  try {
    const detail =
      await getQuotationById(quotationId)

    setSelectedQuotation(detail)
  } catch (error) {
    console.error(
      "Failed to load quotation:",
      error
    )

    setQuotationDetailsError(
      error instanceof Error
        ? error.message
        : "Failed to load quotation."
    )
  } finally {
    setQuotationDetailsLoading(false)
  }
}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage customer orders, quotations, production, and delivery.
        </p>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>

          <TabsTrigger value="custom-requests">Custom Requests</TabsTrigger>

          <TabsTrigger value="quotations">Quotations</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <h2 className="text-3xl font-bold">{totalOrders}</h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Pending</p>
                <h2 className="text-3xl font-bold text-yellow-600">
                  {pendingOrders}
                </h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Approved</p>
                <h2 className="text-3xl font-bold text-green-600">
                  {approvedOrders}
                </h2>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">In Production</p>
                <h2 className="text-3xl font-bold text-blue-600">
                  {productionOrders}
                </h2>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search order number or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-56">
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
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
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

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold">
                      ₱
                      {order.total_amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
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

        <TabsContent value="custom-requests" className="space-y-6">
          {customRequestsLoading ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Loading custom requests...
                </p>
              </CardContent>
            </Card>
          ) : customRequestsError ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-sm text-red-500">{customRequestsError}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Total Requests
                    </p>

                    <h2 className="text-3xl font-bold">
                      {totalCustomRequests}
                    </h2>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Pending Review
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-600">
                      {pendingCustomRequests}
                    </h2>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Quoted</p>

                    <h2 className="text-3xl font-bold text-blue-600">
                      {quotedCustomRequests}
                    </h2>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Accepted</p>

                    <h2 className="text-3xl font-bold text-green-600">
                      {approvedCustomRequests}
                    </h2>
                  </CardContent>
                </Card>
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
                  customRequests.map((request) => (
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
            <div className="rounded-lg border p-6 text-sm text-muted-foreground">
              Loading quotations...
            </div>
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
              {quotations.map((quotation) => (
                <QuotationCard
  key={quotation.id}
  quotation={quotation}
  onView={() =>
    void handleViewQuotation(
      quotation.id
    )
  }
/>
              ))}
            </div>
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
