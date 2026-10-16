"use client"

import Image from "next/image"
import {
  ArrowRight,
  CalendarDays,
  Package,
  PhilippinePeso,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import OrderStatusBadge from "./order-status-badge"
import OrderDetailsDialog from "./order-details-dialog"

import type { Order } from "../types/order"

interface Props {
  order: Order
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value)
}

export default function OrderCard({ order }: Props) {
  const isCustomOrder = order.orderType === "custom"

  return (
    <div className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-5 p-5 sm:flex-row">
        {/* Image */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-40 sm:w-40">
          <Image
            src={order.image}
            alt={order.productName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {isCustomOrder && (
            <div className="absolute bottom-2 left-2">
              <Badge
                variant="secondary"
                className="bg-background/90 text-xs shadow-sm backdrop-blur-sm"
              >
                Reference Image
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-semibold tracking-tight">
                  {order.productName}
                </h2>

                {isCustomOrder && (
                  <Badge variant="outline">
                    Custom Order
                  </Badge>
                )}
              </div>

              <p className="text-sm font-medium text-muted-foreground">
                {order.orderNumber}
              </p>
            </div>

            <OrderStatusBadge status={order.status} />
          </div>

          {/* Metadata */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>{order.orderedAt}</span>
            </div>

            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>
                Qty {order.quantity}
              </span>
            </div>
          </div>

          {/* Current progress */}
          <div className="mt-5 rounded-lg border bg-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Current Stage
                </p>

                <p className="mt-1 text-sm font-semibold">
                  {order.currentStage}
                </p>
              </div>

              <span className="text-sm font-medium text-muted-foreground">
                {order.progressPercentage}%
              </span>
            </div>

            <Progress value={order.progressPercentage} />
          </div>

          {/* Footer */}
          <div className="mt-5 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <PhilippinePeso className="h-3.5 w-3.5" />
                Order Total
              </div>

              <p className="mt-1 text-xl font-semibold tracking-tight">
                {formatCurrency(order.total)}
              </p>

              {order.deliveryFee > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Includes {formatCurrency(order.deliveryFee)} delivery fee
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <OrderDetailsDialog order={order} />

              <ArrowRight className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}