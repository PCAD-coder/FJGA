"use client"

import {
  CalendarDays,
  FileText,
  Package,
  User,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"

import type {
  QuotationListItem,
  QuotationStatus,
} from "../../types/custom-order"

interface QuotationCardProps {
  quotation: QuotationListItem
  onView?: () => void
}

function getStatusLabel(
  status: QuotationStatus
): string {
  switch (status) {
    case "draft":
      return "Draft"

    case "sent":
      return "Sent"

    case "accepted":
      return "Accepted"

    case "declined":
      return "Declined"

    default:
      return status
  }
}

function getStatusVariant(
  status: QuotationStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "accepted":
      return "default"

    case "sent":
      return "secondary"

    case "declined":
      return "destructive"

    case "draft":
    default:
      return "outline"
  }
}

function getSourceLabel(
  sourceType: QuotationListItem["sourceType"]
): string {
  return sourceType === "custom_request"
    ? "Custom Request"
    : "Catalog"
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(value: string | null): string {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function getRelevantDate(
  quotation: QuotationListItem
): {
  label: string
  value: string
} {
  switch (quotation.status) {
    case "accepted":
      return {
        label: "Accepted",
        value: formatDate(quotation.acceptedAt),
      }

    case "declined":
      return {
        label: "Declined",
        value: formatDate(quotation.declinedAt),
      }

    case "sent":
      return {
        label: "Sent",
        value: formatDate(quotation.sentAt),
      }

    case "draft":
    default:
      return {
        label: "Created",
        value: formatDate(quotation.createdAt),
      }
  }
}

export default function QuotationCard({
  quotation,
  onView,
}: QuotationCardProps) {
  const relevantDate = getRelevantDate(quotation)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">
                {quotation.quotationNumber}
              </span>

              <Badge
                variant={getStatusVariant(
                  quotation.status
                )}
              >
                {getStatusLabel(quotation.status)}
              </Badge>
            </div>

            <h3 className="truncate text-lg font-semibold">
              {quotation.projectName}
            </h3>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs text-muted-foreground">
              Quotation Total
            </p>

            <p className="text-xl font-semibold">
              {formatCurrency(
                quotation.totalAmount
              )}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Client
              </p>

              <p className="truncate text-sm font-medium">
                {quotation.clientName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Package className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Source
              </p>

              <p className="text-sm font-medium">
                {getSourceLabel(
                  quotation.sourceType
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Request
              </p>

              <p className="text-sm font-medium">
                {quotation.requestNumber ?? "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {relevantDate.label}
              </p>

              <p className="text-sm font-medium">
                {relevantDate.value}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 border-t pt-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Subtotal
            </p>

            <p className="text-sm font-medium">
              {formatCurrency(
                quotation.subtotal
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Delivery Fee
            </p>

            <p className="text-sm font-medium">
              {formatCurrency(
                quotation.deliveryFee
              )}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Total
            </p>

            <p className="text-sm font-semibold">
              {formatCurrency(
                quotation.totalAmount
              )}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-end border-t bg-muted/20 px-6 py-4">
        <Button
          type="button"
          variant="outline"
          onClick={onView}
          disabled={!onView}
        >
          <FileText className="mr-2 h-4 w-4" />
          View Quotation
        </Button>
      </CardFooter>
    </Card>
  )
}