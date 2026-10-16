import {
  FileImage,
  Info,
  MapPin,
  Package,
  Pencil,
  Ruler,
  Sparkles,
} from "lucide-react"

import type { DeliveryAddressInput } from "@/types/delivery-address"

import type { DeliveryZoneResult } from "@/app/services/delivery/delivery-zone-service"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type {
  ProductCategory,
  ProjectDetailsData,
} from "./project-details-step"
import type { DesignReferenceData } from "./design-reference-step"
import type { SpecificationsData } from "./specifications-step"

interface ReviewStepProps {
  projectDetails: ProjectDetailsData
  designReference: DesignReferenceData
  specifications: SpecificationsData
  contactNumber: string
  deliveryAddress: DeliveryAddressInput
  deliveryZone: DeliveryZoneResult
  onEdit: (step: number) => void
}

const categoryLabels: Record<ProductCategory, string> = {
  window: "Window",
  door: "Door",
  railing: "Railing",
  partition: "Partition",
  table: "Table",
  chair: "Chair",
  other: "Other",
}

const specificationLabels: Record<string, string> = {
  windowType: "Window Type",
  panelCount: "Number of Panels",

  doorType: "Door Type",
  openingDirection: "Opening Direction",

  railingType: "Railing Type",
  installationArea: "Installation Area",

  partitionType: "Partition Type",
  primaryUse: "Primary Use",

  tableShape: "Table Shape",

  chairType: "Chair Type",
}

const specificationValueLabels: Record<string, string> = {
  sliding: "Sliding",
  casement: "Casement",
  awning: "Awning",
  fixed: "Fixed",
  swing: "Swing",
  bifold: "Bi-fold",

  left: "Left",
  right: "Right",
  both: "Double / Both",

  glass: "Glass Railing",
  aluminum: "Aluminum Railing",
  "glass-aluminum": "Glass with Aluminum Frame",

  stairs: "Stairs",
  balcony: "Balcony",
  terrace: "Terrace",

  folding: "Folding",

  office: "Office",
  residential: "Residential",
  commercial: "Commercial",

  rectangular: "Rectangular",
  square: "Square",
  round: "Round",
  custom: "Custom / Based on Reference",

  dining: "Dining Chair",
  stool: "Stool",

  other: "Other / Based on Reference",
  unsure: "Not Sure",

  "1": "1 Panel",
  "2": "2 Panels",
  "3": "3 Panels",
  "4": "4 Panels",
  "5+": "5 or More Panels",
}

const frameLabels: Record<string, string> = {
  "black-798": "Black 798 Series Aluminum",
  "brown-798": "Brown 798 Series Aluminum",
  "white-aluminum": "White Aluminum",
  "analok-aluminum": "Analok Aluminum",
}

const glassLabels: Record<string, string> = {
  "clear-6mm": "6mm Clear Glass",
  "bronze-6mm": "6mm Bronze Glass",
  "reflective-6mm": "6mm Reflective Glass",
  "tempered-6mm": "6mm Clear Tempered Glass",
}

const finishLabels: Record<string, string> = {
  black: "Black",
  brown: "Brown",
  white: "White",
  analok: "Analok",
}

