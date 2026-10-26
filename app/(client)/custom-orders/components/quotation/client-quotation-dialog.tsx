"use client"

import { toast } from "sonner"
import { useState, useEffect } from "react"
import QuotationDocument from "@/components/quotations/quotation-document"
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Loader2,
  Printer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { printQuotation } from "@/components/quotations/print-quotation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  acceptQuotation,
  declineQuotation,
  getClientQuotationById,
  getQuotationHistoryForCustomRequest,
} from "../../services/custom-order-quotation.service"

import type { ClientQuotationSummary } from "../../types/custom-order-request"

import type {
  ClientQuotationDetail,
  ClientQuotationItem,
} from "../../types/custom-order-request"

interface ClientQuotationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  quotation: ClientQuotationDetail | null
  loading: boolean
  error: string | null

  onQuotationChanged?: () => void | Promise<void>
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

function formatDimensions(item: ClientQuotationItem): string {
  const values: string[] = []

  if (item.width !== null) {
    values.push(`W ${item.width}`)
  }

  if (item.height !== null) {
    values.push(`H ${item.height}`)
  }

  if (item.depth !== null) {
    values.push(`D ${item.depth}`)
  }

  if (values.length === 0) {
    return "—"
  }

  return `${values.join(" × ")} ${item.dimensionUnit ?? ""}`.trim()
}

