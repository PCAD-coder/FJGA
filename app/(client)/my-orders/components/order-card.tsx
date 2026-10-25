"use client"

import Image from "next/image"
import { ArrowRight, CalendarDays, Package, PhilippinePeso } from "lucide-react"

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
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-full flex-col">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-border/50 bg-muted">
          <Image
            src={order.image}
            alt={order.productName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />

          {isCustomOrder && (
            <div className="absolute bottom-3 left-3">
              <Badge
                variant="secondary"
                className="bg-background/90 px-2 py-1 text-[10px] backdrop-blur-sm"
              >
                Reference Image
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col p-4">
          {/* Header */}
          <div className="flex flex-col items-start gap-2">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base leading-6 font-semibold tracking-tight wrap-break-word">
                  {order.productName}
                </h2>

                {isCustomOrder && <Badge variant="outline">Custom Order</Badge>}
              </div>

              <p className="text-xs font-medium text-muted-foreground">
                {order.orderNumber}
              </p>
            </div>

            <OrderStatusBadge status={order.status} />
          </div>

          {/* Metadata */}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-3.5" />
              <span>{order.orderedAt}</span>
            </div>

            <div className="flex items-center gap-2">
              <Package className="size-3.5" />
              <span>Qty {order.quantity}</span>
            </div>
          </div>

          {/* Current progress */}
          <div className="mt-4 mb-4 rounded-lg bg-muted/50 p-3">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  Current Stage
                </p>

                <p className="mt-0.5 text-xs font-medium">
                  {order.currentStage}
                </p>
              </div>

              <span className="text-xs font-medium text-muted-foreground">
                {order.progressPercentage}%
              </span>
            </div>

            <Progress value={order.progressPercentage} className="h-1.5" />
          </div>

          {/* Footer */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                <PhilippinePeso className="h-3.5 w-3.5" />
                Order Total
              </div>

              <p className="mt-1 text-lg font-semibold tracking-tight tabular-nums">
                {formatCurrency(order.total)}
              </p>

              {order.deliveryFee > 0 && (
                <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                  Includes {formatCurrency(order.deliveryFee)} delivery fee
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <OrderDetailsDialog order={order} />

              <ArrowRight className="hidden size-3.5 text-muted-foreground xl:block" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
