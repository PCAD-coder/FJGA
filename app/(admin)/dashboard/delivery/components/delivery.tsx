"use client"

import { useMemo, useState, useEffect } from "react"
import { DashboardCard } from "@/components/dashboard_cards"
import DeliverySkeleton from "./delivery-skeleton"
import { toast } from "sonner"

import {
  Search,
  Settings2,
  Truck,
  CalendarDays,
  Navigation,
  CircleCheck,
} from "lucide-react"
import type {
  Delivery,
  DeliveryDetails,
  DeliveryStatus,
} from "../types/delivery"
import { Button } from "@/components/ui/button"
import ManageDeliveryZonesDialog from "./manage-delivery-zones-dialog"

import DeliveryCard from "./delivery-card"
import DeliveryDetailsDialog from "./delivery-details-dialog"
import UpdateDeliveryStatusDialog from "./update-delivery-status-dialog"
import DeliveryPagination from "./delivery-pagination"

import { Input } from "@/components/ui/input"

import { Card, CardContent } from "@/components/ui/card"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { getDeliveriesAction } from "../actions/get-deliveries"

import {
  mapOrderToDelivery,
  mapReturnToDelivery,
  mapOrderToDeliveryDetails,
  mapReturnToDeliveryDetails,
} from "../services/delivery-mapper"

import type {
  DeliveryQueryResult,
  ReturnDeliveryQueryResult,
} from "../services/delivery-mapper"

import { getDeliveryDetailsAction } from "../actions/get-delivery-details"

import { updateDeliveryStatus } from "../services/delivery-actions"

import ScheduleDeliveryDialog from "./schedule-delivery-dialog"

import DeliveryFinalPaymentDialog from "./delivery-final-payment-dialog"

