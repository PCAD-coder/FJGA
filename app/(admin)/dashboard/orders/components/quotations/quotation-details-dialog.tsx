"use client"
import { useState } from "react"
import { printQuotation } from "@/components/quotations/print-quotation"
import QuotationDocument from "@/components/quotations/quotation-document"
import { FileText, Loader2, Package, User, Wrench, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type {
  QuotationDetail,
  QuotationDetailItem,
} from "../../types/quotation"

interface QuotationDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quotation: QuotationDetail | null
  loading: boolean
  error: string | null
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
  if (!value) return "—"

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function formatDimensions(item: QuotationDetailItem): string {
  const dimensions: string[] = []

  if (item.width !== null) {
    dimensions.push(`W ${item.width}`)
  }

  if (item.height !== null) {
    dimensions.push(`H ${item.height}`)
  }

  if (item.depth !== null) {
    dimensions.push(`D ${item.depth}`)
  }

  if (dimensions.length === 0) {
    return "—"
  }

  return `${dimensions.join(" × ")} ${item.dimensionUnit ?? ""}`.trim()
}

function getStatusVariant(
  status: QuotationDetail["status"]
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "accepted":
      return "default"
    case "sent":
      return "secondary"
    case "declined":
      return "destructive"
    default:
      return "outline"
  }
}

