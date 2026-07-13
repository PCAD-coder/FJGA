"use client"

import { useMemo, useState } from "react"

import { CustomOrder } from "./types/custom-order"

import CustomOrderCard from "./components/custom-order-card"
import ViewRequestDialog from "./components/view-request-dialog"
import ApproveRequestDialog from "./components/approve-request-dialog"
import DenyRequestDialog from "./components/deny-request-dialog"
import CustomOrdersPagination from "./components/custom-orders-pagination"
import GenerateQuoteDialog from "./components/generate-quote-dialog"

import { Input } from "@/components/ui/input"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { Search } from "lucide-react"

const initialOrders: CustomOrder[] = [
  {
    id: 1,
    projectName:
      "Custom Glass Partition",
    clientName: "Maria Santos",
    image:
      "/products/partition.jpg",
    width: 12,
    height: 8,
    notes:
      "Office partition with frosted glass and modern aluminum frame.",
    status: "pending",
    submittedAt: "Apr 14, 2026",
  },
  {
    id: 2,
    projectName:
      "Sliding Window Design",
    clientName: "Juan Cruz",
    image:
      "/products/window.jpg",
    width: 8,
    height: 5,
    notes:
      "Black aluminum frame with tinted glass.",
    status: "quoted",
    quotation: {
      materials: [
        {
          id: 1,
          material:
            "Aluminum Frame",
          quantity: 1,
          unitPrice: 8000,
        },
        {
          id: 2,
          material:
            "Tempered Glass",
          quantity: 2,
          unitPrice: 4000,
        },
      ],
      laborCost: 5000,
      deliveryFee: 1500,
      totalCost: 22500,
    },
    submittedAt:
      "Apr 12, 2026",
  },
  {
    id: 3,
    projectName:
      "Storefront Glass Door",
    clientName: "Ana Reyes",
    image:
      "/products/door.jpg",
    width: 4,
    height: 8,
    notes:
      "Double swing tempered glass door.",
    status: "denied",
    denialReason:
      "Requested dimensions exceed available materials.",
    submittedAt: "Apr 10, 2026",
  },
]

