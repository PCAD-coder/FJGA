"use client"

import { getQuotationForCustomRequest } from "../../services/custom-order-quotation.service"
import {
  CalendarDays,
  FileText,
  ImageIcon,
  Loader2,
  Package,
  Ruler,
  Settings2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

import type {
  CustomOrderRequestDetail,
  CustomOrderRequestStatus,
} from "../../types/custom-order-request"
import { Button } from "@/components/ui/button"

interface CustomOrderDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: CustomOrderRequestDetail | null
  isLoading: boolean
}

const statusConfig: Record<
  CustomOrderRequestStatus,
  {
    label: string
    className: string
  }
> = {
  pending: {
    label: "Pending Review",
    className: "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50",
  },
  quoted: {
    label: "Quote Ready",
    className: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50",
  },
  approved: {
    label: "Accepted",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50",
  },
  denied: {
    label: "Denied",
    className: "border-red-200 bg-red-50 text-red-700 hover:bg-red-50",
  },
}

const specificationLabels: Record<string, string> = {
  windowType: "Window Type",
  panelCount: "Panel Count",

  doorType: "Door Type",
  openingDirection: "Opening Direction",

  railingType: "Railing Type",
  installationArea: "Installation Area",

  partitionType: "Partition Type",
  primaryUse: "Primary Use",

  tableShape: "Table Shape",
  chairType: "Chair Type",
}

const preferenceLabels: Record<string, string> = {
  "black-798": "Black 798 Series Aluminum",
  "brown-798": "Brown 798 Series Aluminum",
  "white-aluminum": "White Aluminum",
  "analok-aluminum": "Analok Aluminum",

  "clear-6mm": "6mm Clear Glass",
  "bronze-6mm": "6mm Bronze Glass",
  "reflective-6mm": "6mm Reflective Glass",
  "tempered-6mm": "6mm Clear Tempered Glass",

  black: "Black",
  brown: "Brown",
  white: "White",
  analok: "Analok",
}

function formatCategory(category: string | null) {
  if (!category) return "Custom Product"

  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

function formatValue(value: string) {
  return (
    preferenceLabels[value] ??
    value
      .replace(/_/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase())
  )
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

function DetailItem({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>

      <div className="text-sm font-medium">{value}</div>
    </div>
  )
}

export function CustomOrderDetailsDialog({
  open,
  onOpenChange,
  request,
  isLoading,
}: CustomOrderDetailsDialogProps) {
  const status = request ? statusConfig[request.status] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="text-xl">
              {isLoading
                ? "Loading Request"
                : (request?.project_name ?? "Custom Order Details")}
            </DialogTitle>

            {status && (
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
            )}
          </div>

          <DialogDescription>
            {isLoading
              ? "Retrieving your custom project request."
              : (request?.request_number ?? "Custom Request")}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />

              <p className="text-sm">Loading request details...</p>
            </div>
          </div>
        ) : request ? (
          <div className="space-y-6">
            {/* Project Information */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <h3 className="font-semibold">Project Information</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Category"
                  value={formatCategory(request.product_category)}
                />

                <DetailItem label="Quantity" value={request.quantity} />

                <DetailItem
                  label="Submitted"
                  value={
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      {formatDate(request.created_at)}
                    </span>
                  }
                />
              </div>

              <DetailItem
                label="Project Description"
                value={
                  request.description || (
                    <span className="text-muted-foreground">
                      No description provided
                    </span>
                  )
                }
              />
            </section>

            <Separator />

            {/* Dimensions */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                <h3 className="font-semibold">Dimensions</h3>

                {request.measurements_approximate && (
                  <Badge variant="secondary">Approximate</Badge>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <DetailItem
                  label="Width"
                  value={
                    request.width != null
                      ? `${request.width} ${request.dimension_unit ?? ""}`
                      : "Not specified"
                  }
                />

                <DetailItem
                  label="Height"
                  value={
                    request.height != null
                      ? `${request.height} ${request.dimension_unit ?? ""}`
                      : "Not specified"
                  }
                />

                <DetailItem
                  label="Depth"
                  value={
                    request.depth != null
                      ? `${request.depth} ${request.dimension_unit ?? ""}`
                      : "Not specified"
                  }
                />
              </div>
            </section>

            <Separator />

            {/* Product Specifications */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                <h3 className="font-semibold">Product Specifications</h3>
              </div>

              {Object.keys(request.specifications).length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {Object.entries(request.specifications).map(
                    ([key, value]) => (
                      <DetailItem
                        key={key}
                        label={specificationLabels[key] ?? formatValue(key)}
                        value={formatValue(value)}
                      />
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No additional specifications provided.
                </p>
              )}
            </section>

            <Separator />

            {/* Material Preferences */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <h3 className="font-semibold">Material Preferences</h3>
              </div>

              {request.let_fjga_recommend ? (
                <div className="rounded-lg border bg-muted/40 p-4">
                  <p className="text-sm">
                    FJGA was asked to recommend the appropriate materials for
                    this project.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  <DetailItem
                    label="Frame"
                    value={
                      request.preferred_frame
                        ? formatValue(request.preferred_frame)
                        : "No preference"
                    }
                  />

                  <DetailItem
                    label="Glass"
                    value={
                      request.preferred_glass
                        ? formatValue(request.preferred_glass)
                        : "No preference"
                    }
                  />

                  <DetailItem
                    label="Finish"
                    value={
                      request.preferred_finish
                        ? formatValue(request.preferred_finish)
                        : "No preference"
                    }
                  />
                </div>
              )}

              {request.other_preferences && (
                <DetailItem
                  label="Other Preferences"
                  value={request.other_preferences}
                />
              )}
            </section>

            <Separator />

            {/* Design References */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <h3 className="font-semibold">Design References</h3>
              </div>

              {request.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {request.images.map((image) => (
                    <div
                      key={image.id}
                      className="aspect-square overflow-hidden rounded-lg border bg-muted"
                    >
                      {image.signed_url ? (
                        <img
                          src={image.signed_url}
                          alt={`${request.project_name} reference`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="mx-auto mb-2 h-6 w-6" />
                    <p className="text-sm">No reference images uploaded</p>
                  </div>
                </div>
              )}

              {request.reference_notes && (
                <DetailItem
                  label="Reference Notes"
                  value={request.reference_notes}
                />
              )}
            </section>
            
{request.status === "quoted" && (
  <Button
    type="button"
    variant="outline"
    onClick={async () => {
      try {
        const quotation =
          await getQuotationForCustomRequest(
            request.id
          )

        console.log(
          "Client quotation:",
          quotation
        )
      } catch (error) {
        console.error(
          "Failed to load quotation:",
          error
        )
      }
    }}
  >
    Test Quotation
  </Button>
)}
            {/* Denial reason only when applicable */}
            {request.status === "denied" && request.denial_reason && (
              <>
                <Separator />

                <section className="space-y-2">
                  <h3 className="font-semibold text-destructive">
                    Request Denied
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {request.denial_reason}
                  </p>
                </section>
              </>
            )}
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Request details are unavailable.
            </p>
          </div>
        )}
        
      </DialogContent>
      
    </Dialog>
    
  )
}
