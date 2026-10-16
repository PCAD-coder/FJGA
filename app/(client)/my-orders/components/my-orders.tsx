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
import OrderToolbar, { type OrderSort } from "./order-toolbar"
import OrderCard from "./order-card"
import EmptyOrders from "./empty-orders"

import type { Order } from "../types/order"
import { getMyOrders } from "../services/my-orders-service"

export default function MyOrders() {
  const [tab, setTab] = useState("All")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<OrderSort>("newest")
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

  const completedOrders = orders.filter((order) => order.status === "Completed")

  const filteredOrders = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    const filtered = orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchText) ||
        order.productName.toLowerCase().includes(searchText)

      const matchesTab =
        tab === "All" ||
        (tab === "Active" && activeStatuses.includes(order.status)) ||
        (tab === "Approved" && order.status === "Approved") ||
        (tab === "Completed" && order.status === "Completed") ||
        (tab === "Declined" && order.status === "Declined") ||
        (tab === "Cancelled" && order.status === "Cancelled")

      return matchesSearch && matchesTab
    })

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )

        case "highest":
          return b.total - a.total

        case "lowest":
          return a.total - b.total

        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
      }
    })
  }, [orders, search, tab, sort])

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true)
        setError(null)

        const data = await getMyOrders()

        setOrders(data)
      } catch (error) {
        console.error("Failed to load orders:", error)

        if (error && typeof error === "object") {
          console.error("Error details:", JSON.stringify(error, null, 2))
        }

        setError(
          error instanceof Error ? error.message : "Failed to load orders"
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
        <p className="text-muted-foreground">Loading your orders...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">Unable to load orders</h2>

        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>

        <p className="text-muted-foreground">
          Manage and monitor all of your furniture orders.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
  <OrderSummaryCard
    title="Total Orders"
    value={orders.length}
    description="All of your orders"
    icon={ClipboardList}
  />

  <OrderSummaryCard
    title="Active Orders"
    value={activeOrders.length}
    description="Currently in progress"
    icon={Package}
  />

  <OrderSummaryCard
    title="Completed"
    value={completedOrders.length}
    description="Successfully delivered"
    icon={CheckCircle2}
  />

  <OrderSummaryCard
    title="Total Order Value"
    value={`₱${orders
      .reduce((sum, order) => sum + order.total, 0)
      .toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`}
    description="Combined value of all orders"
    icon={PhilippinePeso}
  />
</div>

      <OrderFilterTabs
        activeTab={tab}
        onChange={setTab}
        counts={{
          All: orders.length,

          Active: activeOrders.length,

          Completed: completedOrders.length,

          Approved: orders.filter((order) => order.status === "Approved")
            .length,

          Declined: orders.filter((order) => order.status === "Declined")
            .length,

          Cancelled: orders.filter((order) => order.status === "Cancelled")
            .length,
        }}
      />

      <OrderToolbar
        search={search}
        onSearch={setSearch}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="space-y-5">
        {filteredOrders.length === 0 ? (
          <EmptyOrders />
        ) : (
          filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  )
}
