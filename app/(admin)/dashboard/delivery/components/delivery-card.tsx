"use client"

import { Delivery } from "../types/delivery"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Calendar, MapPin, Truck, Eye, Pencil } from "lucide-react"

interface DeliveryCardProps {
  delivery: Delivery

  onView: () => void

  onUpdateStatus: () => void

  onSchedule: () => void
}

export default function DeliveryCard({
  delivery,
  onView,
  onUpdateStatus,
  onSchedule,
}: DeliveryCardProps) {
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
      case "out_for_delivery":
        return "Out For Delivery"

      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }
  const canUpdateStatus =
    delivery.status === "scheduled" || delivery.status === "out_for_delivery"

  const canSchedule =
    delivery.status === "scheduled"

  const hasSchedule = Boolean(
    delivery.deliveryDate ||
    delivery.deliveryTime ||
    delivery.assignedDriver ||
    delivery.assignedTruck
  )

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{delivery.projectName}</h3>

          <p className="text-muted-foreground">Client: {delivery.clientName}</p>
        </div>

        <Badge className={getStatusColor()}>
          {formatStatus(delivery.status)}
        </Badge>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          {/* ADDRESS */}

          <div className="flex gap-2">
            <MapPin className="mt-1 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">Delivery Address</p>

              <p className="text-sm text-muted-foreground">
                {delivery.address}
              </p>
            </div>
          </div>

          {/* SCHEDULE */}

          <div className="flex gap-2">
            <Calendar className="mt-1 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">Schedule</p>

              {delivery.deliveryDate ? (
                <p className="text-sm text-muted-foreground">
                  {delivery.deliveryDate}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Not scheduled</p>
              )}

              {delivery.deliveryTime && (
                <p className="text-sm text-muted-foreground">
                  {delivery.deliveryTime}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* TRUCK */}

          <div className="flex gap-2">
            <Truck className="mt-1 h-4 w-4 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">Assigned Truck</p>

              <p className="text-sm text-muted-foreground">
                {delivery.assignedTruck ?? "Not assigned"}
              </p>
            </div>
          </div>

          {/* DRIVER */}

          <div>
            <p className="text-sm font-medium">Driver</p>

            <p className="text-sm text-muted-foreground">
              {delivery.assignedDriver ?? "Not assigned"}
            </p>
          </div>

          {/* DELIVERY FEE */}

          <div>
            <p className="text-sm font-medium">Delivery Fee</p>

            <p className="font-semibold">
              ₱{delivery.deliveryFee.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>

        {canSchedule && (
          <Button variant="outline" onClick={onSchedule}>
            <Calendar className="mr-2 h-4 w-4" />
            {hasSchedule ? "Edit Schedule" : "Schedule Delivery"}
          </Button>
        )}

        {canUpdateStatus && (
          <Button onClick={onUpdateStatus}>
            <Pencil className="mr-2 h-4 w-4" />
            Update Status
          </Button>
        )}
      </div>
    </div>
  )
}
