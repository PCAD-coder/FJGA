"use client"

import { Delivery } from "../types/delivery"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Calendar, MapPin, Truck, Eye, Pencil, UserRound } from "lucide-react"

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

  const canSchedule = delivery.status === "scheduled"

  const hasSchedule = Boolean(
    delivery.deliveryDate ||
    delivery.deliveryTime ||
    delivery.assignedDriver ||
    delivery.assignedTruck
  )

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
      <div className="flex flex-col items-start gap-2 border-b border-border/60 p-3">
        <div>
          <h3 className="text-base leading-6 font-semibold tracking-tight wrap-break-word">
            {delivery.projectName}
          </h3>

          <p className="mt-0.5 text-sm text-muted-foreground">
            Client: {delivery.clientName}
          </p>
        </div>

        <Badge
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusColor()}`}
        >
          {formatStatus(delivery.status)}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="space-y-3">
          {/* ADDRESS */}

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Delivery Address
              </p>

              <p className="mt-0.5 text-sm leading-5 wrap-break-word">
                {delivery.address}
              </p>
            </div>
          </div>

          {/* SCHEDULE */}

          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Schedule
              </p>

              {delivery.deliveryDate ? (
                <p className="mt-0.5 text-sm leading-5 wrap-break-word">
                  {delivery.deliveryDate}
                </p>
              ) : (
                <p className="mt-0.5 text-sm leading-5 wrap-break-word">
                  Not scheduled
                </p>
              )}

              {delivery.deliveryTime && (
                <p className="mt-0.5 text-sm leading-5 wrap-break-word">
                  {delivery.deliveryTime}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* TRUCK */}

          <div className="flex items-start gap-3">
            <Truck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Assigned Truck
              </p>

              <p className="mt-0.5 text-sm leading-5 wrap-break-word">
                {delivery.assignedTruck ?? "Not assigned"}
              </p>
            </div>
          </div>

          {/* DRIVER */}

          <div className="flex items-start gap-3">
            <UserRound
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Driver
              </p>
              <p className="mt-0.5 text-sm leading-5 wrap-break-word">
                {delivery.assignedDriver ?? "Not assigned"}
              </p>
            </div>
          </div>

          {/* DELIVERY FEE */}

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/50 bg-muted/40 px-2.5 py-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Delivery Fee
            </p>

            <p className="text-sm font-semibold tracking-tight tabular-nums">
              &#8369;{delivery.deliveryFee.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-border/60 bg-muted/20 p-3 [&>button]:h-8 [&>button]:w-full [&>button]:rounded-lg [&>button]:text-xs [&>button]:shadow-none [&>button:last-child:nth-child(odd)]:col-span-2">
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
