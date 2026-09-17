"use client"

import { useMemo, useState, useEffect } from "react"

import type {
  Delivery,
  DeliveryDetails,
  DeliveryStatus,
} from "../types/delivery"

import DeliveryCard from "./delivery-card"
import DeliveryDetailsDialog from "./delivery-details-dialog"
import UpdateDeliveryStatusDialog from "./update-delivery-status-dialog"
import DeliveryPagination from "./delivery-pagination"

import { Input } from "@/components/ui/input"

import { Card, CardContent } from "@/components/ui/card"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Search } from "lucide-react"
import { getDeliveriesAction } from "../actions/get-deliveries"

import {
  mapOrderToDelivery,
  mapOrderToDeliveryDetails,
} from "../services/delivery-mapper"

import { getDeliveryDetailsAction } from "../actions/get-delivery-details"

import { updateDeliveryStatus } from "../services/delivery-actions"

import ScheduleDeliveryDialog from "./schedule-delivery-dialog"

import DeliveryFinalPaymentDialog from "./delivery-final-payment-dialog"

export default function DeliveryModule() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState("")

  const [statusFilter, setStatusFilter] = useState("all")

  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  )
  const [selectedDeliveryDetails, setSelectedDeliveryDetails] =
    useState<DeliveryDetails | null>(null)

  const [detailsLoading, setDetailsLoading] = useState(false)

  const [viewOpen, setViewOpen] = useState(false)

  const [updateOpen, setUpdateOpen] = useState(false)

  const [scheduleOpen, setScheduleOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const [finalPaymentOpen, setFinalPaymentOpen] = useState(false)

  const deliveriesPerPage = 4
  const loadDeliveries = async () => {
    try {
      setLoading(true)
      setError(null)

      const orders = await getDeliveriesAction()

      const mappedDeliveries = orders.map(mapOrderToDelivery)

      setDeliveries(mappedDeliveries)
    } catch (error) {
      console.error("Failed to load deliveries:", error)

      setError(
        error instanceof Error ? error.message : "Failed to load deliveries"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDeliveries()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter])

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) => {
      const matchesSearch =
        delivery.projectName.toLowerCase().includes(search.toLowerCase()) ||
        delivery.clientName.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ? true : delivery.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [deliveries, search, statusFilter])

  const totalPages =
    Math.ceil(filteredDeliveries.length / deliveriesPerPage) || 1

  const paginatedDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * deliveriesPerPage,
    currentPage * deliveriesPerPage
  )
  const handleViewDetails = async (delivery: Delivery) => {
    try {
      setSelectedDelivery(delivery)
      setSelectedDeliveryDetails(null)
      setViewOpen(true)
      setDetailsLoading(true)

      const data = await getDeliveryDetailsAction(delivery.id)

      const details = mapOrderToDeliveryDetails(data)

      setSelectedDeliveryDetails(details)
    } catch (error) {
      console.error("Failed to load delivery details:", error)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleUpdateStatus = async (status: DeliveryStatus, notes: string) => {
    if (!selectedDelivery) {
      return
    }

    /*
     * Completing a delivery requires the final payment.
     * The dedicated final-payment dialog handles both
     * the payment and delivery status transaction.
     */
    if (status === "delivered") {
      setUpdateOpen(false)
      setFinalPaymentOpen(true)
      return
    }

    try {
      setError(null)

      await updateDeliveryStatus(selectedDelivery.id, status, notes)

      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.id === selectedDelivery.id
            ? {
                ...delivery,
                status,
              }
            : delivery
        )
      )

      setSelectedDelivery((prev) =>
        prev
          ? {
              ...prev,
              status,
            }
          : null
      )

      setUpdateOpen(false)
    } catch (error) {
      console.error("Failed to update delivery status:", error)

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update delivery status"
      )
    }
  }

  const totalDeliveries = deliveries.length

  const scheduledCount = deliveries.filter(
    (d) => d.status === "scheduled"
  ).length

  const outForDeliveryCount = deliveries.filter(
    (d) => d.status === "out_for_delivery"
  ).length

  const deliveredCount = deliveries.filter(
    (d) => d.status === "delivered"
  ).length

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">Delivery Management</h1>

        <p className="text-muted-foreground">
          Manage and monitor delivery schedules.
        </p>
      </div>

      {/* KPI */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Deliveries</p>

            <h2 className="text-3xl font-bold">{totalDeliveries}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Scheduled</p>

            <h2 className="text-3xl font-bold text-yellow-600">
              {scheduledCount}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Out For Delivery</p>

            <h2 className="text-3xl font-bold text-orange-600">
              {outForDeliveryCount}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Delivered</p>

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
            if (value) setStatusFilter(value)
          }}
          className="flex-wrap justify-start"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>

          <ToggleGroupItem value="scheduled">Scheduled</ToggleGroupItem>

          <ToggleGroupItem value="out_for_delivery">
            Out For Delivery
          </ToggleGroupItem>

          <ToggleGroupItem value="delivered">Delivered</ToggleGroupItem>

          <ToggleGroupItem value="cancelled">Cancelled</ToggleGroupItem>
        </ToggleGroup>

        <div className="relative max-w-md">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search project or client..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading deliveries...</p>
          </CardContent>
        </Card>
      )}

      {error && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold">Failed to Load Deliveries</h3>

            <p className="mt-2 text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* DELIVERY CARDS */}

      {!loading && !error && (
        <div className="space-y-6">
          {paginatedDeliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onView={() => {
                handleViewDetails(delivery)
              }}
              onUpdateStatus={() => {
                setSelectedDelivery(delivery)
                setUpdateOpen(true)
              }}
              onSchedule={() => {
                setSelectedDelivery(delivery)
                setScheduleOpen(true)
              }}
            />
          ))}
        </div>
      )}

      {/* EMPTY */}

      {!loading && !error && filteredDeliveries.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold">No Deliveries Found</h3>

            <p className="text-muted-foreground">Try adjusting your filters.</p>
          </CardContent>
        </Card>
      )}

      {/* PAGINATION */}

      {filteredDeliveries.length > deliveriesPerPage && (
        <DeliveryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* DIALOGS */}

      <DeliveryDetailsDialog
        delivery={selectedDeliveryDetails}
        open={viewOpen}
        loading={detailsLoading}
        onOpenChange={setViewOpen}
      />

      <UpdateDeliveryStatusDialog
        delivery={selectedDelivery}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        onSave={handleUpdateStatus}
      />
      <DeliveryFinalPaymentDialog
        delivery={selectedDelivery}
        open={finalPaymentOpen}
        onOpenChange={setFinalPaymentOpen}
        onCompleted={async () => {
          setFinalPaymentOpen(false)
          setSelectedDelivery(null)
          await loadDeliveries()
        }}
      />

      <ScheduleDeliveryDialog
        delivery={selectedDelivery}
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        onSaved={async () => {
          setScheduleOpen(false)
          await loadDeliveries()
        }}
      />
    </div>
  )
}
