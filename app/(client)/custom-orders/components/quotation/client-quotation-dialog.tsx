"use client"
import { useState } from "react"
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

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

import { acceptQuotation } from "../../services/custom-order-quotation.service"
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

  onAccepted?: () => void | Promise<void>
}

function formatCurrency(
  value: number
): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(
  value: string | null
): string {
  if (!value) return "—"

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function formatDimensions(
  item: ClientQuotationItem
): string {
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

  return `${values.join(" × ")} ${
    item.dimensionUnit ?? ""
  }`.trim()
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

function getStatusLabel(
  status: ClientQuotationDetail["status"]
): string {
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
  onAccepted,
}: ClientQuotationDialogProps) {

    const [
  acceptDialogOpen,
  setAcceptDialogOpen,
] = useState(false)

const [isAccepting, setIsAccepting] =
  useState(false)

const [acceptError, setAcceptError] =
  useState<string | null>(null)

  async function handleAcceptQuotation() {
  if (!quotation) {
    return
  }

  try {
    setIsAccepting(true)
    setAcceptError(null)

    const result = await acceptQuotation(
      quotation.id
    )

    console.log(
      "Quotation accepted:",
      result
    )

    setAcceptDialogOpen(false)
    onOpenChange(false)

    await onAccepted?.()
  } catch (error) {
    console.error(
      "Failed to accept quotation:",
      error
    )

    setAcceptError(
      error instanceof Error
        ? error.message
        : "Failed to accept quotation."
    )
  } finally {
    setIsAccepting(false)
  }
}
  return (
  <>
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] !max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {quotation?.quotationNumber ??
              "Quotation"}
          </DialogTitle>

          <DialogDescription>
            Review the quotation prepared by
            FJ Glass and Aluminum.
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
            <div className="rounded-lg border p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {quotation.projectName}
                    </h3>

                    <Badge
                      variant={getStatusVariant(
                        quotation.status
                      )}
                    >
                      {getStatusLabel(
                        quotation.status
                      )}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />

                    <span>
                      {
                        quotation.quotationNumber
                      }
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />

                    <span>
                      Sent{" "}
                      {formatDate(
                        quotation.sentAt
                      )}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-muted-foreground">
                    Quotation Total
                  </p>

                  <p className="text-2xl font-semibold">
                    {formatCurrency(
                      quotation.totalAmount
                    )}
                  </p>
                </div>
              </div>
            </div>

            {quotation.customerAddressSnapshot && (
              <div className="rounded-lg border p-4">
                <p className="mb-1 text-sm font-medium">
                  Project Address
                </p>

                <p className="text-sm text-muted-foreground">
                  {
                    quotation.customerAddressSnapshot
                  }
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
                    {quotation.items.map(
                      (item) => (
                        <tr
                          key={item.id}
                          className="border-b last:border-b-0"
                        >
                          <td className="px-4 py-4">
                            <p className="font-medium">
                              {item.itemName}
                            </p>

                            {item.details && (
                              <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                {item.details}
                              </p>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4">
                            {formatDimensions(
                              item
                            )}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-right">
                            {formatCurrency(
                              item.unitPrice
                            )}
                          </td>

                          <td className="px-4 py-4 text-right">
                            {item.quantity}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-right font-medium">
                            {formatCurrency(
                              item.lineTotal
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full space-y-2 sm:max-w-sm">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Subtotal
                  </span>

                  <span>
                    {formatCurrency(
                      quotation.subtotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Delivery Fee
                  </span>

                  <span>
                    {formatCurrency(
                      quotation.deliveryFee
                    )}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-3 text-base font-semibold">
                  <span>Total</span>

                  <span>
                    {formatCurrency(
                      quotation.totalAmount
                    )}
                  </span>
                </div>
              </div>
            </div>

            {quotation.notes && (
              <div className="rounded-lg border p-4">
                <p className="mb-1 text-sm font-medium">
                  Notes
                </p>

                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {quotation.notes}
                </p>
              </div>
            )}

            {quotation.status === "sent" && (
  <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
    <div>
      <p className="text-sm font-medium">
        Ready to proceed?
      </p>

      <p className="mt-1 text-sm text-muted-foreground">
        Accepting this quotation will
        confirm the quoted project and
        create your order.
      </p>
    </div>

    {acceptError && (
      <div className="rounded-md border border-destructive/50 p-3 text-sm text-destructive">
        {acceptError}
      </div>
    )}

    <div className="flex justify-end">
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
      open={acceptDialogOpen}
      onOpenChange={(nextOpen) => {
        if (!isAccepting) {
          setAcceptDialogOpen(nextOpen)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Accept this quotation?
          </AlertDialogTitle>

          <AlertDialogDescription>
            You are accepting{" "}
            <span className="font-medium text-foreground">
              {quotation?.quotationNumber}
            </span>{" "}
            for{" "}
            <span className="font-medium text-foreground">
              {quotation
                ? formatCurrency(
                    quotation.totalAmount
                  )
                : ""}
            </span>
            . This will confirm the
            quotation and create an
            actual order for this
            project.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {acceptError && (
          <div className="rounded-md border border-destructive/50 p-3 text-sm text-destructive">
            {acceptError}
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isAccepting}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={
              isAccepting || !quotation
            }
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
  </>
)
}