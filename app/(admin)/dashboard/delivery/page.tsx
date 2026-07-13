"use client"

import {
  useMemo,
  useState,
  useEffect,
} from "react"

import {
  Delivery,
  DeliveryStatus,
} from "./types/delivery"

import DeliveryCard from "./components/delivery-card"
import DeliveryDetailsDialog from "./components/delivery-details-dialog"
import UpdateDeliveryStatusDialog from "./components/update-delivery-status-dialog"
import DeliveryPagination from "./components/delivery-pagination"

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

const initialDeliveries: Delivery[] = [
  {
    id: 1,
    projectName:
      "Custom Glass Partition",
    clientName:
      "Maria Santos",
    address:
      "Quezon City",
    deliveryDate:
      "May 15, 2026",
    deliveryTime:
      "9:00 AM",
    assignedTruck:
      "Truck 01",
    assignedDriver:
      "Juan Dela Cruz",
    productName:
      "Glass Partition",
    deliveryFee: 1500,
    status: "ready",
  },

  {
    id: 2,
    projectName:
      "Sliding Window",
    clientName:
      "Pedro Cruz",
    address:
      "Makati City",
    deliveryDate:
      "May 17, 2026",
    deliveryTime:
      "1:00 PM",
    assignedTruck:
      "Truck 02",
    assignedDriver:
      "Mark Reyes",
    productName:
      "Window",
    deliveryFee: 1200,
    status: "scheduled",
  },

  {
    id: 3,
    projectName:
      "Storefront Door",
    clientName:
      "Anna Reyes",
    address:
      "Pasig City",
    deliveryDate:
      "May 20, 2026",
    deliveryTime:
      "10:00 AM",
    assignedTruck:
      "Truck 03",
    assignedDriver:
      "Carlos Santos",
    productName:
      "Door",
    deliveryFee: 1800,
    status:
      "out-for-delivery",
  },

  {
    id: 4,
    projectName:
      "Office Partition",
    clientName:
      "Michael Tan",
    address:
      "Taguig City",
    deliveryDate:
      "May 10, 2026",
    deliveryTime:
      "2:00 PM",
    assignedTruck:
      "Truck 01",
    assignedDriver:
      "Juan Dela Cruz",
    productName:
      "Partition",
    deliveryFee: 2000,
    status: "delivered",
  },
]

export default function DeliveryPage() {
  const [deliveries, setDeliveries] =
    useState(initialDeliveries)

  const [search, setSearch] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState("all")

  const [selectedDelivery, setSelectedDelivery] =
    useState<Delivery | null>(
      null
    )

  const [viewOpen, setViewOpen] =
    useState(false)

  const [updateOpen, setUpdateOpen] =
    useState(false)

  const [currentPage, setCurrentPage] =
    useState(1)

  const deliveriesPerPage = 4

  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  const filteredDeliveries =
    useMemo(() => {
      return deliveries.filter(
        (delivery) => {
          const matchesSearch =
            delivery.projectName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            delivery.clientName
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )

          const matchesStatus =
            statusFilter === "all"
              ? true
              : delivery.status ===
                statusFilter

          return (
            matchesSearch &&
            matchesStatus
          )
        }
      )
    }, [
      deliveries,
      search,
      statusFilter,
    ])

  const totalPages =
    Math.ceil(
      filteredDeliveries.length /
        deliveriesPerPage
    ) || 1

  const paginatedDeliveries =
    filteredDeliveries.slice(
      (currentPage - 1) *
        deliveriesPerPage,
      currentPage *
        deliveriesPerPage
    )

  const handleUpdateStatus = (
    status: DeliveryStatus
  ) => {
    if (!selectedDelivery)
      return

    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id ===
        selectedDelivery.id
          ? {
              ...delivery,
              status,
            }
          : delivery
      )
    )

    /**
     * FUTURE DATABASE LOGIC
     *
     * Update delivery status
     *
     * If delivered:
     * Update sales/payment records
     */

    setUpdateOpen(false)
  }

  const totalDeliveries =
    deliveries.length

  const readyCount =
    deliveries.filter(
      (d) =>
        d.status === "ready"
    ).length

  const outForDeliveryCount =
    deliveries.filter(
      (d) =>
        d.status ===
        "out-for-delivery"
    ).length

  const deliveredCount =
    deliveries.filter(
      (d) =>
        d.status ===
        "delivered"
    ).length

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Delivery Management
        </h1>

        <p className="text-muted-foreground">
          Manage and monitor
          delivery schedules.
        </p>
      </div>

      {/* KPI */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Total Deliveries
            </p>

            <h2 className="text-3xl font-bold">
              {totalDeliveries}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Ready
            </p>

            <h2 className="text-3xl font-bold text-yellow-600">
              {readyCount}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Out For Delivery
            </p>

            <h2 className="text-3xl font-bold text-orange-600">
              {outForDeliveryCount}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Delivered
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              {deliveredCount}
            </h2>
          </CardContent>
        </Card>

      </div>

      {/* FILTERS */}

      <div className="space-y-4">

        <ToggleGroup
          type="single"
          value={statusFilter}
          onValueChange={(value) => {
            if (value)
              setStatusFilter(value)
          }}
          className="justify-start flex-wrap"
        >
          <ToggleGroupItem value="all">
            All
          </ToggleGroupItem>

          <ToggleGroupItem value="ready">
            Ready
          </ToggleGroupItem>

          <ToggleGroupItem value="scheduled">
            Scheduled
          </ToggleGroupItem>

          <ToggleGroupItem value="out-for-delivery">
            Out For Delivery
          </ToggleGroupItem>

          <ToggleGroupItem value="delivered">
            Delivered
          </ToggleGroupItem>

          <ToggleGroupItem value="cancelled">
            Cancelled
          </ToggleGroupItem>

        </ToggleGroup>

        <div className="relative max-w-md">

          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search project or client..."
            className="pl-9"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* DELIVERY CARDS */}

      <div className="space-y-6">

        {paginatedDeliveries.map(
          (delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onView={() => {
                setSelectedDelivery(
                  delivery
                )

                setViewOpen(true)
              }}
              onUpdateStatus={() => {
                setSelectedDelivery(
                  delivery
                )

                setUpdateOpen(true)
              }}
            />
          )
        )}

      </div>

      {/* EMPTY */}

      {filteredDeliveries.length ===
        0 && (
        <Card>
          <CardContent className="py-12 text-center">

            <h3 className="text-lg font-semibold">
              No Deliveries Found
            </h3>

            <p className="text-muted-foreground">
              Try adjusting your
              filters.
            </p>

          </CardContent>
        </Card>
      )}

      {/* PAGINATION */}

      {filteredDeliveries.length >
        deliveriesPerPage && (
        <DeliveryPagination
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          onPageChange={
            setCurrentPage
          }
        />
      )}

      {/* DIALOGS */}

      <DeliveryDetailsDialog
        delivery={
          selectedDelivery
        }
        open={viewOpen}
        onOpenChange={
          setViewOpen
        }
      />

      <UpdateDeliveryStatusDialog
        delivery={
          selectedDelivery
        }
        open={updateOpen}
        onOpenChange={
          setUpdateOpen
        }
        onSave={
          handleUpdateStatus
        }
      />

    </div>
  )
}