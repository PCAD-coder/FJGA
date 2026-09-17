"use client"

import Image from "next/image"

import {
  CheckCircle2,
  Circle,
  Clock,
  Package,
  Ruler,
  ShoppingCart,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import OrderStatusBadge from "./order-status-badge"

import type { Order } from "../types/order"

import OrderPaymentRequirement from "./order-payment-requirement"

interface Props {
  order: Order
}

const productionStages = [
  {
    key: "material_prep",
    label: "Material Prep",
  },
  {
    key: "glass_cutting",
    label: "Glass Cutting",
  },
  {
    key: "frame_fabrication",
    label: "Frame Fabrication",
  },
  {
    key: "assembly",
    label: "Assembly",
  },
  {
    key: "finishing",
    label: "Finishing",
  },
  {
    key: "quality_check",
    label: "Quality Check",
  },
  {
    key: "ready_for_delivery",
    label: "Ready for Delivery",
  },
]

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatStage(stage: string | null) {
  if (!stage) {
    return "—"
  }

  const labels: Record<string, string> = {
    pending: "Pending",
    quoted: "Quoted",
    approved: "Approved",
    in_production: "Production",
    material_prep: "Material Prep",
    glass_cutting: "Glass Cutting",
    frame_fabrication: "Frame Fabrication",
    assembly: "Assembly",
    finishing: "Finishing",
    quality_check: "Quality Check",
    ready_for_delivery: "Ready for Delivery",
    delivered: "Completed",
    denied: "Declined",
    cancelled: "Cancelled",
  }

  return (
    labels[stage] ??
    stage
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  )
}

function getProductionStageKey(currentStage: string): string | null {
  const stageMap: Record<string, string> = {
    "Material Prep": "material_prep",
    "Glass Cutting": "glass_cutting",
    "Frame Fabrication": "frame_fabrication",
    Assembly: "assembly",
    Finishing: "finishing",
    "Quality Check": "quality_check",
    "Ready for Delivery": "ready_for_delivery",
  }

  return stageMap[currentStage] ?? null
}

export default function OrderDetailsDialog({ order }: Props) {
  const currentProductionStage = getProductionStageKey(order.currentStage)

  const currentStageIndex = currentProductionStage
    ? productionStages.findIndex(
        (stage) => stage.key === currentProductionStage
      )
    : -1

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Order</Button>
      </DialogTrigger>
      {/*<DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] !max-w-5xl overflow-y-auto">*/}
      <DialogContent className="max-h-[90vh] !max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-8">
            <div>
              <DialogTitle className="text-xl">
                Order #{order.orderNumber}
              </DialogTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Order details and production progress
              </p>
            </div>

            <OrderStatusBadge status={order.status} />
          </div>
        </DialogHeader>

        <div className="space-y-8">
          {/* ================================================= */}
          {/* PRODUCT INFORMATION */}
          {/* ================================================= */}

          <section>
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />

              <h3 className="font-semibold">Product Information</h3>
            </div>

            <div className="grid gap-5 md:grid-cols-[180px_1fr]">
              {/* Image */}

              <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
                <Image
                  src={order.image}
                  alt={order.productName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}

              <div className="space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xl font-semibold">
                      {order.productName}
                    </h4>

                    {order.madeToOrder && <Badge>Made-to-Order</Badge>}
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Ordered on {order.orderedAt}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ShoppingCart className="h-4 w-4" />
                      Quantity
                    </div>

                    <p className="mt-1 font-semibold">{order.quantity}</p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Ruler className="h-4 w-4" />
                      Dimensions
                    </div>

                    <p className="mt-1 font-semibold">
                      {order.width ?? "—"} × {order.height ?? "—"} ×{" "}
                      {order.depth ?? "—"} {order.dimensionUnit}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Stage
                    </p>

                    <p className="mt-1 font-semibold">{order.currentStage}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      Estimated Completion
                    </p>

                    <p className="mt-1 font-semibold">
                      {order.estimatedDelivery
                        ? new Date(order.estimatedDelivery).toLocaleDateString(
                            "en-PH",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* ================================================= */}
          {/* PAYMENT REQUIREMENT */}
          {/* ================================================= */}

          <OrderPaymentRequirement order={order} />

          {/* ================================================= */}
          {/* PRODUCTION PROGRESS */}
          {/* ================================================= */}

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Production Progress</h3>

                <p className="text-sm text-muted-foreground">
                  Current stage:{" "}
                  <span className="font-medium text-foreground">
                    {order.currentStage}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {order.progressPercentage}%
                </p>

                <p className="text-xs text-muted-foreground">
                  Overall progress
                </p>
              </div>
            </div>

            <div className="rounded-xl border p-5">
              <div className="space-y-1">
                {productionStages.map((stage, index) => {
                  const completed =
                    currentStageIndex >= 0 && index < currentStageIndex

                  const current = currentStageIndex === index

                  const historyItems = order.timeline.filter(
                    (item) => item.toStage === stage.label
                  )

                  return (
                    <div key={stage.key} className="flex gap-4">
                      {/* Indicator */}

                      <div className="flex w-6 shrink-0 flex-col items-center">
                        {completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : current ? (
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                            <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                          </div>
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}

                        {index < productionStages.length - 1 && (
                          <div
                            className={`mt-1 min-h-10 w-px ${
                              completed ? "bg-green-500" : "bg-border"
                            }`}
                          />
                        )}
                      </div>

                      {/* Stage content */}

                      <div className="min-w-0 flex-1 pb-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={
                              current
                                ? "font-semibold text-primary"
                                : completed
                                  ? "font-medium"
                                  : "font-medium text-muted-foreground"
                            }
                          >
                            {stage.label}
                          </p>

                          {current && (
                            <Badge variant="secondary">Current</Badge>
                          )}

                          {completed && (
                            <Badge variant="outline" className="text-green-600">
                              Completed
                            </Badge>
                          )}
                        </div>

                        {historyItems.length > 0 ? (
                          <div className="mt-2 space-y-2">
                            {historyItems.map((history) => (
                              <div
                                key={history.id}
                                className="rounded-lg bg-muted/50 p-3"
                              >
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                  <span>{formatDate(history.changedAt)}</span>

                                  {history.changedBy && (
                                    <>
                                      <span>•</span>

                                      <span>
                                        Updated by {history.changedBy}
                                      </span>
                                    </>
                                  )}
                                </div>

                                {history.notes && (
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {history.notes}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          !completed &&
                          !current && (
                            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              Waiting
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <Separator />

          {/* ================================================= */}
          {/* PRODUCTION HISTORY */}
          {/* ================================================= */}

          {order.timeline.length > 0 && (
            <section>
              <div className="mb-4">
                <h3 className="font-semibold">Production History</h3>

                <p className="text-sm text-muted-foreground">
                  Record of production stage changes
                </p>
              </div>

              <div className="space-y-3">
                {order.timeline.map((history) => (
                  <div key={history.id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium">
                          {formatStage(history.toStage)}
                        </p>

                        {history.fromStage && (
                          <p className="text-sm text-muted-foreground">
                            From {formatStage(history.fromStage)}
                          </p>
                        )}
                      </div>

                      <div className="text-left text-xs text-muted-foreground sm:text-right">
                        <p>{formatDate(history.changedAt)}</p>

                        {history.changedBy && (
                          <p className="mt-1">{history.changedBy}</p>
                        )}
                      </div>
                    </div>

                    {history.notes && (
                      <p className="mt-3 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground">
                        {history.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <Separator />

          {/* ================================================= */}
          {/* ORDER SUMMARY */}
          {/* ================================================= */}

          <section>
            <h3 className="mb-4 font-semibold">Order Summary</h3>

            <div className="rounded-xl border p-5">
              <div className="space-y-3">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Quantity</span>

                  <span className="font-medium">{order.quantity}</span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Unit Price</span>

                  <span className="font-medium">
                    ₱
                    {(order.total / Math.max(order.quantity, 1)).toLocaleString(
                      "en-PH",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </span>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Amount Paid</span>

                  <span className="font-medium">
                    ₱
                    {order.amountPaid.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Required Down Payment
                  </span>

                  <span className="font-medium">
                    ₱
                    {order.requiredDownPayment.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Remaining Down Payment
                  </span>

                  <span
                    className={
                      order.remainingDownPayment > 0
                        ? "font-semibold text-orange-600"
                        : "font-semibold text-green-600"
                    }
                  >
                    ₱
                    {order.remainingDownPayment.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between gap-4">
                  <span className="font-semibold">Order Total</span>

                  <span className="text-xl font-bold">
                    ₱
                    {order.total.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
