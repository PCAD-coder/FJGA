"use client"

import Image from "next/image"

import { ReturnRequest } from "../types/return"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  CheckCircle2,
  Calendar,
  Archive,
  Eye,
  XCircle,
} from "lucide-react"

interface Props {
  request: ReturnRequest

  onView: () => void

  onApprove: () => void

  onDecline: () => void

  onSchedule: () => void

  onArchive: () => void
}

export default function ReturnCard({
  request,
  onView,
  onApprove,
  onDecline,
  onSchedule,
  onArchive,
}: Props) {
  const statusStyles = {
  "under-review":
    "bg-orange-100 text-orange-700",

  "inspection-scheduled":
    "bg-blue-100 text-blue-700",

  approved:
    "bg-green-100 text-green-700",

  declined:
    "bg-red-100 text-red-700",

  resolved:
    "bg-gray-100 text-gray-700",
}

  return (
    <Card>
      <CardContent className="p-5">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{request.title}</h3>

            <p className="text-sm text-muted-foreground">
              Original Order: {request.orderNumber}
            </p>
          </div>

          <Badge className={statusStyles[request.status]}>
            {request.status}
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-[340px_1fr]">
          <div>
            <div className="relative h-[250px] overflow-hidden rounded-lg border">
              <Image
                src={request.image}
                alt={request.title}
                fill
                className="object-cover"
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Damage Evidence Photo
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>

                <p className="font-medium">{request.clientName}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date Reported</p>

                <p className="font-medium">{request.reportedDate}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Product Type</p>

                <p className="font-medium">{request.productType}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Original Amount</p>

                <p className="font-medium">
                  ₱{request.originalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Issue Description</p>

              <div className="rounded-md bg-muted p-3 text-sm">
                {request.issueDescription}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={onView}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>

              <Button onClick={onApprove}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve Repair
              </Button>

              <Button variant="destructive" onClick={onDecline}>
                <XCircle className="mr-2 h-4 w-4" />
                Decline Request
              </Button>

              <Button variant="outline" onClick={onSchedule}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Inspection
              </Button>

              <Button variant="outline" onClick={onArchive}>
                <Archive className="mr-2 h-4 w-4" />
                Archive Request
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