import ReturnDeliveryConfirmationDialog from "./return-delivery-confirmation-dialog"

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

  const [returnDeliveryConfirmationOpen, setReturnDeliveryConfirmationOpen] =
    useState(false)

  const deliveriesPerPage = 10
  const loadDeliveries = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getDeliveriesAction()

      const mappedOrderDeliveries = result.orderDeliveries.map(
        (row: DeliveryQueryResult) => mapOrderToDelivery(row)
      )

      const mappedReturnDeliveries = result.returnDeliveries.map(
        (row: ReturnDeliveryQueryResult) => mapReturnToDelivery(row)
      )

      const mappedDeliveries = [
        ...mappedOrderDeliveries,
        ...mappedReturnDeliveries,
      ]

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
  const hasDeliverySchedule = (delivery: Delivery) =>
    Boolean(delivery.deliveryDate && delivery.deliveryTime)

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) => {
      const matchesSearch =
        delivery.projectName.toLowerCase().includes(search.toLowerCase()) ||
        delivery.clientName.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "pending_schedule"
            ? delivery.status === "scheduled" && !hasDeliverySchedule(delivery)
            : statusFilter === "scheduled"
              ? delivery.status === "scheduled" && hasDeliverySchedule(delivery)
              : delivery.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [deliveries, search, statusFilter])

  const totalPages =
    Math.ceil(filteredDeliveries.length / deliveriesPerPage) || 1

  const page = Math.min(currentPage, totalPages)

  const paginatedDeliveries = filteredDeliveries.slice(
    (page - 1) * deliveriesPerPage,
    page * deliveriesPerPage
  )
  const handleViewDetails = async (delivery: Delivery) => {
    try {
      setSelectedDelivery(delivery)
      setSelectedDeliveryDetails(null)
      setViewOpen(true)
      setDetailsLoading(true)

      if (delivery.deliveryType === "return") {
        const data = await getDeliveryDetailsAction(delivery.id, "return")

        const details = mapReturnToDeliveryDetails(
          data as ReturnDeliveryQueryResult
        )

        setSelectedDeliveryDetails(details)
      } else {
        const data = await getDeliveryDetailsAction(delivery.id, "order")

        const details = mapOrderToDeliveryDetails(data as DeliveryQueryResult)

        setSelectedDeliveryDetails(details)
      }
    } catch (error) {
      console.error("Failed to load delivery details:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load delivery details."
      )
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleUpdateStatus = async (status: DeliveryStatus, notes: string) => {
    if (!selectedDelivery) {
      return
    }

    /*
     * Normal order deliveries require final payment.
     * The dedicated payment dialog handles the transaction.
     */
    if (status === "delivered") {
      setUpdateOpen(false)
      setFinalPaymentOpen(true)
      return
    }

    try {
      setError(null)

      await updateDeliveryStatus(
        selectedDelivery.id,
        status,
        notes,
        selectedDelivery.deliveryType
      )

      toast.success("Delivery status updated successfully.")
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
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update delivery status."
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update delivery status"
      )
    }
  }

  const totalDeliveries = deliveries.length

  const pendingScheduleCount = deliveries.filter(
    (delivery) =>
      delivery.status === "scheduled" && !hasDeliverySchedule(delivery)
  ).length

  const scheduledCount = deliveries.filter(
    (delivery) =>
      delivery.status === "scheduled" && hasDeliverySchedule(delivery)
  ).length

  const outForDeliveryCount = deliveries.filter(
    (d) => d.status === "out_for_delivery"
  ).length

  const deliveredCount = deliveries.filter(
    (d) => d.status === "delivered"
  ).length

  const [manageZonesOpen, setManageZonesOpen] = useState(false)

  if (loading) {
    return <DeliverySkeleton />
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      {/* HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Delivery Management
          </h1>

          <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
            Manage and monitor delivery schedules.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setManageZonesOpen(true)}
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Manage Delivery Zones
        </Button>
      </div>

      {/* KPI */}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
        <DashboardCard
          title="Total Deliveries"
          value={String(totalDeliveries)}
          description="All order and return deliveries"
          icon={Truck}
          color="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard
          title="Pending Schedule"
          value={String(pendingScheduleCount)}
          description="Deliveries waiting to be scheduled"
          icon={CalendarDays}
          color="text-amber-600 dark:text-amber-400"
        />
        <DashboardCard
          title="Scheduled"
          value={String(scheduledCount)}
          description="Deliveries with assigned schedules"
          icon={CalendarDays}
          color="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard
          title="Out For Delivery"
          value={String(outForDeliveryCount)}
          description="Deliveries currently in transit"
          icon={Navigation}
          color="text-primary"
        />
        <DashboardCard
          title="Delivered"
          value={String(deliveredCount)}
          description="Completed deliveries"
          icon={CircleCheck}
          color="text-emerald-600 dark:text-emerald-400"
        />
      </div>

      {/* FILTERS */}

      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-4">
        <ToggleGroup
          type="single"
          value={statusFilter}
          onValueChange={(value) => {
            if (value) setStatusFilter(value)
          }}
          className="h-auto max-w-full flex-wrap justify-start gap-1"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>

          <ToggleGroupItem value="pending_schedule">
            Pending Schedule
          </ToggleGroupItem>

          <ToggleGroupItem value="scheduled">Scheduled</ToggleGroupItem>

          <ToggleGroupItem value="out_for_delivery">
            Out For Delivery
          </ToggleGroupItem>

          <ToggleGroupItem value="delivered">Delivered</ToggleGroupItem>

          <ToggleGroupItem value="cancelled">Cancelled</ToggleGroupItem>
        </ToggleGroup>

        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search project or client..."
            aria-label="Search deliveries"
            className="h-9 rounded-lg bg-background/50 pl-9 shadow-none"
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] items-stretch gap-4">
          {paginatedDeliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onView={() => {
                handleViewDetails(delivery)
              }}
              onUpdateStatus={() => {
                setSelectedDelivery(delivery)

                if (delivery.status === "out_for_delivery") {
                  if (delivery.deliveryType === "return") {
                    setReturnDeliveryConfirmationOpen(true)
                    return
                  }

                  setFinalPaymentOpen(true)
                  return
                }

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

      {!loading && !error && filteredDeliveries.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {(page - 1) * deliveriesPerPage + 1} to{" "}
            {Math.min(page * deliveriesPerPage, filteredDeliveries.length)} of{" "}
            {filteredDeliveries.length} deliveries
          </p>
          <DeliveryPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
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

      <ManageDeliveryZonesDialog
        open={manageZonesOpen}
        onOpenChange={setManageZonesOpen}
      />

      <ReturnDeliveryConfirmationDialog
        delivery={selectedDelivery}
        open={returnDeliveryConfirmationOpen}
        onOpenChange={setReturnDeliveryConfirmationOpen}
        onCompleted={async () => {
          setReturnDeliveryConfirmationOpen(false)
          setSelectedDelivery(null)
          await loadDeliveries()
        }}
      />
    </div>
  )
}
