import { Card, CardContent } from "@/components/ui/card";
import { Wallet, CircleCheck, CreditCard } from "lucide-react";
import { PaymentSummary } from "../types/payment";

interface Props {
  summary: PaymentSummary;
}

export default function PaymentSummaryCards({
  summary,
}: Props) {
  const cards = [
    {
      title: "Total Pending",
      value: `₱${summary.totalPending.toLocaleString()}`,
      icon: Wallet,
      iconClass:
        "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
    },
    {
      title: "Paid This Month",
      value: `₱${summary.paidThisMonth.toLocaleString()}`,
      icon: CircleCheck,
      iconClass:
        "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      title: "Outstanding Invoices",
      value: summary.outstandingInvoices,
      icon: CreditCard,
      iconClass:
        "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {card.value}
                </h2>
              </div>

              <div className={`rounded-full p-3 ${card.iconClass}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}