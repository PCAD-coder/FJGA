import { Card, CardContent } from "@/components/ui/card"
import { Wallet, CircleCheck, ReceiptText } from "lucide-react"
import { PaymentSummary } from "../types/payment"

interface Props {
  summary: PaymentSummary
}

export default function PaymentSummaryCards({ summary }: Props) {
  const cards = [
    {
      title: "Payment Required",
      value: `\u20B1${summary.totalPending.toLocaleString()}`,
      icon: Wallet,
      iconClass:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    },
    {
      title: "Paid This Month",
      value: `\u20B1${summary.paidThisMonth.toLocaleString()}`,
      icon: CircleCheck,
      iconClass:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    },
    {
      title: "Orders Awaiting Payment",
      value: summary.outstandingInvoices,
      icon: ReceiptText,
      iconClass: "bg-primary/10 text-primary",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card
            key={card.title}
            className="gap-0 rounded-xl border border-border/80 py-0 shadow-none ring-0"
          >
            <CardContent className="flex items-start justify-between gap-3 p-5">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  {card.title}
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight wrap-break-word tabular-nums">
                  {card.value}
                </h2>
              </div>

              <div className={`shrink-0 rounded-xl p-3 ${card.iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
