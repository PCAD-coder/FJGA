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
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Order Payment
            </p>

            <h3 className="mt-1 text-lg font-semibold">
              {invoice.invoiceId}
            </h3>
          </div>

          <Badge variant="destructive" className="shrink-0">
            Payment Required
          </Badge>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-start gap-3">
            <Package className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                Product
              </p>
              <p className="truncate text-sm font-medium">
                {invoice.productName}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Payment Due
              </p>
              <p className="text-sm font-medium">
                {invoice.dueDate}
              </p>
            </div>
          </div>
        </div>

        <div className="my-5 border-t" />

        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                Required before production
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Complete the required 50% payment to begin production.
              </p>
            </div>

            <div className="shrink-0 sm:text-right">
              <p className="text-xs text-muted-foreground">
                Amount Due
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(invoice.amountDue)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <PaymentDialog invoice={invoice} />
        </div>
      </CardContent>
    </Card>
  )
}