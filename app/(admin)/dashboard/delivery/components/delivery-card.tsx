"use client"

import { Delivery } from "../types/delivery"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Calendar,
  MapPin,
  Truck,
  Eye,
  Pencil,
} from "lucide-react"

interface DeliveryCardProps {
  delivery: Delivery

  onView: () => void

  onUpdateStatus: () => void
}

export default function DeliveryCard({
  delivery,
  onView,
  onUpdateStatus,
}: DeliveryCardProps) {
  const getStatusColor = () => {
    switch (delivery.status) {
      case "ready":
        return "bg-yellow-100 text-yellow-700"

      case "scheduled":
        return "bg-blue-100 text-blue-700"

      case "out-for-delivery":
        return "bg-orange-100 text-orange-700"

      case "delivered":
        return "bg-green-100 text-green-700"

      case "cancelled":
        return "bg-red-100 text-red-700"

      default:
        return ""
    }
  }

  const formatStatus = (
    status: string
  ) => {
    switch (status) {
      case "out-for-delivery":
        return "Out For Delivery"

      default:
        return (
          status.charAt(0).toUpperCase() +
          status.slice(1)
        )
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6">

      <div className="flex items-start justify-between">

        <div>
          <h3 className="font-semibold text-lg">
            {delivery.projectName}
          </h3>

          <p className="text-muted-foreground">
            Client: {delivery.clientName}
          </p>
        </div>

        <Badge
          className={getStatusColor()}
        >
          {formatStatus(
            delivery.status
          )}
        </Badge>

      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">

        <div className="space-y-4">

          <div className="flex gap-2">
            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">
                Delivery Address
              </p>

              <p className="text-sm text-muted-foreground">
                {
                  delivery.address
                }
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">
                Schedule
              </p>

              <p className="text-sm text-muted-foreground">
                {
                  delivery.deliveryDate
                }
              </p>

              <p className="text-sm text-muted-foreground">
                {
                  delivery.deliveryTime
                }
              </p>
            </div>
          </div>

        </div>

        <div className="space-y-4">

          <div className="flex gap-2">
            <Truck className="h-4 w-4 mt-1 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">
                Assigned Truck
              </p>

              <p className="text-sm text-muted-foreground">
                {
                  delivery.assignedTruck
                }
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">
              Driver
            </p>

            <p className="text-sm text-muted-foreground">
              {
                delivery.assignedDriver
              }
            </p>
          </div>

          <div>
            <p className="text-sm font-medium">
              Delivery Fee
            </p>

            <p className="font-semibold">
              ₱
              {delivery.deliveryFee.toLocaleString()}
            </p>
          </div>

        </div>

      </div>

      <div className="flex gap-2 mt-6">

        <Button
          variant="outline"
          onClick={onView}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>

        <Button
          onClick={
            onUpdateStatus
          }
        >
          <Pencil className="mr-2 h-4 w-4" />
          Update Status
        </Button>

      </div>

    </div>
  )
}