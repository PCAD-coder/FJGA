"use client"

import { Delivery } from "../types/delivery"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"

interface DeliveryDetailsDialogProps {
  delivery: Delivery | null

  open: boolean

  onOpenChange: (
    open: boolean
  ) => void
}

export default function DeliveryDetailsDialog({
  delivery,
  open,
  onOpenChange,
}: DeliveryDetailsDialogProps) {
  if (!delivery) return null

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
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            Delivery Details
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <p className="text-sm text-muted-foreground">
              Project Name
            </p>

            <p className="font-medium">
              {
                delivery.projectName
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Client Name
            </p>

            <p className="font-medium">
              {
                delivery.clientName
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Delivery Address
            </p>

            <p className="font-medium">
              {
                delivery.address
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Product
            </p>

            <p className="font-medium">
              {
                delivery.productName
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Delivery Date
            </p>

            <p className="font-medium">
              {
                delivery.deliveryDate
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Delivery Time
            </p>

            <p className="font-medium">
              {
                delivery.deliveryTime
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Assigned Truck
            </p>

            <p className="font-medium">
              {
                delivery.assignedTruck
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Assigned Driver
            </p>

            <p className="font-medium">
              {
                delivery.assignedDriver
              }
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Delivery Fee
            </p>

            <p className="font-medium">
              ₱
              {delivery.deliveryFee.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <Badge
              className={getStatusColor()}
            >
              {formatStatus(
                delivery.status
              )}
            </Badge>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  )
}