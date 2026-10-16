import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { PaymentHistory } from "../types/payment"

interface Props {
  history: PaymentHistory[]
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function getStatusVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "paid":
    case "completed":
    case "verified":
      return "default"

    case "failed":
    case "rejected":
      return "destructive"

    case "pending":
      return "secondary"

    default:
      return "outline"
  }
}

export default function PaymentHistoryTable({ history }: Props) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Payment History</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Review payments recorded for your orders
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-28 text-center">
                  <div>
                    <p className="text-sm font-medium">
                      No payment history yet
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Completed payments will appear here.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              history.map((payment) => (
                <TableRow key={payment.paymentId}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {payment.orderNumber}
                  </TableCell>

                  <TableCell>
                    <span
                      className="block max-w-[220px] truncate"
                      title={payment.referenceNumber ?? undefined}
                    >
                      {payment.referenceNumber || "—"}
                    </span>
                  </TableCell>

                  <TableCell>{payment.method}</TableCell>

                  <TableCell className="font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {payment.paymentDate}
                  </TableCell>

                  <TableCell>
                    <Badge variant={getStatusVariant(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
