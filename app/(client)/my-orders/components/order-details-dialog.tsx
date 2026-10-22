"use client"
import { useRouter } from "next/navigation"

import Image from "next/image"

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Package,
  Phone,
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
function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

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

function formatDimensions(
  width: number | null,
  height: number | null,
  depth: number | null,
  unit: string
) {
  const values = [width, height, depth].filter(
    (value): value is number => value !== null
  )

  if (values.length === 0) {
    return "Not specified"
  }

  return `${values.join(" × ")} ${unit}`
}

function formatDeliveryAddress(address: Order["deliveryAddress"]) {
  if (!address) {
    return null
  }

  const streetLine = [
    address.unitFloor,
    address.houseBuildingNumber,
    address.street,
    address.buildingSubdivision,
  ]
    .filter(Boolean)
    .join(", ")

  const locationLine = [
    address.barangayName,
    address.cityName,
    address.provinceName,
  ]
    .filter(Boolean)
    .join(", ")

  const regionLine = [address.regionName, address.postalCode]
    .filter(Boolean)
    .join(" ")

  return {
    streetLine,
    locationLine,
    regionLine,
  }
}

export default function OrderDetailsDialog({ order }: Props) {
  const currentProductionStage = getProductionStageKey(order.currentStage)
  const router = useRouter()
  const currentStageIndex = currentProductionStage
    ? productionStages.findIndex(
        (stage) => stage.key === currentProductionStage
      )
    : -1

  const deliveryAddress = formatDeliveryAddress(order.deliveryAddress)

  const dimensions = formatDimensions(
    order.width,
    order.height,
    order.depth,
    order.dimensionUnit
  )

  const isCustomOrder = order.orderType === "custom"

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Order</Button>
      </DialogTrigger>
      {/*<DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] !max-w-5xl overflow-y-auto">*/}
      <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] !max-w-4xl overflow-y-auto">
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

          {/* ================================================= */}
          {/* ORDER OVERVIEW */}
          {/* ================================================= */}

          <section className="space-y-5">
            <div className="grid gap-6 md:grid-cols-[200px_1fr]">
              {/* Image */}
              <div>
                <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
                  <Image
                    src={order.image}
                    alt={order.productName}
                    fill
                    className="object-cover"
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
              </div>

              {/* Product */}
              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold tracking-tight">
                        {order.productName}
                      </h3>

                      {isCustomOrder && (
                        <Badge variant="outline">Custom Order</Badge>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.orderNumber}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border bg-muted/20 p-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Quantity
                    </div>

                    <p className="mt-1.5 text-sm font-semibold">
                      {order.quantity}
                    </p>
                  </div>

                  <div className="rounded-lg border bg-muted/20 p-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Ruler className="h-3.5 w-3.5" />
                      Dimensions
                    </div>

                    <p className="mt-1.5 text-sm font-semibold">{dimensions}</p>
                  </div>

                  <div className="rounded-lg border bg-muted/20 p-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Ordered
                    </div>

                    <p className="mt-1.5 text-sm font-semibold">
                      {order.orderedAt}
                    </p>
                  </div>

                  <div className="rounded-lg border bg-muted/20 p-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <Package className="h-3.5 w-3.5" />
                      Current Stage
                    </div>

                    <p className="mt-1.5 text-sm font-semibold">
                      {order.currentStage}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* ================================================= */}
          {/* CUSTOMER & DELIVERY */}
          {/* ================================================= */}

          <section>
            <div className="mb-4">
              <h3 className="font-semibold">Delivery Information</h3>

              <p className="text-sm text-muted-foreground">
                Contact and delivery details for this order
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Contact */}
              <div className="rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Contact Number
                    </p>

                    <p className="mt-1 font-medium">
                      {order.customerContactNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="rounded-xl border p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Delivery Address
                    </p>

                    {deliveryAddress ? (
                      <div className="mt-1 space-y-0.5 text-sm">
                        {deliveryAddress.streetLine && (
                          <p>{deliveryAddress.streetLine}</p>
                        )}

                        {deliveryAddress.locationLine && (
                          <p>{deliveryAddress.locationLine}</p>
                        )}

                        {deliveryAddress.regionLine && (
                          <p>{deliveryAddress.regionLine}</p>
                        )}

                        {order.deliveryAddress?.landmark && (
                          <p className="pt-1 text-muted-foreground">
                            Landmark: {order.deliveryAddress.landmark}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">
                        No delivery address available
                      </p>
                    )}
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

                <p className="text-xs text-muted-foreground">Order progress</p>
              </div>
            </div>

            {currentStageIndex === -1 ? (
              <div className="rounded-xl border border-dashed p-6 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>

                <p className="mt-3 font-medium">
                  Production has not started yet
                </p>

                <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                  Production stages will appear here once this order enters
                  production.
                </p>

                {!order.productionPaymentComplete &&
                  order.status === "Approved" && (
                    <p className="mt-2 text-sm font-medium text-orange-600">
                      The required 50% payment must be completed first.
                    </p>
                  )}
              </div>
            ) : (
              <div className="rounded-xl border p-5">
                <div className="space-y-1">
                  {productionStages.map((stage, index) => {
                    const completed =
                      currentStageIndex >= 0 && index < currentStageIndex

                    const current = currentStageIndex === index

                    return (
                      <div key={stage.key} className="flex gap-4">
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
                              <Badge
                                variant="outline"
                                className="text-green-600"
                              >
                                Completed
                              </Badge>
                            )}
                          </div>

                          {current ? (
                            <p className="mt-1 text-sm text-muted-foreground">
                              Currently in this stage
                            </p>
                          ) : completed ? (
                            <p className="mt-1 text-sm text-muted-foreground">
                              Stage completed
                            </p>
                          ) : (
                            <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              Waiting
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>

          {/* ================================================= */}
          {/* PRODUCTION HISTORY */}
          {/* ================================================= */}

          {order.timeline.length > 0 && (
            <>
              <Separator />

              <section>
                <div className="mb-4">
                  <h3 className="font-semibold">Production History</h3>

                  <p className="text-sm text-muted-foreground">
                    Recorded production updates for this order
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border">
                  {order.timeline.map((history, index) => (
                    <div
                      key={history.id}
                      className={
                        index !== order.timeline.length - 1
                          ? "border-b p-4"
                          : "p-4"
                      }
                    >
                      <div className="flex gap-3">
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                          <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-sm font-medium">
                                {formatStage(history.toStage)}
                              </p>

                              {history.fromStage && (
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  From {formatStage(history.fromStage)}
                                </p>
                              )}
                            </div>

                            <p className="shrink-0 text-xs text-muted-foreground">
                              {formatDate(history.changedAt)}
                            </p>
                          </div>

                          {history.notes && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {history.notes}
                            </p>
                          )}

                          {history.changedBy && (
                            <p className="mt-2 text-xs text-muted-foreground">
                              Updated by {history.changedBy}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          <Separator />
          {/* ================================================= */}
          {/* ORDER BREAKDOWN */}
          {/* ================================================= */}

          <section>
            <div className="mb-4">
              <h3 className="font-semibold">Order Breakdown</h3>

              <p className="text-sm text-muted-foreground">
                Price summary for this order
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border">
              {/* Item */}
              <div className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium">{order.productName}</p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span>Qty {order.quantity}</span>

                      {order.orderType === "custom" && (
                        <>
                          <span>•</span>
                          <span>Custom Order</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    <p className="font-semibold">
                      {formatCurrency(order.lineTotal)}
                    </p>

                    {order.quantity > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatCurrency(order.unitPrice)} each
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-3 bg-muted/20 p-5">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Item Subtotal</span>

                  <span className="font-medium">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">
                    VAT ({order.vatRate}%)
                  </span>

                  <span className="font-medium">
                    {formatCurrency(order.vatAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>

                  <span className="font-medium">
                    {formatCurrency(order.deliveryFee)}
                  </span>
                </div>

                <Separator />

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-semibold">Order Total</p>

                    <p className="text-xs text-muted-foreground">
                      Including VAT and delivery fee
                    </p>
                  </div>

                  <p className="text-xl font-bold">
                    {formatCurrency(order.total)}
                  </p>
                </div>
              </div>
            </div>
          </section>
          <Separator />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Manage your payments</p>

              <p className="text-sm text-muted-foreground">
                View payment details, balances, and available payment options.
              </p>
            </div>

            <Button
              className="shrink-0"
              onClick={() => router.push("/payments")}
            >
              Go to Payments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
