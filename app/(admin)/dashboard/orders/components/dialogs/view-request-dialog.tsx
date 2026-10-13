"use client"

import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { FileText, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import type { CustomOrder } from "../../types/custom-order"

interface Props {
  order: CustomOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void

  onCreateQuotation?: () => void
  onDeny?: () => void
}

const statusStyles: Record<CustomOrder["status"], string> = {
  pending:
    "border-yellow-200 bg-yellow-100 text-yellow-700",
  quoted:
    "border-blue-200 bg-blue-100 text-blue-700",
  approved:
    "border-green-200 bg-green-100 text-green-700",
  denied:
    "border-red-200 bg-red-100 text-red-700",
}

const statusLabels: Record<CustomOrder["status"], string> = {
  pending: "Pending Review",
  quoted: "Quoted",
  approved: "Accepted",
  denied: "Denied",
}

const preferenceLabels: Record<string, string> = {
  "black-798": "Black 798 Series Aluminum",
  "brown-798": "Brown 798 Series Aluminum",
  "white-aluminum": "White Aluminum",
  "analok-aluminum": "Analok Aluminum",

  "clear-6mm": "Clear 6mm Glass",
  "bronze-6mm": "Bronze 6mm Glass",
  "reflective-6mm": "Reflective 6mm Glass",
  "tempered-6mm": "Tempered 6mm Glass",

  black: "Black",
  brown: "Brown",
  white: "White",
  analok: "Analok",
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

function formatLabel(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}

function getPreferenceLabel(value: string | null) {
  if (!value) return "Not specified"

  return preferenceLabels[value] ?? formatLabel(value)
}

function formatCategory(category: string | null) {
  if (!category) return "Not specified"

  return formatLabel(category)
}

function formatDimensions(order: CustomOrder) {
  const unit = order.dimensionUnit ?? ""

  const dimensions = [
    order.width,
    order.height,
    order.depth,
  ].filter(
    (value): value is number => value !== null
  )

  if (dimensions.length === 0) {
    return "Not specified"
  }

  return `${dimensions.join(" × ")}${unit ? ` ${unit}` : ""}`
}

export default function ViewRequestDialog({
  order,
  open,
  onOpenChange,
  onCreateQuotation,
  onDeny,
}: Props) {
  if (!order) return null

  const specificationEntries = Object.entries(
    order.specifications
  ).filter(
    ([, value]) =>
      typeof value === "string" &&
      value.trim().length > 0
  )

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle>
              {order.requestNumber ?? order.projectName}
            </DialogTitle>

            <Badge
              variant="outline"
              className={statusStyles[order.status]}
            >
              {statusLabels[order.status]}
            </Badge>
          </div>

          <DialogDescription>
            Review the customer's project details,
            specifications, preferences, and design
            references.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section className="space-y-3">
            <h3 className="font-semibold">
              Project Information
            </h3>

            <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoItem
                label="Project"
                value={order.projectName}
              />

              <InfoItem
                label="Client"
                value={order.clientName}
              />

              <InfoItem
                label="Category"
                value={formatCategory(
                  order.productCategory
                )}
              />

              <InfoItem
                label="Quantity"
                value={String(order.quantity)}
              />
            </div>

            <div className="rounded-lg border p-4">
              <p className="mb-1 text-sm font-medium">
                Project Description
              </p>

              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {order.description ||
                  "No project description provided."}
              </p>
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="font-semibold">
              Dimensions
            </h3>

            <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
              <InfoItem
                label="Measurements"
                value={formatDimensions(order)}
              />

              <InfoItem
                label="Measurement Type"
                value={
                  order.measurementsApproximate
                    ? "Approximate"
                    : "Provided measurements"
                }
              />
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <h3 className="font-semibold">
              Product Specifications
            </h3>

            {specificationEntries.length > 0 ? (
              <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                {specificationEntries.map(
                  ([key, value]) => (
                    <InfoItem
                      key={key}
                      label={
                        specificationLabels[key] ??
                        formatLabel(key)
                      }
                      value={formatLabel(value)}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                No additional product specifications
                provided.
              </div>
            )}
          </section>

          <Separator />

          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">
                Client Material Preferences
              </h3>

              <p className="text-sm text-muted-foreground">
                These are customer preferences only. The
                actual materials used in the quotation will
                be selected by FJGA.
              </p>
            </div>

            {order.letFjgaRecommend ? (
              <div className="rounded-lg border p-4">
                <p className="font-medium">
                  Let FJGA recommend materials
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  The customer requested FJGA to recommend
                  the appropriate materials and finish.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-3">
                <InfoItem
                  label="Preferred Frame"
                  value={getPreferenceLabel(
                    order.preferredFrame
                  )}
                />

                <InfoItem
                  label="Preferred Glass"
                  value={getPreferenceLabel(
                    order.preferredGlass
                  )}
                />

                <InfoItem
                  label="Preferred Finish"
                  value={getPreferenceLabel(
                    order.preferredFinish
                  )}
                />
              </div>
            )}

            {order.otherPreferences && (
              <div className="rounded-lg border p-4">
                <p className="mb-1 text-sm font-medium">
                  Other Preferences
                </p>

                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {order.otherPreferences}
                </p>
              </div>
            )}
          </section>

          <Separator />

          <section className="space-y-3">
            <div>
              <h3 className="font-semibold">
                Design References
              </h3>

              <p className="text-sm text-muted-foreground">
                {order.images.length} reference
                {order.images.length === 1 ? "" : "s"}{" "}
                uploaded
              </p>
            </div>

            {order.images.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {order.images.map((image, index) => (
                  <div
                    key={image.id}
                    className="relative aspect-video overflow-hidden rounded-lg border bg-muted"
                  >
                    {image.signedUrl ? (
                      <Image
                        src={image.signedUrl}
                        alt={`Design reference ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
                        Image unavailable
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                No design references uploaded.
              </div>
            )}

            {order.referenceNotes && (
              <div className="rounded-lg border p-4">
                <p className="mb-1 text-sm font-medium">
                  Reference Notes
                </p>

                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {order.referenceNotes}
                </p>
              </div>
            )}
          </section>

          {order.status === "denied" &&
            order.denialReason && (
              <>
                <Separator />

                <section className="space-y-2">
                  <h3 className="font-semibold">
                    Denial Reason
                  </h3>

                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {order.denialReason}
                  </div>
                </section>
              </>
            )}
        </div>
        {order.status === "pending" && (
  <DialogFooter className="border-t pt-4">
    <Button
      type="button"
      variant="destructive"
      onClick={onDeny}
    >
      <XCircle className="mr-2 h-4 w-4" />
      Deny Request
    </Button>

    <Button
      type="button"
      onClick={onCreateQuotation}
    >
      <FileText className="mr-2 h-4 w-4" />
      Create Quotation
    </Button>
  </DialogFooter>
)}
      </DialogContent>
    </Dialog>
  )
}

interface InfoItemProps {
  label: string
  value: string
}

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>
    </div>
  )
}