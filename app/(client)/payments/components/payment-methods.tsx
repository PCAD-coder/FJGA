import { Card, CardContent } from "@/components/ui/card";
import { Building2, CreditCard, Wallet } from "lucide-react";

const methods = [
  {
    id: "1",
    name: "GCash",
    description: "Pay instantly using GCash.",
    icon: Wallet,
  },
  {
    id: "2",
    name: "Bank Transfer",
    description: "Transfer via bank account.",
    icon: Building2,
  },
  {
    id: "3",
    name: "Cash on Delivery",
    description: "Pay upon delivery.",
    icon: CreditCard,
  },
];

export default function PaymentMethods() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Payment Methods
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {methods.map((method) => {
          const Icon = method.icon;

          return (
            <Card key={method.id}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-muted p-3">
                  <Icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {method.name}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}