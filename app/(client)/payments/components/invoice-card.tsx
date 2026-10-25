import { CalendarDays, Package } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import type { Invoice } from "../types/payment"
import PaymentDialog from "./payment-dialog"

interface Props {
  invoice: Invoice
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function InvoiceCard({ invoice }: Props) {
  return (
    <Card className="h-full gap-0 rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Order Payment
            </p>

            <h3 className="mt-1 text-sm font-semibold tracking-tight wrap-break-word">
              {invoice.invoiceId}
            </h3>
          </div>

          <Badge
            variant="outline"
            className="shrink-0 rounded-full border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400"
          >
            Payment Required
          </Badge>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Product</p>
              <p className="text-sm leading-5 font-medium wrap-break-word">
                {invoice.productName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">Payment Due</p>
              <p className="text-xs font-medium">{invoice.dueDate}</p>
            </div>
          </div>
        </div>

        <div className="my-4 border-t border-border/60" />

        <div className="mb-4 rounded-lg border border-primary/10 bg-primary/5 p-4">
          <div className="flex flex-col-reverse gap-3">
            <div>
              <p className="text-xs font-medium">Required before production</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Complete the required 50% payment to begin production.
              </p>
            </div>

            <div className="shrink-0">
              <p className="text-xs text-muted-foreground">Amount Due</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
                {formatCurrency(invoice.amountDue)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-1">
          <PaymentDialog invoice={invoice} />
        </div>
      </CardContent>
    </Card>
  )
}
