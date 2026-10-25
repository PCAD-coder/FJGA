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
  Play,
} from "lucide-react"

interface Props {
  request: ReturnRequest
  onView: () => void
  onApprove: () => void
  onDecline: () => void
  onSchedule: () => void
  onArchive: () => void
  onCompleteInspection: () => void
  onStartResolution: () => void
  onCompleteResolution: () => void
}

export default function ReturnCard({
  request,
  onView,
  onApprove,
  onDecline,
  onSchedule,
  onArchive,
  onCompleteInspection,
  onStartResolution,
  onCompleteResolution,
}: Props) {
  const statusStyles = {
    "under-review": "bg-orange-100 text-orange-700",

    "inspection-scheduled": "bg-blue-100 text-blue-700",

    approved: "bg-green-100 text-green-700",

    declined: "bg-red-100 text-red-700",

    resolved: "bg-gray-100 text-gray-700",
  }
  const canApprove = request.status === "under-review"

  const canSchedule =
    request.status === "approved" || request.status === "inspection-scheduled"

  const isInspectionScheduled = request.status === "inspection-scheduled"

  const canCompleteInspection = request.status === "inspection-scheduled"

  const canStartResolution =
    request.status === "under-review" &&
    request.resolution?.resolutionStatus === "pending"

  const canCompleteResolution =
    request.status === "under-review" &&
    request.resolution?.resolutionStatus === "in_progress"

  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight wrap-break-word">
              {request.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              Original Order: {request.orderNumber}
            </p>
          </div>

          <Badge
            className={`rounded-full px-2.5 py-1 text-[11px] ${statusStyles[request.status]}`}
          >
            {request.status}
          </Badge>
        </div>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[200px_minmax(0,1fr)]">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
              <Image
                src={request.image}
                alt={request.title}
                fill
                sizes="(max-width: 1024px) 100vw, 200px"
                className="object-cover"
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Damage Evidence Photo
            </p>
          </div>

          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))] gap-4 rounded-lg bg-muted/30 p-3">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>

                <p className="mt-1 text-sm font-medium wrap-break-word">
                  {request.clientName}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date Reported</p>

                <p className="mt-1 text-sm font-medium wrap-break-word">
                  {request.reportedDate}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Product Type</p>

                <p className="mt-1 text-sm font-medium wrap-break-word">
                  {request.productType}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Original Amount</p>

                <p className="mt-1 text-sm font-medium wrap-break-word">
                  ₱{request.originalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Issue Description</p>

              <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-sm leading-6 wrap-break-word">
                {request.issueDescription}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border/60 pt-3 [&>button]:h-9 [&>button]:rounded-lg [&>button]:text-xs">
              <Button variant="outline" onClick={onView}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>

              {canApprove && (
                <Button onClick={onApprove}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve Request
                </Button>
              )}

              {canApprove && (
                <Button variant="destructive" onClick={onDecline}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline Request
                </Button>
              )}

              {canSchedule && (
                <Button variant="outline" onClick={onSchedule}>
                  <Calendar className="mr-2 h-4 w-4" />

                  {isInspectionScheduled
                    ? "Reschedule Inspection"
                    : "Schedule Inspection"}
                </Button>
              )}
              {canCompleteInspection && (
                <Button onClick={onCompleteInspection}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete Inspection
                </Button>
              )}
              {canStartResolution && (
                <Button onClick={onStartResolution}>
                  <Play className="mr-2 h-4 w-4" />
                  Start Resolution
                </Button>
              )}

              {canCompleteResolution && (
                <Button onClick={onCompleteResolution}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Complete Resolution
                </Button>
              )}

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
