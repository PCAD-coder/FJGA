"use client"

import type { Order } from "../../types/order"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import StartProductionDialog from "./start-production-dialog"

function formatPaymentMethod(paymentMethod: string | null | undefined) {
  switch (paymentMethod) {
    case "cash_on_delivery":
      return "Cash"

    case "cash":
      return "Cash"

    case "card":
      return "Card"

    case "gcash":
      return "GCash"

    default:
      return "Not specified"
  }
}

function formatMaterialVariant(material: any) {
  const parts = [material.material_name]

  if (material.series) {
    parts.push(`(${material.series})`)
  }

  if (material.thickness) {
    parts.push(`(${material.thickness})`)
  }

  return parts.join(" ")
}

interface Props {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void

  onApprove?: (orderId: string) => void
  onDeny?: (orderId: string) => void
  onChangeStatus?: (
    orderId: string,
    status: "in_production" | "ready_for_delivery" | "delivered",
    options?: {
      assignedTo?: string
      estimatedCompletionDate?: string
    }
  ) => void
}

export default function ViewOrderDialog({
  order,
  open,
  onOpenChange,
  onApprove,
  onDeny,
  onChangeStatus,
}: Props) {
  const [supabase] = useState(() => createClient())
  const [productImages, setProductImages] = useState<Record<string, string>>({})
  const [totalPaid, setTotalPaid] = useState(0)
  const [paymentsLoading, setPaymentsLoading] = useState(false)

  useEffect(() => {
    if (!order) {
      setProductImages({})
      return
    }

    async function loadImages() {
      const ids = (order?.items ?? [])
        .map((item) => item.product_id)
        .filter(Boolean)

      if (ids.length === 0) return

      const { data } = await supabase
        .from("product_images")
        .select("product_id, image_url, display_order")
        .in("product_id", ids)
        .order("display_order", { ascending: true })

      const map: Record<string, string> = {}

      for (const image of data ?? []) {
        if (!map[image.product_id]) {
          map[image.product_id] = image.image_url
        }
      }

      setProductImages(map)
    }

    loadImages()
  }, [order, supabase])

  useEffect(() => {
    if (!order) {
      setTotalPaid(0)
      setPaymentsLoading(false)
      return
    }

    const orderId = order.id

    async function loadPayments() {
      try {
        setPaymentsLoading(true)

        const { data, error } = await supabase
          .from("order_payments")
          .select("amount")
          .eq("order_id", orderId)

        if (error) {
          throw error
        }

        const paid = (data ?? []).reduce(
          (total, payment) => total + Number(payment.amount ?? 0),
          0
        )

        setTotalPaid(paid)
      } catch (error) {
        console.error("Failed to load order payments:", error)
        setTotalPaid(0)
      } finally {
        setPaymentsLoading(false)
      }
    }

    loadPayments()
  }, [order])

  const [startProductionOpen, setStartProductionOpen] = useState(false)

  if (!order) return null

  const items = order.items ?? []
  const requiredDownPayment = order.total_amount * 0.5

  const remainingDownPayment = Math.max(requiredDownPayment - totalPaid, 0)

  const productionPaymentComplete = totalPaid >= requiredDownPayment

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    quoted: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    in_production: "bg-purple-100 text-purple-800",
    ready_for_delivery: "bg-orange-100 text-orange-800",
    delivered: "bg-emerald-100 text-emerald-800",
    denied: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] !max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <section className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">
                Quotation / Order No.
              </p>
              <p className="font-semibold">{order.order_number}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  statusColors[order.status] ?? "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status.replaceAll("_", " ")}
              </span>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Customer</p>
              <p className="font-semibold">
                {order.profiles
                  ? `${order.profiles.first_name} ${order.profiles.last_name}`
                  : order.customer_id}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-semibold">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Order Type</p>
              <p className="font-semibold capitalize">{order.order_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Number</p>
              <p className="font-semibold">
                {order.customer_contact_number || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-semibold">
                {formatPaymentMethod(order.payment_method)}
              </p>
            </div>
          </section>
          {order.address && (
            <section className="space-y-4 rounded-lg border p-4">
              <div>
                <h3 className="text-lg font-semibold">Delivery Address</h3>
                <p className="text-sm text-muted-foreground">
                  Address provided by the customer for this order.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    House / Building Number
                  </p>
                  <p className="font-medium">
                    {order.address.house_building_number}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Street
                  </p>
                  <p className="font-medium">{order.address.street}</p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Building / Subdivision
                  </p>
                  <p className="font-medium">
                    {order.address.building_subdivision || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Unit / Floor
                  </p>
                  <p className="font-medium">
                    {order.address.unit_floor || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Barangay
                  </p>
                  <p className="font-medium">{order.address.barangay_name}</p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    City / Municipality
                  </p>
                  <p className="font-medium">{order.address.city_name}</p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Province
                  </p>
                  <p className="font-medium">
                    {order.address.province_name || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Region
                  </p>
                  <p className="font-medium">{order.address.region_name}</p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Postal Code
                  </p>
                  <p className="font-medium">
                    {order.address.postal_code || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Landmark
                  </p>
                  <p className="font-medium">{order.address.landmark || "—"}</p>
                </div>
              </div>

              <div className="rounded-md bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Complete Delivery Address
                </p>

                <p className="mt-1 text-sm font-medium">
                  {order.address.house_building_number}
                  {order.address.unit_floor
                    ? `, ${order.address.unit_floor}`
                    : ""}
                  {order.address.building_subdivision
                    ? `, ${order.address.building_subdivision}`
                    : ""}
                  , {order.address.street}, {order.address.barangay_name},{" "}
                  {order.address.city_name}
                  {order.address.province_name
                    ? `, ${order.address.province_name}`
                    : ""}
                  , {order.address.region_name}
                  {order.address.postal_code
                    ? ` ${order.address.postal_code}`
                    : ""}
                </p>
              </div>
            </section>
          )}

          {items.map((item) => (
            <section key={item.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex gap-4">
                <div className="relative h-28 w-28 overflow-hidden rounded-lg border bg-muted">
                  {productImages[item.product_id] ? (
                    <Image
                      src={productImages[item.product_id]}
                      alt={item.product_name_snapshot}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {item.product_name_snapshot}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>

                  {(item.width || item.height || item.depth) && (
                    <p className="text-sm text-muted-foreground">
                      Dimensions: {item.width ?? "-"} × {item.height ?? "-"} ×{" "}
                      {item.depth ?? "-"} {item.dimensionUnit ?? "cm"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium">Materials</h4>
                <div className="mt-2 space-y-2 text-sm">
                  {(item.materials_snapshot ?? []).map((material, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">
                          {formatMaterialVariant(material)}
                        </p>
                        <p className="text-muted-foreground">
                          {material.quantity} {material.unit} × ₱
                          {material.unit_cost.toFixed(2)}
                        </p>
                      </div>

                      <p className="font-semibold">
                        ₱{material.subtotal.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium">Labor</h4>
                <div className="mt-2 space-y-2 text-sm">
                  {(item.labor_snapshot ?? []).map((labor, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{labor.service_name}</p>
                        <p className="text-muted-foreground">
                          {labor.quantity} {labor.unit} × ₱
                          {labor.labor_cost.toFixed(2)}
                        </p>
                      </div>

                      <p className="font-semibold">
                        ₱{labor.subtotal.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Material Cost</span>
                  <span>₱{item.material_subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Labor Cost</span>
                  <span>₱{item.labor_subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Markup</span>
                  <span>₱{item.markup_amount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Line Total</span>
                  <span>₱{item.line_total.toFixed(2)}</span>
                </div>
              </div>
            </section>
          ))}

          <section className="space-y-2 rounded-lg border p-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₱{order.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Labor Total</span>
              <span>₱{order.labor_total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₱{order.delivery_fee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total Amount</span>
              <span>₱{order.total_amount.toFixed(2)}</span>
            </div>
          </section>
          <section className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Production Payment</h3>

                <p className="text-sm text-muted-foreground">
                  At least 50% of the order total must be paid before production
                  can begin.
                </p>
              </div>

              {paymentsLoading ? (
                <Badge variant="secondary">Checking Payment...</Badge>
              ) : productionPaymentComplete ? (
                <Badge variant="default">Payment Requirement Met</Badge>
              ) : (
                <Badge variant="destructive">Payment Insufficient</Badge>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Required Before Production
                </p>

                <p className="font-semibold">
                  ₱
                  {requiredDownPayment.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Total Paid</p>

                <p className="font-semibold">
                  ₱
                  {totalPaid.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Remaining Required Payment
                </p>

                <p className="font-semibold">
                  ₱
                  {remainingDownPayment.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            {!paymentsLoading && !productionPaymentComplete && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
                <p className="text-sm font-medium text-destructive">
                  Production cannot start yet.
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  The customer must pay at least 50% of the order total before
                  production can begin.{" "}
                  <span className="font-medium">
                    ₱
                    {remainingDownPayment.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>{" "}
                  more is required.
                </p>
              </div>
            )}

            {!paymentsLoading && productionPaymentComplete && (
              <div className="rounded-md border border-green-500/30 bg-green-500/10 p-3">
                <p className="text-sm font-medium text-green-700">
                  The customer has paid the required 50%.
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Production can now be started.
                </p>
              </div>
            )}
          </section>
        </div>

        <section className="flex flex-wrap justify-end gap-2 border-t pt-4">
          {(order.status === "pending" || order.status === "quoted") && (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onApprove?.(order.id)}
              >
                Approve Order
              </Button>

              <Button variant="destructive" onClick={() => onDeny?.(order.id)}>
                Deny Order
              </Button>
            </>
          )}

          {order.status === "approved" && (
            <div className="flex flex-col gap-1">
              <Button
                disabled={paymentsLoading || !productionPaymentComplete}
                onClick={() => setStartProductionOpen(true)}
              >
                {paymentsLoading ? "Checking Payment..." : "Start Production"}
              </Button>

              {!paymentsLoading && !productionPaymentComplete && (
                <p className="text-xs text-destructive">
                  50% payment required before production can start.
                </p>
              )}
            </div>
          )}
{/*
          {order.status === "in_production" && (
            <Button
              onClick={() => onChangeStatus?.(order.id, "ready_for_delivery")}
            >
              Ready for Delivery
            </Button>
          )}

          {order.status === "ready_for_delivery" && (
            <Button onClick={() => onChangeStatus?.(order.id, "delivered")}>
              Mark Delivered
            </Button>
          )}*/}
        </section>
        <StartProductionDialog
          open={startProductionOpen}
          onOpenChange={setStartProductionOpen}
          projectName={items[0]?.product_name_snapshot}
          onConfirm={async (assignedTo, estimatedCompletionDate) => {
            await onChangeStatus?.(order.id, "in_production", {
              assignedTo,
              estimatedCompletionDate,
            })

            setStartProductionOpen(false)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