export function ReviewStep({
  projectDetails,
  designReference,
  specifications,
  contactNumber,
  deliveryAddress,
  deliveryZone,
  onEdit,
}: ReviewStepProps) {
  const dynamicSpecifications = Object.entries(
    specifications.specifications
  ).filter(([, value]) => Boolean(value))

  const streetAddress = [
    deliveryAddress.houseBuildingNumber,
    deliveryAddress.street,
    deliveryAddress.buildingSubdivision,
    deliveryAddress.unitFloor,
  ]
    .filter(Boolean)
    .join(", ")

  const localityAddress = [
    deliveryAddress.barangayName,
    deliveryAddress.cityName,
    deliveryAddress.provinceName,
    deliveryAddress.regionName,
  ]
    .filter(Boolean)
    .join(", ")

  const postalAddress = deliveryAddress.postalCode
    ? `Postal Code ${deliveryAddress.postalCode}`
    : ""

  const formattedDeliveryAddress = [
    streetAddress,
    localityAddress,
    postalAddress,
  ]
    .filter(Boolean)
    .join("\n")

  const formattedDeliveryFee = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(deliveryZone.deliveryFee)

  return (
    <div className="space-y-6">
      {/* RFQ Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
          <Info className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="font-semibold">Review your custom request</p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            This is a request for quotation, not a confirmed order. FJGA will
            review your design, dimensions, specifications, material
            preferences, and delivery location before preparing the official
            quotation.
          </p>
        </div>
      </div>

      {/* Project Details */}
      <ReviewCard
        icon={Package}
        title="Project Details"
        onEdit={() => onEdit(1)}
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ReviewField
            label="Project Name"
            value={projectDetails.projectName}
          />

          <ReviewField
            label="Category"
            value={
              projectDetails.category
                ? categoryLabels[projectDetails.category]
                : "-"
            }
          />

          <ReviewField
            label="Quantity"
            value={`${projectDetails.quantity} ${
              projectDetails.quantity === 1 ? "unit" : "units"
            }`}
          />
        </div>

        <div className="mt-5 border-t pt-5">
          <ReviewField
            label="Project Description"
            value={projectDetails.description}
          />
        </div>
      </ReviewCard>
      {/* Delivery Information */}
      <ReviewCard
        icon={MapPin}
        title="Delivery Information"
        onEdit={() => onEdit(4)}
      >
        <div className="space-y-1">
  <p className="text-sm text-muted-foreground">
    Contact Number
  </p>
  <p className="font-medium">
    {contactNumber || "Not provided"}
  </p>
</div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2">
            <ReviewField
              label="Delivery Address"
              value={formattedDeliveryAddress}
            />
          </div>

          <ReviewField label="Delivery Zone" value={deliveryZone.zoneName} />

          <ReviewField
            label="Estimated Delivery Fee"
            value={formattedDeliveryFee}
          />

          {deliveryAddress.landmark && (
            <ReviewField label="Landmark" value={deliveryAddress.landmark} />
          )}
        </div>

        <div className="mt-5 border-t pt-4">
          <p className="text-xs leading-5 text-muted-foreground">
            The delivery fee shown here is based on your selected delivery area.
            FJGA will confirm the applicable delivery fee when preparing your
            official quotation.
          </p>
        </div>
      </ReviewCard>

      {/* Design References */}
      <ReviewCard
        icon={FileImage}
        title="Design References"
        onEdit={() => onEdit(2)}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {designReference.images.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
            >
              <img
                src={image.previewUrl}
                alt={`Reference ${index + 1}`}
                className="h-full w-full object-cover"
              />

              <div className="absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-1 text-xs font-medium shadow-sm backdrop-blur-sm">
                Reference {index + 1}
              </div>
            </div>
          ))}
        </div>

        {designReference.notes && (
          <div className="mt-5 border-t pt-5">
            <ReviewField
              label="Reference Notes"
              value={designReference.notes}
            />
          </div>
        )}
      </ReviewCard>

      {/* Dimensions */}
      <ReviewCard
        icon={Ruler}
        title="Dimensions & Specifications"
        onEdit={() => onEdit(3)}
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ReviewField
            label="Width"
            value={`${specifications.width} ${specifications.dimensionUnit}`}
          />

          <ReviewField
            label="Height"
            value={`${specifications.height} ${specifications.dimensionUnit}`}
          />

          <ReviewField
            label="Depth"
            value={
              specifications.depth
                ? `${specifications.depth} ${specifications.dimensionUnit}`
                : "Not provided"
            }
          />

          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Measurement Status
            </p>

            <div className="mt-2">
              {specifications.measurementsApproximate ? (
                <Badge variant="secondary">Approximate</Badge>
              ) : (
                <Badge variant="outline">Provided Measurement</Badge>
              )}
            </div>
          </div>
        </div>

        {dynamicSpecifications.length > 0 && (
          <div className="mt-5 border-t pt-5">
            <p className="mb-4 text-sm font-semibold">Product Specifications</p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dynamicSpecifications.map(([key, value]) => (
                <ReviewField
                  key={key}
                  label={specificationLabels[key] ?? key}
                  value={specificationValueLabels[value] ?? value}
                />
              ))}
            </div>
          </div>
        )}
      </ReviewCard>

      {/* Material Preferences */}
      <ReviewCard
        icon={Sparkles}
        title="Material Preferences"
        onEdit={() => onEdit(3)}
      >
        {specifications.letFjgaRecommend ? (
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="font-medium">FJGA Recommendation Requested</p>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              You asked FJGA to recommend suitable materials based on the
              design, intended use, and quotation.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <ReviewField
              label="Preferred Frame / Aluminum"
              value={
                specifications.preferredFrame
                  ? (frameLabels[specifications.preferredFrame] ??
                    specifications.preferredFrame)
                  : "No preference"
              }
            />

            <ReviewField
              label="Preferred Glass"
              value={
                specifications.preferredGlass
                  ? (glassLabels[specifications.preferredGlass] ??
                    specifications.preferredGlass)
                  : "No preference"
              }
            />

            <ReviewField
              label="Preferred Finish / Color"
              value={
                specifications.preferredFinish
                  ? (finishLabels[specifications.preferredFinish] ??
                    specifications.preferredFinish)
                  : "No preference"
              }
            />
          </div>
        )}

        {specifications.otherPreferences && (
          <div className="mt-5 border-t pt-5">
            <ReviewField
              label="Other Preferences"
              value={specifications.otherPreferences}
            />
          </div>
        )}
      </ReviewCard>

      {/* What Happens Next */}
      <div className="rounded-xl border bg-muted/20 p-5">
        <h3 className="font-semibold">What happens after you submit?</h3>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <NextStep
            number="1"
            title="FJGA reviews your request"
            description="The team checks your design, dimensions, requested specifications, and delivery location."
          />

          <NextStep
            number="2"
            title="Quotation is prepared"
            description="FJGA determines the actual materials, labor, and pricing required."
          />

          <NextStep
            number="3"
            title="You review the quotation"
            description="The project only becomes an order after the quotation is accepted."
          />
        </div>
      </div>
    </div>
  )
}

function ReviewCard({
  icon: Icon,
  title,
  onEdit,
  children,
}: {
  icon: React.ComponentType<{
    className?: string
  }>
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>

          <CardTitle className="text-base">{title}</CardTitle>
        </div>

        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  )
}

function ReviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>

      <p className="mt-1 text-sm leading-6 font-medium whitespace-pre-wrap">
        {value || "-"}
      </p>
    </div>
  )
}

function NextStep({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {number}
      </div>

      <div>
        <p className="text-sm font-semibold">{title}</p>

        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
