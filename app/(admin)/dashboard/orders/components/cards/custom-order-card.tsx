"use client"

import Image from "next/image"
import { Eye } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import type { CustomOrder } from "../../types/custom-order"

interface Props {
  order: CustomOrder
  onView: () => void
}

const statusStyles: Record<CustomOrder["status"], string> = {
  pending: "border-yellow-200 bg-yellow-100 text-yellow-700",
  quoted: "border-blue-200 bg-blue-100 text-blue-700",
  approved: "border-green-200 bg-green-100 text-green-700",
  denied: "border-red-200 bg-red-100 text-red-700",
}

const statusLabels: Record<CustomOrder["status"], string> = {
  pending: "Pending Review",
  quoted: "Quoted",
  approved: "Accepted",
  denied: "Denied",
}

function formatCategory(category: string | null) {
  if (!category) return "Not specified"

  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatDimensions(order: CustomOrder) {
  const unit = order.dimensionUnit ?? ""

  const dimensions = [order.width, order.height, order.depth].filter(
    (value): value is number => value !== null
  )

  if (dimensions.length === 0) {
    return "Not specified"
  }

  return `${dimensions.join(" \u00D7 ")}${unit ? ` ${unit}` : ""}`
}

export default function CustomOrderCard({ order, onView }: Props) {
  const primaryImage = order.images[0]?.signedUrl

  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">
                {order.requestNumber ?? "Custom Request"}
              </h3>

              <Badge variant="outline" className={statusStyles[order.status]}>
                {statusLabels[order.status]}
              </Badge>
            </div>

            <p className="mt-1 font-medium">{order.projectName}</p>

            <p className="text-sm text-muted-foreground">
              Client: {order.clientName}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("en-PH", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-[220px_1fr_auto] md:items-center">
          <div className="relative h-36 overflow-hidden rounded-lg border bg-muted">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={order.projectName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
                No reference image
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="font-medium">
                {formatCategory(order.productCategory)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Quantity</p>
              <p className="font-medium">{order.quantity}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Dimensions</p>
              <p className="font-medium">{formatDimensions(order)}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">References</p>
              <p className="font-medium">{order.images.length}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Description</p>

              <p className="line-clamp-2 text-sm">
                {order.description || "No project description provided."}
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={onView} className="md:self-center">
            <Eye className="mr-2 h-4 w-4" />
            View Request
          </Button>
        </div>

        {order.status === "denied" && order.denialReason && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <span className="font-medium">Denial reason:</span>{" "}
            {order.denialReason}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
