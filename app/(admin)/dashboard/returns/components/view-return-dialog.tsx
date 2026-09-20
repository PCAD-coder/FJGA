"use client"

import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"

import { ReturnRequest } from "../types/return"

interface ViewReturnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: ReturnRequest | null
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—"

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—"

  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatTime(value: string | null | undefined): string {
  if (!value) return "—"

  const [hours, minutes] = value.split(":")

  if (!hours || !minutes) return value

  const date = new Date()
  date.setHours(Number(hours), Number(minutes), 0, 0)

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

export default function ViewReturnDialog({
  open,
  onOpenChange,
  request,
}: ViewReturnDialogProps) {
  if (!request) return null

  const statusStyles = {
    "under-review": "bg-orange-100 text-orange-700",
    "inspection-scheduled": "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
    resolved: "bg-gray-100 text-gray-700",
  }

  const inspection = request.inspection
  const resolution = request.resolution

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Return Request Details</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
            {/* IMAGE */}
            <div>
              <div className="relative h-[300px] overflow-hidden rounded-lg border">
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

            {/* DETAILS */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Return Title
                </p>
                <p className="font-semibold">{request.title}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-semibold">{request.clientName}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Original Order
                </p>
                <p className="font-semibold">{request.orderNumber}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Product Type
                </p>
                <p className="font-semibold">{request.productType}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Reported Date
                </p>
                <p className="font-semibold">{request.reportedDate}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Original Amount
                </p>
                <p className="text-lg font-semibold">
                  ₱{request.originalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* ISSUE DESCRIPTION */}
            <div>
              <p className="mb-2 font-medium">Issue Description</p>

              <div className="rounded-lg border bg-muted p-4">
                {request.issueDescription}
              </div>
            </div>

            {/* CURRENT STATUS */}
            <div>
              <p className="mb-2 font-medium">Current Status</p>

              <Badge
                className={
                  statusStyles[
                    request.status as keyof typeof statusStyles
                  ]
                }
              >
                {request.status}
              </Badge>
            </div>

            {/* INSPECTION DETAILS */}
            {inspection && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold">
                    Inspection Details
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Inspection information recorded by the assigned staff.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Inspection Date
                    </p>

                    <p className="font-semibold">
                      {formatDate(inspection.inspectionDate)}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Inspection Time
                    </p>

                    <p className="font-semibold">
                      {formatTime(inspection.inspectionTime)}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Assigned Staff
                    </p>

                    <p className="font-semibold">
                      {inspection.assignedStaff || "—"}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Inspection Status
                    </p>

                    <p className="font-semibold capitalize">
                      {inspection.status}
                    </p>
                  </div>

                  {inspection.inspectionResult && (
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">
                        Inspection Result
                      </p>

                      <p className="font-semibold">
                        {inspection.inspectionResult ===
                        "damage_confirmed"
                          ? "Damage Confirmed"
                          : inspection.inspectionResult === "no_issue"
                            ? "No Issue"
                            : "Not Covered"}
                      </p>
                    </div>
                  )}

                  {inspection.damageConfirmed !== null &&
                    inspection.damageConfirmed !== undefined && (
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                          Damage Confirmed
                        </p>

                        <p className="font-semibold">
                          {inspection.damageConfirmed ? "Yes" : "No"}
                        </p>
                      </div>
                    )}
                </div>

                {inspection.inspectionNotes && (
                  <div>
                    <p className="mb-2 font-medium">
                      Inspection Notes
                    </p>

                    <div className="rounded-lg border bg-muted p-4">
                      {inspection.inspectionNotes}
                    </div>
                  </div>
                )}

                {inspection.damageDescription && (
                  <div>
                    <p className="mb-2 font-medium">
                      Damage Description
                    </p>

                    <div className="rounded-lg border bg-muted p-4">
                      {inspection.damageDescription}
                    </div>
                  </div>
                )}

                {inspection.resolutionType && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">
                        Recommended Resolution
                      </p>

                      <p className="font-semibold capitalize">
                        {inspection.resolutionType.replace(
                          "_",
                          " "
                        )}
                      </p>
                    </div>

                    {inspection.completedAt && (
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                          Inspection Completed
                        </p>

                        <p className="font-semibold">
                          {formatDateTime(inspection.completedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {inspection.resolutionNotes && (
                  <div>
                    <p className="mb-2 font-medium">
                      Inspection Resolution Notes
                    </p>

                    <div className="rounded-lg border bg-muted p-4">
                      {inspection.resolutionNotes}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* RESOLUTION DETAILS */}
            {resolution && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold">
                    Resolution Details
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Materials and labor recorded for the approved
                    resolution.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Resolution Type
                    </p>

                    <p className="font-semibold capitalize">
                      {resolution.resolutionType}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Resolution Status
                    </p>

                    <p className="font-semibold capitalize">
                      {resolution.resolutionStatus.replace(
                        "_",
                        " "
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Created
                    </p>

                    <p className="font-semibold">
                      {formatDateTime(resolution.createdAt)}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                      Completed
                    </p>

                    <p className="font-semibold">
                      {formatDateTime(resolution.completedAt)}
                    </p>
                  </div>
                </div>

                {resolution.resolutionNotes && (
                  <div>
                    <p className="mb-2 font-medium">
                      Resolution Notes
                    </p>

                    <div className="rounded-lg border bg-muted p-4">
                      {resolution.resolutionNotes}
                    </div>
                  </div>
                )}

                {/* RESOLUTION ITEMS */}
                {resolution.items.length > 0 && (
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">
                        Resolution Items
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Materials and labor assigned to this
                        resolution.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {resolution.items.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg border p-4"
                        >
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                              <p className="font-semibold">
                                {item.itemType === "material"
                                  ? item.materialName ||
                                    "Material"
                                  : item.laborServiceName ||
                                    "Labor Service"}
                              </p>

                              <p className="text-sm text-muted-foreground">
                                {item.itemType === "material"
                                  ? "Material"
                                  : "Labor"}
                              </p>
                            </div>

                            <Badge variant="outline">
                              Qty: {item.quantity}
                            </Badge>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-md bg-muted p-3">
                              <p className="text-xs text-muted-foreground">
                                Dimensions
                              </p>

                              <p className="font-medium">
                                {item.width ?? "—"} ×{" "}
                                {item.height ?? "—"} ×{" "}
                                {item.depth ?? "—"}{" "}
                                {item.dimensionUnit || ""}
                              </p>
                            </div>

                            <div className="rounded-md bg-muted p-3">
                              <p className="text-xs text-muted-foreground">
                                Item Type
                              </p>

                              <p className="font-medium capitalize">
                                {item.itemType}
                              </p>
                            </div>
                          </div>

                          {item.notes && (
                            <div className="mt-4">
                              <p className="mb-1 text-xs text-muted-foreground">
                                Notes
                              </p>

                              <p className="rounded-md bg-muted p-3 text-sm">
                                {item.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}