function getStatusVariant(
  status: ClientQuotationDetail["status"]
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

function getStatusLabel(status: ClientQuotationDetail["status"]): string {
  switch (status) {
    case "sent":
      return "Awaiting Your Decision"

    case "accepted":
      return "Accepted"

    case "declined":
      return "Declined"

    default:
      return "Draft"
  }
}

export default function ClientQuotationDialog({
  open,
  onOpenChange,
  quotation,
  loading,
  error,
  onQuotationChanged,
}: ClientQuotationDialogProps) {
  function handlePrintQuotation() {
    if (!quotation) {
      return
    }

    try {
      printQuotation({
        documentId: "client-quotation-print",
        quotationNumber: quotation.quotationNumber,
      })
    } catch (error) {
      console.error("Failed to print quotation:", error)
    }
  }

  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false)

  const [declineDialogOpen, setDeclineDialogOpen] = useState(false)

  const [isDeclining, setIsDeclining] = useState(false)

  const [declineError, setDeclineError] = useState<string | null>(null)

  const [isAccepting, setIsAccepting] = useState(false)

  const [acceptError, setAcceptError] = useState<string | null>(null)

  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false)

  const [quotationHistory, setQuotationHistory] = useState<
    ClientQuotationSummary[]
  >([])

  const [historyLoading, setHistoryLoading] = useState(false)

  const previousQuotations = quotationHistory.filter(
    (item) => item.id !== quotation?.id
  )

  const [historicalQuotation, setHistoricalQuotation] =
    useState<ClientQuotationDetail | null>(null)

  const [loadingHistoricalQuotationId, setLoadingHistoricalQuotationId] =
    useState<string | null>(null)

  async function handleViewHistoricalQuotation(quotationId: string) {
    try {
      setLoadingHistoricalQuotationId(quotationId)

      const detail = await getClientQuotationById(quotationId)

      setHistoricalQuotation(detail)
    } catch (error) {
      console.error("Failed to load historical quotation:", error)
    } finally {
      setLoadingHistoricalQuotationId(null)
    }
  }

  useEffect(() => {
    if (!open || !quotation?.customRequestId) {
      setQuotationHistory([])
      return
    }

    const customRequestId = quotation.customRequestId

    let cancelled = false

    async function loadHistory() {
      try {
        setHistoryLoading(true)

        const history =
          await getQuotationHistoryForCustomRequest(customRequestId)

        if (!cancelled) {
          setQuotationHistory(history)
        }
      } catch (error) {
        console.error("Failed to load quotation history:", error)

        if (!cancelled) {
          setQuotationHistory([])
        }
      } finally {
        if (!cancelled) {
          setHistoryLoading(false)
        }
      }
    }

    void loadHistory()

    return () => {
      cancelled = true
    }
  }, [open, quotation?.customRequestId])

  async function handleDeclineQuotation() {
    if (!quotation) {
      return
    }

    try {
      setIsDeclining(true)
      setDeclineError(null)

      await declineQuotation(quotation.id)
      toast.success("Quotation declined.")

      setDeclineDialogOpen(false)
      onOpenChange(false)

      await onQuotationChanged?.()
    } catch (error) {
      console.error("Failed to decline quotation:", error)
      toast.error(
        error instanceof Error ? error.message : "Unable to decline quotation."
      )

      setDeclineError(
        error instanceof Error ? error.message : "Failed to decline quotation."
      )
    } finally {
      setIsDeclining(false)
    }
  }

  async function handleAcceptQuotation() {
    if (!quotation) {
      return
    }

    try {
      setIsAccepting(true)
      setAcceptError(null)

      const result = await acceptQuotation(quotation.id)

      toast.success("Quotation accepted. You can find your order in My Orders.")
      console.log("Quotation accepted:", result)

      setAcceptDialogOpen(false)
      onOpenChange(false)

      await onQuotationChanged?.()
    } catch (error) {
      console.error("Failed to accept quotation:", error)
      toast.error(
        error instanceof Error ? error.message : "Unable to accept quotation."
      )

      setAcceptError(
        error instanceof Error ? error.message : "Failed to accept quotation."
      )
    } finally {
      setIsAccepting(false)
    }
  }
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] !max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {quotation?.quotationNumber ?? "Quotation"}
            </DialogTitle>

            <DialogDescription>
              Review the quotation prepared by FJ Glass and Aluminum.
            </DialogDescription>
          </DialogHeader>

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
              <div className="rounded-lg border p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {quotation.projectName}
                      </h3>

                      <Badge variant={getStatusVariant(quotation.status)}>
                        {getStatusLabel(quotation.status)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />

                      <span>{quotation.quotationNumber}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />

                      <span>Sent {formatDate(quotation.sentAt)}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-muted-foreground">
                      Quotation Total
                    </p>

                    <p className="text-2xl font-semibold">
                      {formatCurrency(quotation.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {quotation.customerAddressSnapshot && (
                <div className="rounded-lg border p-4">
                  <p className="mb-1 text-sm font-medium">Project Address</p>

                  <p className="text-sm text-muted-foreground">
                    {quotation.customerAddressSnapshot}
                  </p>
                </div>
              )}

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
                        <tr key={item.id} className="border-b last:border-b-0">
                          <td className="px-4 py-4">
                            <p className="font-medium">{item.itemName}</p>

                            {item.details && (
                              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                {item.details}
                              </p>
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
                      VAT ({quotation.vatRate}%)
                    </span>

                    <span>{formatCurrency(quotation.vatAmount)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>

                    <span>{formatCurrency(quotation.deliveryFee)}</span>
                  </div>

                  <div className="flex justify-between border-t pt-3 text-base font-semibold">
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
              {(historyLoading || previousQuotations.length > 0) && (
                <div className="rounded-lg border p-4">
                  <div className="mb-3">
                    <h3 className="font-medium">Quotation History</h3>

                    <p className="text-sm text-muted-foreground">
                      Previous quotations for this custom request.
                    </p>
                  </div>

                  {historyLoading ? (
                    <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading quotation history...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {previousQuotations.map((historyItem) => (
                        <div
                          key={historyItem.id}
                          className="flex items-center justify-between gap-4 rounded-md border p-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {historyItem.quotationNumber}
                              </span>

                              <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground capitalize">
                                {historyItem.status}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                              {historyItem.sentAt
                                ? new Date(
                                    historyItem.sentAt
                                  ).toLocaleDateString("en-PH", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Not sent"}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-medium">
                                {new Intl.NumberFormat("en-PH", {
                                  style: "currency",
                                  currency: "PHP",
                                }).format(historyItem.totalAmount)}
                              </p>
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={loadingHistoricalQuotationId !== null}
                              onClick={() =>
                                void handleViewHistoricalQuotation(
                                  historyItem.id
                                )
                              }
                            >
                              {loadingHistoricalQuotationId ===
                              historyItem.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Loading...
                                </>
                              ) : (
                                "View"
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {quotation.status === "sent" && (
                <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                  <div>
                    <p className="text-sm font-medium">Ready to proceed?</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Accepting this quotation will confirm the quoted project
                      and create your order.
                    </p>
                  </div>

                  {acceptError && (
                    <div className="rounded-md border border-destructive/50 p-3 text-sm text-destructive">
                      {acceptError}
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDeclineError(null)
                        setDeclineDialogOpen(true)
                      }}
                    >
                      Decline Quotation
                    </Button>

                    <Button
                      type="button"
                      onClick={() => {
                        setAcceptError(null)
                        setAcceptDialogOpen(true)
                      }}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Accept Quotation
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={declineDialogOpen}
        onOpenChange={(nextOpen) => {
          if (!isDeclining) {
            setDeclineDialogOpen(nextOpen)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline this quotation?</AlertDialogTitle>

            <AlertDialogDescription>
              You are declining{" "}
              <span className="font-medium text-foreground">
                {quotation?.quotationNumber}
              </span>
              . The quotation will be returned to FJ Glass and Aluminum for
              review and possible revision.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {declineError && (
            <div className="rounded-md border border-destructive/50 p-3 text-sm text-destructive">
              {declineError}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeclining}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={isDeclining || !quotation}
              onClick={(event) => {
                event.preventDefault()

                void handleDeclineQuotation()
              }}
            >
              {isDeclining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Declining...
                </>
              ) : (
                "Confirm Decline"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={acceptDialogOpen}
        onOpenChange={(nextOpen) => {
          if (!isAccepting) {
            setAcceptDialogOpen(nextOpen)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept this quotation?</AlertDialogTitle>

            <AlertDialogDescription>
              You are accepting{" "}
              <span className="font-medium text-foreground">
                {quotation?.quotationNumber}
              </span>{" "}
              for{" "}
              <span className="font-medium text-foreground">
                {quotation ? formatCurrency(quotation.totalAmount) : ""}
              </span>
              . This will confirm the quotation and create an actual order for
              this project.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {acceptError && (
            <div className="rounded-md border border-destructive/50 p-3 text-sm text-destructive">
              {acceptError}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isAccepting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={isAccepting || !quotation}
              onClick={(event) => {
                event.preventDefault()

                void handleAcceptQuotation()
              }}
            >
              {isAccepting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Confirm Acceptance
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

          {/* Scrollable Document Area */}
          <div className="min-h-0 flex-1 overflow-auto p-6">
            {quotation && (
              <div className="mx-auto min-w-max">
                <QuotationDocument
                  quotation={quotation}
                  documentId="client-quotation-print"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={historicalQuotation !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setHistoricalQuotation(null)
          }
        }}
      >
        <DialogContent className="max-h-[95vh] !max-w-4xl overflow-y-auto bg-muted p-4 sm:p-6">
          <DialogHeader className="shrink-0 border-b bg-transparent px-6 py-4 pr-14">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle>Previous Quotation</DialogTitle>

                {historicalQuotation && (
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {historicalQuotation.quotationNumber}
                    </p>

                    <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground capitalize">
                      {historicalQuotation.status}
                    </span>
                  </div>
                )}
              </div>

              {historicalQuotation && (
                <Button
                  type="button"
                  onClick={() => {
                    try {
                      printQuotation({
                        documentId: "historical-quotation-print",
                        quotationNumber: historicalQuotation.quotationNumber,
                      })
                    } catch (error) {
                      console.error(
                        "Failed to print historical quotation:",
                        error
                      )
                    }
                  }}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print / Save as PDF
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-auto p-6">
            {historicalQuotation && (
              <div className="mx-auto min-w-max">
                <QuotationDocument
                  quotation={historicalQuotation}
                  documentId="historical-quotation-print"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
