"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import type { SalesRecord } from "../types/sales"
import { Button } from "@/components/ui/button"

interface SaleDetailsDialogProps {
  sale: SalesRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  formatDate: (value: string | null) => string
  formatCurrency: (value: number) => string
  getPaymentMethodLabel: (paymentMethod: SalesRecord["paymentMethod"]) => string
  getPaymentStatusBadge: (
    status: SalesRecord["paymentStatus"]
  ) => React.ReactNode
  onRecordPayment: () => void
}

export function SaleDetailsDialog({
  sale,
  open,
  onOpenChange,
  formatDate,
  formatCurrency,
  getPaymentMethodLabel,
  getPaymentStatusBadge,
  onRecordPayment,
}: SaleDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] !max-w-2xl flex-col overflow-hidden p-0">
        {sale && (
          <>
            {/* HEADER */}
            <DialogHeader className="shrink-0 px-6 pt-6">
              <DialogTitle>Sale Details — {sale.orderNumber}</DialogTitle>

              <DialogDescription>
                View order and payment information.
              </DialogDescription>
            </DialogHeader>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto px-6 py-2">
              <div className="space-y-4">
                {/* ORDER INFORMATION */}

                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 font-semibold">Order Information</h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Order Number
                      </p>

                      <p className="font-medium">{sale.orderNumber}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Order Date
                      </p>

                      <p className="font-medium">
                        {formatDate(sale.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Customer</p>

                      <p className="font-medium">{sale.customerName}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Contact Number
                      </p>

                      <p className="font-medium">{sale.contactNumber ?? "—"}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Order Type
                      </p>

                      <p className="font-medium capitalize">{sale.orderType}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Order Status
                      </p>

                      <p className="font-medium capitalize">
                        {sale.orderStatus.replaceAll("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PAYMENT SUMMARY */}

                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 font-semibold">Payment Summary</h3>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total Amount
                      </p>

                      <p className="text-lg font-semibold">
                        {formatCurrency(sale.totalAmount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Amount Paid
                      </p>

                      <p className="text-lg font-semibold">
                        {formatCurrency(sale.amountPaid)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Outstanding
                      </p>

                      <p className="text-lg font-semibold">
                        {formatCurrency(sale.balance)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>

                      <div className="mt-1">
                        {getPaymentStatusBadge(sale.paymentStatus)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Selected Payment Method
                      </p>

                      <p className="font-medium">
                        {getPaymentMethodLabel(sale.paymentMethod)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Last Payment
                      </p>

                      <p className="font-medium">
                        {formatDate(sale.lastPaymentDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Next Payment Due
                      </p>

                      <p className="font-medium">
                        {formatDate(sale.nextPaymentDue)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PRODUCTION PAYMENT */}

                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">
                      Production Payment
                    </span>

                    {sale.productionPaymentComplete ? (
                      <Badge variant="default">
                        50% Paid — Production Can Start
                      </Badge>
                    ) : (
                      <Badge variant="destructive">50% Payment Required</Badge>
                    )}
                  </div>

                  {!sale.productionPaymentComplete && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatCurrency(sale.downPaymentRemaining)} remaining
                      before production can begin.
                    </p>
                  )}
                </div>

                {/* PAYMENT HISTORY */}

                <div className="rounded-lg border p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">Payment History</h3>

                    <span className="text-sm text-muted-foreground">
                      {sale.payments.length} payment
                      {sale.payments.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {sale.payments.length === 0 ? (
                    <div className="rounded-md border border-dashed p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        No payments have been recorded for this order.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Reference Details</TableHead>
                            <TableHead>Next Due</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {sale.payments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                {formatDate(payment.paymentDate)}
                              </TableCell>

                              <TableCell className="font-medium">
                                {formatCurrency(payment.amount)}
                              </TableCell>

                              <TableCell>
                                {getPaymentMethodLabel(payment.paymentMethod)}
                              </TableCell>

                              <TableCell>
                                {payment.paymentMethod === "cash_on_delivery"
                                  ? (payment.receivedByEmployee ?? "—")
                                  : (payment.referenceNumber ?? "—")}
                              </TableCell>

                              <TableCell>
                                {formatDate(payment.nextPaymentDue)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* STICKY / FIXED FOOTER */}
            <div className="shrink-0 px-6 py-4">
              <div className="flex justify-end gap-2">
                <Button
                  onClick={onRecordPayment}
                  disabled={!sale || sale.balance <= 0}
                >
                  Record Payment
                </Button>

                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
