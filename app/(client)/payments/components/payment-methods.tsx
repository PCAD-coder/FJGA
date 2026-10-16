import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react"

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
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">
          Available Online Payment Methods
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Choose your preferred payment method after continuing to
          PayMongo&apos;s secure checkout.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {methods.map((method) => {
          const Icon = method.icon

          return (
            <Card key={method.id}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-medium">
                    {method.name}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

        <p className="text-sm text-muted-foreground">
          Online payments are completed through PayMongo&apos;s secure
          checkout. Your order is updated after payment confirmation.
        </p>
      </div>
    </section>
  )
}