export default function QuotationDetailsDialog({
  open,
  onOpenChange,
  quotation,
  loading,
  error,
}: QuotationDetailsDialogProps) {
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false)

  function handlePrintQuotation() {
  if (!quotation) {
    return
  }

  try {
    printQuotation({
      documentId: "admin-quotation-print",
      quotationNumber:
        quotation.quotationNumber,
    })
  } catch (error) {
    console.error(
      "Failed to print quotation:",
      error
    )
  }
}

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] !max-w-5xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {quotation?.quotationNumber ?? "Quotation Details"}
            </DialogTitle>

            <DialogDescription>
              Review the customer quotation and its internal pricing breakdown.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading quotation...
              </div>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-destructive/50 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : !quotation ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Quotation not found.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header information */}
              <div className="rounded-lg border p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{quotation.projectName}</h3>

                      <Badge variant={getStatusVariant(quotation.status)}>
                        {quotation.status.charAt(0).toUpperCase() +
                          quotation.status.slice(1)}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {quotation.sourceType === "custom_request"
                        ? "Custom Request"
                        : "Catalog"}
                      {quotation.requestNumber
                        ? ` • ${quotation.requestNumber}`
                        : ""}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">
                      Total Amount
                    </p>

                    <p className="text-2xl font-semibold">
                      {formatCurrency(quotation.totalAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex gap-3">
                    <User className="mt-0.5 h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-xs text-muted-foreground">Client</p>
                      <p className="text-sm font-medium">
                        {quotation.clientName}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />

                    <div>
                      <p className="text-xs text-muted-foreground">Quotation</p>
                      <p className="text-sm font-medium">
                        {quotation.quotationNumber}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {formatDate(quotation.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Sent</p>
                    <p className="text-sm font-medium">
                      {formatDate(quotation.sentAt)}
                    </p>
                  </div>
                </div>
              </div>
              {quotation && !loading && !error && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDocumentPreviewOpen(true)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Preview Quotation
                  </Button>
                </div>
              )}
              <Tabs defaultValue="quotation" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="quotation">Quotation</TabsTrigger>

                  <TabsTrigger value="internal">Internal Pricing</TabsTrigger>
                </TabsList>

                {/* ================================= */}
                {/* CLIENT-FACING QUOTATION */}
                {/* ================================= */}

                <TabsContent value="quotation" className="space-y-5">
                  <div className="overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                          <tr className="border-b">
                            <th className="px-4 py-3 text-left font-medium">
                              Item
                            </th>

                            <th className="px-4 py-3 text-left font-medium">
                              Dimensions
                            </th>

                            <th className="px-4 py-3 text-right font-medium">
                              Unit Price
                            </th>

                            <th className="px-4 py-3 text-right font-medium">
                              Qty
                            </th>

                            <th className="px-4 py-3 text-right font-medium">
                              Amount
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {quotation.items.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b last:border-b-0"
                            >
                              <td className="px-4 py-4">
                                <div className="font-medium">
                                  {item.itemName}
                                </div>

                                {item.details && (
                                  <div className="mt-1 max-w-sm text-xs text-muted-foreground">
                                    {item.details}
                                  </div>
                                )}
                              </td>

                              <td className="px-4 py-4 whitespace-nowrap">
                                {formatDimensions(item)}
                              </td>

                              <td className="px-4 py-4 text-right whitespace-nowrap">
                                {formatCurrency(item.unitPrice)}
                              </td>

                              <td className="px-4 py-4 text-right">
                                {item.quantity}
                              </td>

                              <td className="px-4 py-4 text-right font-medium whitespace-nowrap">
                                {formatCurrency(item.lineTotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="w-full space-y-2 sm:max-w-sm">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(quotation.subtotal)}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Delivery Fee
                        </span>
                        <span>{formatCurrency(quotation.deliveryFee)}</span>
                      </div>

                      <div className="flex justify-between border-t pt-2 text-base font-semibold">
                        <span>Total</span>
                        <span>{formatCurrency(quotation.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  {quotation.notes && (
                    <div className="rounded-lg border p-4">
                      <p className="mb-1 text-sm font-medium">Notes</p>

                      <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                        {quotation.notes}
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* ================================= */}
                {/* ADMIN INTERNAL PRICING */}
                {/* ================================= */}

                <TabsContent value="internal" className="space-y-6">
                  {quotation.items.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-5 rounded-lg border p-4"
                    >
                      <div>
                        <h4 className="font-semibold">{item.itemName}</h4>

                        <p className="text-sm text-muted-foreground">
                          Internal pricing for one fabricated unit
                        </p>
                      </div>

                      {/* Materials */}

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <h5 className="font-medium">Materials</h5>
                        </div>

                        <div className="overflow-hidden rounded-lg border">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-muted/50">
                                <tr className="border-b">
                                  <th className="px-3 py-2 text-left font-medium">
                                    Material
                                  </th>
                                  <th className="px-3 py-2 text-right font-medium">
                                    Qty
                                  </th>
                                  <th className="px-3 py-2 text-right font-medium">
                                    Unit Cost
                                  </th>
                                  <th className="px-3 py-2 text-right font-medium">
                                    Markup
                                  </th>
                                  <th className="px-3 py-2 text-right font-medium">
                                    Amount
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {item.materialsSnapshot.map((material) => (
                                  <tr
                                    key={material.material_id}
                                    className="border-b last:border-b-0"
                                  >
                                    <td className="px-3 py-3">
                                      <p className="font-medium">
                                        {material.material_name}
                                      </p>

                                      <p className="text-xs text-muted-foreground">
                                        {[
                                          material.color,
                                          material.series,
                                          material.thickness,
                                        ]
                                          .filter(Boolean)
                                          .join(" • ") || "—"}
                                      </p>
                                    </td>

                                    <td className="px-3 py-3 text-right whitespace-nowrap">
                                      {material.quantity} {material.unit}
                                    </td>

                                    <td className="px-3 py-3 text-right whitespace-nowrap">
                                      {formatCurrency(material.unit_cost)}
                                    </td>

                                    <td className="px-3 py-3 text-right whitespace-nowrap">
                                      {material.markup_percentage}%
                                    </td>

                                    <td className="px-3 py-3 text-right font-medium whitespace-nowrap">
                                      {formatCurrency(material.subtotal)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="flex justify-end text-sm">
                          <span className="text-muted-foreground">
                            Material selling subtotal:{" "}
                          </span>

                          <span className="ml-2 font-medium">
                            {formatCurrency(item.materialSubtotal)}
                          </span>
                        </div>
                      </div>

                      {/* Labor */}

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Wrench className="h-4 w-4" />
                          <h5 className="font-medium">Labor</h5>
                        </div>

                        <div className="overflow-hidden rounded-lg border">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-muted/50">
                                <tr className="border-b">
                                  <th className="px-3 py-2 text-left font-medium">
                                    Service
                                  </th>
                                  <th className="px-3 py-2 text-right font-medium">
                                    Qty
                                  </th>
                                  <th className="px-3 py-2 text-right font-medium">
                                    Labor Cost
                                  </th>
                                  <th className="px-3 py-2 text-right font-medium">
                                    Markup
                                  </th>
                                  <th className="px-3 py-2 text-right font-medium">
                                    Amount
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {item.laborSnapshot.map((labor) => (
                                  <tr
                                    key={labor.service_id}
                                    className="border-b last:border-b-0"
                                  >
                                    <td className="px-3 py-3 font-medium">
                                      {labor.service_name}
                                    </td>

                                    <td className="px-3 py-3 text-right whitespace-nowrap">
                                      {labor.quantity} {labor.unit}
                                    </td>

                                    <td className="px-3 py-3 text-right whitespace-nowrap">
                                      {formatCurrency(labor.labor_cost)}
                                    </td>

                                    <td className="px-3 py-3 text-right whitespace-nowrap">
                                      {labor.markup_percentage}%
                                    </td>

                                    <td className="px-3 py-3 text-right font-medium whitespace-nowrap">
                                      {formatCurrency(labor.subtotal)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="flex justify-end text-sm">
                          <span className="text-muted-foreground">
                            Labor selling subtotal:
                          </span>

                          <span className="ml-2 font-medium">
                            {formatCurrency(item.laborSubtotal)}
                          </span>
                        </div>
                      </div>

                      {/* Internal totals */}

                      <div className="grid gap-3 border-t pt-4 sm:grid-cols-3">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Included Markup
                          </p>

                          <p className="font-medium">
                            {formatCurrency(item.markupAmount)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Selling Price / Unit
                          </p>

                          <p className="font-medium">
                            {formatCurrency(item.unitPrice)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Line Total
                          </p>

                          <p className="font-semibold">
                            {formatCurrency(item.lineTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={documentPreviewOpen} onOpenChange={setDocumentPreviewOpen}>
        <DialogContent className="max-h-[95vh] !max-w-4xl overflow-y-auto bg-muted p-4 sm:p-6">
          <DialogHeader className="shrink-0 border-b bg-transparent px-6 py-4 pr-14">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle>Quotation Preview</DialogTitle>

                {quotation && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {quotation.quotationNumber}
                  </p>
                )}
              </div>

              {quotation && (
                <Button type="button" onClick={handlePrintQuotation}>
                  <Printer className="mr-2 h-4 w-4" />
                  Print / Save as PDF
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-auto p-6">
            {quotation && (
              <div className="mx-auto min-w-max">
                <QuotationDocument
                  quotation={quotation}
                  documentId="admin-quotation-print"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
