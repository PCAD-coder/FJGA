"use client"

import type { DeliveryDetails } from "../types/delivery"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"

interface DeliveryDetailsDialogProps {
  delivery: DeliveryDetails | null
  open: boolean
  loading?: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeliveryDetailsDialog({
  delivery,
  open,
  loading = false,
  onOpenChange,
}: DeliveryDetailsDialogProps) {
  if (!open) return null
  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
          </DialogHeader>

          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading delivery details...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!delivery) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Delivery Details</DialogTitle>
          </DialogHeader>

          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Delivery details are unavailable.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const getStatusColor = () => {
    switch (delivery.status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700"

      case "out_for_delivery":
        return "bg-orange-100 text-orange-700"

      case "delivered":
        return "bg-green-100 text-green-700"

      case "cancelled":
        return "bg-red-100 text-red-700"

      default:
        return ""
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Scheduled"

      case "out_for_delivery":
        return "Out For Delivery"

      case "delivered":
        return "Delivered"

      case "cancelled":
        return "Cancelled"

      default:
        return status
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
    }
  }

  const customerName = delivery.customer
    ? [delivery.customer.firstName, delivery.customer.lastName]
        .filter(Boolean)
        .join(" ") || "Unknown Customer"
    : "Unknown Customer"

  const formatDate = (date: string | null) => {
    if (!date) return "Not scheduled"

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return parsedDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (time: string | null) => {
    if (!time) return "Not scheduled"

    const [hours, minutes] = time.split(":")

    const date = new Date()

    date.setHours(Number(hours), Number(minutes), 0, 0)

    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const formatDeliveredAt = (timestamp: string | null) => {
    if (!timestamp) return "Not yet delivered"

    const date = new Date(timestamp)

    if (Number.isNaN(date.getTime())) {
      return timestamp
    }

    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col gap-2 pr-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <DialogTitle>Delivery Details</DialogTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Order #{delivery.orderNumber}
              </p>
            </div>

            <Badge className={getStatusColor()}>
              {formatStatus(delivery.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* CUSTOMER */}

          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">Customer</h3>

              <p className="text-sm text-muted-foreground">
                Customer information
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Customer Name</p>

              <p className="mt-1 font-medium">{customerName}</p>
            </div>
          </section>

          {/* DELIVERY ADDRESS */}

          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">Delivery Address</h3>

              <p className="text-sm text-muted-foreground">
                Complete delivery location
              </p>
            </div>

            <div className="rounded-lg border p-4">
              {delivery.address ? (
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {delivery.address.houseBuildingNumber}
                  </p>

                  <p>{delivery.address.street}</p>

                  {delivery.address.buildingSubdivision && (
                    <p>{delivery.address.buildingSubdivision}</p>
                  )}

                  {delivery.address.unitFloor && (
                    <p>{delivery.address.unitFloor}</p>
                  )}

                  <p>
                    {delivery.address.barangayName}, {delivery.address.cityName}
                  </p>

                  {delivery.address.provinceName && (
                    <p>{delivery.address.provinceName}</p>
                  )}

                  <p>{delivery.address.regionName}</p>

                  {delivery.address.postalCode && (
                    <p>Postal Code: {delivery.address.postalCode}</p>
                  )}

                  {delivery.address.landmark && (
                    <p className="pt-2 text-muted-foreground">
                      Landmark: {delivery.address.landmark}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No delivery address available.
                </p>
              )}
            </div>
          </section>

          {/* ORDER ITEMS */}

          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">Order Items</h3>

              <p className="text-sm text-muted-foreground">
                Products included in this delivery
              </p>
            </div>

            <div className="rounded-lg border">
              {delivery.items.length > 0 ? (
                <div className="divide-y">
                  {delivery.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-4"
                    >
                      <p className="font-medium">{item.productName}</p>

                      <p className="text-sm text-muted-foreground">
                        × {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-4 text-sm text-muted-foreground">
                  No order items found.
                </p>
              )}
            </div>
          </section>

          {/* DELIVERY INFORMATION */}

          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">Delivery Information</h3>

              <p className="text-sm text-muted-foreground">
                Delivery schedule and assignment
              </p>
            </div>

            <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Date</p>

                <p className="mt-1 font-medium">
                  {formatDate(delivery.scheduledDate)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Scheduled Time</p>

                <p className="mt-1 font-medium">
                  {formatTime(delivery.scheduledTime)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Assigned Driver</p>

                <p className="mt-1 font-medium">
                  {delivery.assignedDriver || "Not assigned"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Assigned Truck</p>

                <p className="mt-1 font-medium">
                  {delivery.assignedTruck || "Not assigned"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Delivery Fee</p>

                <p className="mt-1 font-medium">
                  ₱
                  {delivery.deliveryFee.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Delivered At</p>

                <p className="mt-1 font-medium">
                  {formatDeliveredAt(delivery.deliveredAt)}
                </p>
              </div>
            </div>
          </section>

          {/* DELIVERY NOTES */}

          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">Delivery Notes</h3>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm whitespace-pre-wrap">
                {delivery.deliveryNotes || "No delivery notes."}
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
