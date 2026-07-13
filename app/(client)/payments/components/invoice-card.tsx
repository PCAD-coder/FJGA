import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Invoice } from "../types/payment";
import PaymentDialog from "./payment-dialog";

interface Props {
  invoice: Invoice;
}

export default function InvoiceCard({ invoice }: Props) {
  return (
    <Card>
      <CardContent className="space-y-6 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Invoice
            </p>

            <h3 className="text-xl font-bold">
              {invoice.invoiceId}
            </h3>
          </div>

          <Badge variant="destructive">
            {invoice.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <span className="text-muted-foreground">
            Order ID
          </span>
          <span className="text-right">
            {invoice.orderId}
          </span>

          <span className="text-muted-foreground">
            Product
          </span>
          <span className="text-right">
            {invoice.productName}
          </span>

          <span className="text-muted-foreground">
            Due Date
          </span>
          <span className="text-right text-red-500">
            {invoice.dueDate}
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Amount Due
            </span>

            <span className="text-3xl font-bold">
              ₱{invoice.amountDue.toLocaleString()}
            </span>
          </div>
        </div>

        <PaymentDialog invoice={invoice} />
      </CardContent>
    </Card>
  );
}