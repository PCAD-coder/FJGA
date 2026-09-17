"use client"

import { useEffect, useMemo, useState } from "react"

import {
  ClipboardList,
  Package,
  CheckCircle2,
  PhilippinePeso,
} from "lucide-react"

import OrderSummaryCard from "./order-summary-card"
import OrderFilterTabs from "./order-filter-tabs"
import OrderToolbar from "./order-toolbar"
import OrderCard from "./order-card"
import EmptyOrders from "./empty-orders"

import type { Order } from "../types/order"
import { getMyOrders } from "../services/my-orders-service"

export default function MyOrders() {
  const [tab, setTab] = useState("All")
  const [search, setSearch] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const activeStatuses = [
  "Pending",
  "Quoted",
  "Approved",
  "Production",
  "Ready for Delivery",
]

  const activeOrders = orders.filter((order) =>
  activeStatuses.includes(order.status)
)

const completedOrders = orders.filter(
  (order) => order.status === "Completed"
)

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchText = search.toLowerCase()

      const matchesSearch =
  order.orderNumber.toLowerCase().includes(searchText) ||
  order.productName.toLowerCase().includes(searchText)

      const matchesTab =
  tab === "All" ||
  (tab === "Active" &&
    activeStatuses.includes(order.status)) ||
  (tab === "Approved" && order.status === "Approved") ||
  (tab === "Completed" && order.status === "Completed") ||
  (tab === "Declined" && order.status === "Declined") ||
  (tab === "Cancelled" && order.status === "Cancelled")

      return matchesSearch && matchesTab
    })
  }, [orders, search, tab])

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true)
        setError(null)

        const data = await getMyOrders()

        setOrders(data)
      }  catch (error) {
  console.error("Failed to load orders:", error)

  if (error && typeof error === "object") {
    console.error(
      "Error details:",
      JSON.stringify(error, null, 2)
    )
  }

  setError(
    error instanceof Error
      ? error.message
      : "Failed to load orders"
  )
} finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-muted-foreground">
          Loading your orders...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">
          Unable to load orders
        </h2>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          My Orders
        </h1>

        <p className="text-muted-foreground">
          Manage and monitor all of your furniture orders.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <OrderSummaryCard
          title="Total Orders"
          value={orders.length}
          icon={ClipboardList}
          color="bg-blue-100"
        />

        <OrderSummaryCard
          title="Active"
          value={activeOrders.length}
          icon={Package}
          color="bg-yellow-100"
        />

        <OrderSummaryCard
          title="Completed"
          value={completedOrders.length}
          icon={CheckCircle2}
          color="bg-green-100"
        />

        <OrderSummaryCard
          title="Total Spent"
          value={`₱${orders
  .reduce((sum, order) => sum + order.total, 0)
  .toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`}
          icon={PhilippinePeso}
          color="bg-purple-100"
        />
      </div>

      <OrderFilterTabs
        activeTab={tab}
        onChange={setTab}
        counts={{
  All: orders.length,

  Active: activeOrders.length,

  Completed: completedOrders.length,

  Approved: orders.filter(
    (order) => order.status === "Approved"
  ).length,

  Declined: orders.filter(
    (order) => order.status === "Declined"
  ).length,

  Cancelled: orders.filter(
    (order) => order.status === "Cancelled"
  ).length,
}}
      />

      <OrderToolbar
        search={search}
        onSearch={setSearch}
      />

      <div className="space-y-5">
        {filteredOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))
        )}
      </div>
    </div>
  )
}