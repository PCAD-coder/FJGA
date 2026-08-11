"use client"

import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

import { Eye, CheckCircle2, XCircle } from "lucide-react"

import { CustomOrder } from "../../types/custom-order"

interface Props {
  order: CustomOrder

  onView: () => void

  onApprove: () => void

  onDeny: () => void

  onGeneratedQuote: () => void
}

export default function CustomOrderCard({
  order,
  onView,
  onApprove,
  onDeny,
  onGeneratedQuote,
}: Props) {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    quoted: "bg-blue-100 text-blue-700 border-blue-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    denied: "bg-red-100 text-red-700 border-red-200",
  }

  return (
    <Card>
      <CardContent className="p-5">
        {/* Header */}

        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{order.projectName}</h3>

            <p className="text-sm text-muted-foreground">
              Client: {order.clientName}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">{order.submittedAt}</p>
        </div>

        {/* Content */}

        <div className="grid gap-5 md:grid-cols-[320px_1fr]">
          {/* Image */}

          <div>
            <div className="relative h-[250px] w-full overflow-hidden rounded-lg border">
              <Image
                src={order.image ?? "null"}
                alt={order.projectName}
                fill
                className="object-cover"
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Reference Design Image
            </p>
          </div>

          {/* Details */}

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Dimensions</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Width</p>

                  <p className="font-semibold">{order.width} ft</p>
                </div>

                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs text-muted-foreground">Height</p>

                  <p className="font-semibold">{order.height} ft</p>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Client Notes</p>

              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">{order.notes}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Status:</span>

              <Badge className={statusStyles[order.status]}>
                {order.status}
              </Badge>
            </div>

            {order.status === "denied" && order.denialReason && (
              <div>
                <p className="mb-1 text-sm font-medium">Denial Reason</p>

                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {order.denialReason}
                </div>
              </div>
            )}

            {/* Actions */}

            <div className="flex flex-wrap gap-3 pt-2">
              {order.status === "pending" && (
                <>
                  <Button variant="secondary" onClick={onGeneratedQuote}>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Quote
                  </Button>

                  <Button variant="outline" onClick={onView}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>

                  <Button variant="destructive" onClick={onDeny}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Deny
                  </Button>
                </>
              )}
              {order.status === "quoted" && (
                <>
                  <Button onClick={onApprove}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve & Move to Production
                  </Button>

                  <Button variant="outline" onClick={onView}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </>
              )}

              {order.status !== "pending" && (
                <Button variant="outline" onClick={onView}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
