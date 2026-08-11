"use client"

import { useMemo, useState } from "react"
import { useOrders } from "../hooks/use-orders"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import ViewOrderDialog from "./dialogs/view-order-dialog"
import type { Order } from "../types/order"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Search } from "lucide-react"

export default function OrdersModule() {
  const { orders, loading, error, approve, deny, changeStatus } = useOrders()

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [viewOpen, setViewOpen] = useState(false)

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">
          Manage customer orders, quotations, production, and delivery.
        </p>
      </div>
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
                <h3 className="text-lg font-semibold">{order.order_number}</h3>
                <p className="text-sm text-muted-foreground">
                  Customer:{" "}
                  {order.profiles
                    ? `${order.profiles.first_name} ${order.profiles.last_name}`
                    : order.customer_id}
                </p>
                <p className="text-sm text-muted-foreground">
                  Type: {order.order_type}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {order.status}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Amount</p>
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

                {(order.status === "pending" || order.status === "quoted") && (
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
                )}
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
      />
    </div>
  )
}
