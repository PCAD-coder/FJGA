import { CreditCard, QrCode, ShieldCheck, Smartphone } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const methods = [
  {
    id: "card",
    name: "Card",
    description: "Pay securely using a supported debit or credit card.",
    icon: CreditCard,
  },
  {
    id: "gcash",
    name: "GCash",
    description: "Complete your payment using your GCash account.",
    icon: Smartphone,
  },
  {
    id: "qrph",
    name: "QR Ph",
    description: "Pay by scanning a QR Ph code with a supported app.",
    icon: QrCode,
  },
]

export default function PaymentMethods() {
  return (
    <section className="space-y-4 rounded-xl border border-border/80 bg-card p-5 xl:sticky xl:top-6">
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          Payment methods
        </h2>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Choose your preferred payment method after continuing to
          PayMongo&apos;s secure checkout.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
        {methods.map((method) => {
          const Icon = method.icon

          return (
            <Card
              key={method.id}
              className="gap-0 rounded-lg bg-background/40 py-0 shadow-none ring-0"
            >
              <CardContent className="flex items-start gap-3 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-medium">{method.name}</h3>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-start gap-2 border-t pt-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

        <p className="text-xs leading-5 text-muted-foreground">
          Online payments are completed through PayMongo&apos;s secure checkout.
          Your order is updated after payment confirmation.
        </p>
      </div>
    </section>
  )
}
