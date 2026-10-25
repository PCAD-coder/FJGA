"use client"

import { toast } from "sonner"

import ModuleLoading from "../loading"

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
import { Button } from "@/components/ui/button"

import type { Order } from "../types/order"
import { getMyOrders } from "../services/my-orders-service"

const PAGE_SIZE = 10

export default function MyOrders() {
  const [page, setPage] = useState(1)
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

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + PAGE_SIZE
  )

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get("orderCreated") === "1") {
      toast.success("Your order has been placed successfully.", {
        id: "catalog-order-created",
      })
      url.searchParams.delete("orderCreated")
      window.history.replaceState(
        window.history.state,
        "",
        url.pathname + url.search + url.hash
      )
    }
  }, [])

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
    return <ModuleLoading />
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
    <div className="mx-auto w-full max-w-[1440px] space-y-5 px-1 pt-4 pb-10 sm:px-4 lg:px-6">
      <div className="border-b border-border/70 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Your space, taking shape.
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Follow your orders from confirmation to delivery, all in one place.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
          value={`\u20B1${orders
            .reduce((sum, order) => sum + order.total, 0)
            .toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
          description="Combined value of all orders"
          icon={PhilippinePeso}
        />
      </div>

      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-3 sm:p-4">
        <OrderFilterTabs
          activeTab={tab}
          onChange={(value) => {
            setTab(value)
            setPage(1)
          }}
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
          onSearch={(value) => {
            setSearch(value)
            setPage(1)
          }}
          sort={sort}
          onSortChange={(value) => {
            setSort(value)
            setPage(1)
          }}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full">
            <EmptyOrders />
          </div>
        ) : (
          paginatedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
      {filteredOrders.length > 0 && (
        <nav
          aria-label="Orders pagination"
          className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + PAGE_SIZE, filteredOrders.length)} of{" "}
            {filteredOrders.length} orders
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
    </div>
  )
}