export default function CustomOrdersPage() {
  const [orders, setOrders] =
    useState(initialOrders)

  const [search, setSearch] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState("all")

  const [selectedOrder, setSelectedOrder] =
    useState<CustomOrder | null>(
      null
    )

  const [viewOpen, setViewOpen] =
    useState(false)

  const [approveOpen, setApproveOpen] =
    useState(false)

  const [denyOpen, setDenyOpen] =
    useState(false)
  
  const [quoteOpen, setQuoteOpen] =
    useState(false)

  const [currentPage, setCurrentPage] =
    useState(1)

  const perPage = 4

  const filteredOrders = useMemo(
    () => {
      return orders.filter(
        (order) => {
          const matchesSearch =
            order.projectName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            order.clientName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )

          const matchesStatus =
            statusFilter === "all"
              ? true
              : order.status ===
                statusFilter

          return (
            matchesSearch &&
            matchesStatus
          )
        }
      )
    },
    [
      orders,
      search,
      statusFilter,
    ]
  )

  const totalPages = Math.ceil(
    filteredOrders.length /
      perPage
  )

  const paginatedOrders =
    filteredOrders.slice(
      (currentPage - 1) *
        perPage,
      currentPage * perPage
    )

  const handleApprove = () => {
    if (!selectedOrder) return

    setOrders((prev) =>
      prev.map((order) =>
        order.id ===
        selectedOrder.id
          ? {
              ...order,
              status:
                "approved",
            }
          : order
      )
    )

    /**
     * FUTURE DATABASE LOGIC
     *
     * 1. Update order status
     * 2. Create production record
     * 3. Notify client
     */

    setApproveOpen(false)
  }

  const handleDeny = (
    reason: string
  ) => {
    if (!selectedOrder) return

    setOrders((prev) =>
      prev.map((order) =>
        order.id ===
        selectedOrder.id
          ? {
              ...order,
              status: "denied",
              denialReason:
                reason,
            }
          : order
      )
    )

    setDenyOpen(false)
  }
  const handleGenerateQuote = (
  quotation: {
    materials: {
      id: number
      material: string
      quantity: number
      unitPrice: number
    }[]
    laborCost: number
    deliveryFee: number
    totalCost: number
  }
) => {
  if (!selectedOrder) return

  setOrders((prev) =>
    prev.map((order) =>
      order.id === selectedOrder.id
        ? {
            ...order,
            status: "quoted",
            quotation,
          }
        : order
    )
  )

  setQuoteOpen(false)
}

  const totalRequests =
    orders.length

  const pendingRequests =
    orders.filter(
      (o) =>
        o.status === "pending"
    ).length

  const quotedRequests =
    orders.filter(
      (o) =>
        o.status === "quoted"
    ).length

  const approvedRequests =
    orders.filter(
      (o) =>
        o.status === "approved"
    ).length

  const deniedRequests =
    orders.filter(
      (o) =>
        o.status === "denied"
    ).length

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Custom Order Requests
        </h1>

        <p className="text-muted-foreground">
          Review and manage
          client-submitted custom
          projects.
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Total Requests
            </p>
            <h2 className="text-3xl font-bold">
              {totalRequests}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Pending Review
            </p>
            <h2 className="text-3xl font-bold text-yellow-600">
              {pendingRequests}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Quoted
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              {quotedRequests}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Approved
            </p>
            <h2 className="text-3xl font-bold text-green-600">
              {approvedRequests}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Denied
            </p>
            <h2 className="text-3xl font-bold text-red-600">
              {deniedRequests}
            </h2>
          </CardContent>
        </Card>

      </div>

      {/* FILTERS */}

      <div className="space-y-4">

        <ToggleGroup
          type="single"
          value={statusFilter}
          onValueChange={(
            value
          ) => {
            if (value)
              setStatusFilter(
                value
              )
          }}
        >
          <ToggleGroupItem value="all">
            All
          </ToggleGroupItem>

          <ToggleGroupItem value="pending">
            Pending
          </ToggleGroupItem>

          <ToggleGroupItem value="quoted">
            Quoted
          </ToggleGroupItem>

          <ToggleGroupItem value="approved">
            Approved
          </ToggleGroupItem>

          <ToggleGroupItem value="denied">
            Denied
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="relative max-w-md">

          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder="Search by client or project..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* CARDS */}

      <div className="space-y-6">

        {paginatedOrders.map(
          (order) => (
            <CustomOrderCard
              key={order.id}
              order={order}
              onView={() => {
                setSelectedOrder(order)
                setViewOpen(true)
              }}
              onGeneratedQuote={() => {
                setSelectedOrder(order)
                setQuoteOpen(true)
              }}
              onApprove={() => {
                setSelectedOrder(order)
                setApproveOpen(true)
              }}
              onDeny={() => {
                setSelectedOrder(order)
                setDenyOpen(true)
              }}
            />
          )
        )}

      </div>

      {/* PAGINATION */}

      <CustomOrdersPagination
        currentPage={
          currentPage
        }
        totalPages={
          totalPages || 1
        }
        onPageChange={
          setCurrentPage
        }
      />

      {/* DIALOGS */}

      <ViewRequestDialog
        order={selectedOrder}
        open={viewOpen}
        onOpenChange={
          setViewOpen
        }
      />
      <GenerateQuoteDialog
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        onSave={handleGenerateQuote}
      />
      <ApproveRequestDialog
        open={approveOpen}
        onOpenChange={
          setApproveOpen
        }
        onConfirm={
          handleApprove
        }
        projectName={
          selectedOrder?.projectName
        }
      />

      <DenyRequestDialog
        open={denyOpen}
        onOpenChange={
          setDenyOpen
        }
        onConfirm={
          handleDeny
        }
        projectName={
          selectedOrder?.projectName
        }
      />

    </div>
  )
}