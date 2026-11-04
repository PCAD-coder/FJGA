"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { OnSiteTransaction } from "../types/on-site-sales"
import {
  formatOnSiteCurrency,
  formatOnSiteDate,
  formatOnSitePaymentMethod,
} from "../utils/on-site-sales"
import { OnSitePaymentBadge } from "./on-site-payment-badge"

interface Props {
  transaction: OnSiteTransaction | null
  onClose: () => void
}

export function OnSiteSaleDetailsDialog({ transaction, onClose }: Props) {
  return (
    <Dialog
      open={!!transaction}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>On-Site Service Transaction</DialogTitle>
          <DialogDescription>
            Recorded service charges and payment information. All times are
            Philippine time (Asia/Manila).
          </DialogDescription>
        </DialogHeader>
        {transaction && (
          <div className="space-y-5">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              {[
                ["Visit Number", transaction.visitNumber || "—"],
                ["Customer", transaction.customerName],
                ["Service Name", transaction.serviceName || "—"],
                ["Request Date", formatOnSiteDate(transaction.createdAt)],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="mt-1 font-medium wrap-break-word">{value}</dd>
                </div>
              ))}
            </dl>
            
<section className="rounded-lg border p-4">
  <h3 className="mb-3 font-semibold">Service Breakdown</h3>

  <dl className="space-y-3 text-sm">
    {(() => {
      const serviceFee = transaction.serviceFee ?? 0
      const travelFee = transaction.travelFee ?? 0
      const totalFee = transaction.totalFee ?? 0

      // VAT is already included in the saved total.
      // Older transactions without VAT should remain unchanged.
      const vatAmount = Math.round(
        (totalFee - serviceFee - travelFee) * 100
      ) / 100

      const hasVat = vatAmount > 0.005

      const breakdown = [
        ["Service Fee", transaction.serviceFee],
        ...(hasVat
          ? [["VAT (12% - Measurement Service)", vatAmount] as const]
          : []),
        ["Travel Fee", transaction.travelFee],
        ["Total Amount", transaction.totalFee],
      ] as const

      return breakdown.map(([label, value]) => (
        <div
          key={label}
          className="flex justify-between gap-4 last:border-t last:pt-3 last:font-semibold"
        >
          <dt>{label}</dt>
          <dd className="tabular-nums">
            {formatOnSiteCurrency(value)}
          </dd>
        </div>
      ))
    })()}
  </dl>
</section>

            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Payment Status</dt>
                <dd className="mt-1">
                  <OnSitePaymentBadge status={transaction.paymentStatus} />
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Payment Date</dt>
                <dd className="mt-1">{formatOnSiteDate(transaction.paidAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Payment Method</dt>
                <dd className="mt-1">
                  {formatOnSitePaymentMethod(transaction.paymentMethod)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Received By</dt>
                <dd className="mt-1 wrap-break-word">
                  {transaction.paymentReceivedBy || "—"}
                </dd>
              </div>
            </dl>
            <p className="text-xs leading-5 text-muted-foreground">
              Only confirmed paid transactions count toward collected service
              revenue. Visit completion alone does not confirm payment.
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
