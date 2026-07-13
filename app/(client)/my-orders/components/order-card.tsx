"use client"

import Image from "next/image"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"

import OrderProgress from "./order-progress"
import OrderStatusBadge from "./order-status-badge"
import OrderDetailsDialog from "./order-details-dialog"

import { Order } from "../types/order"

interface Props {
  order: Order
}
export default function OrderCard({ order }: Props) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex gap-6">
        {/* Product Image */}

        <div className="relative h-36 w-36 overflow-hidden rounded-lg">
          <Image
            src={order.image}
            alt={order.productName}
            fill
            className="object-cover"
          />
        </div>

        {/* Information */}

        <div className="flex flex-1 flex-col justify-between">
          {/* Top */}

          <div className="flex justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{order.productName}</h2>

                {order.madeToOrder && <Badge>Made-to-Order</Badge>}
              </div>

              <div className="grid grid-cols-2 gap-x-10 gap-y-1 text-sm text-muted-foreground">
                <p>Placed: {order.orderedAt}</p>

                <p>Order #{order.orderNumber}</p>

                <p>Total: ₱{order.total.toLocaleString()}</p>

                <p>Qty: {order.quantity}</p>
              </div>
            </div>

            <OrderStatusBadge status={order.status} />
          </div>

          {/* Progress */}

          <OrderProgress
            quotation={order.progress.quotation}
            production={order.progress.production}
            delivery={order.progress.delivery}
            completed={order.progress.completed}
          />

          {/* Bottom */}

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Current Stage
              <span className="ml-2 font-semibold text-foreground">
                {order.currentStage}
              </span>
              <span className="ml-2">({order.progressPercentage}%)</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">Track Progress</Button>

              <OrderDetailsDialog order={order} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
