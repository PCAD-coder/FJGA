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
    <section className="min-w-0 overflow-hidden rounded-xl border border-border/80 bg-card">
      <div className="border-b px-5 py-5">
        <h2 className="text-lg font-semibold tracking-tight">
          Payment History
        </h2>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Review payments recorded for your orders
        </p>
      </div>

      <div className="overflow-hidden">
        <Table className="min-w-[760px]">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="h-11 px-5 text-xs font-medium">
                Order
              </TableHead>
              <TableHead className="h-11 px-5 text-xs font-medium">
                Reference
              </TableHead>
              <TableHead className="h-11 px-5 text-xs font-medium">
                Method
              </TableHead>
              <TableHead className="h-11 px-5 text-xs font-medium">
                Amount
              </TableHead>
              <TableHead className="h-11 px-5 text-xs font-medium">
                Date
              </TableHead>
              <TableHead className="h-11 px-5 text-xs font-medium">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-36 text-center">
                  <div>
                    <p className="text-sm font-medium">
                      No payment history yet
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Completed payments will appear here.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              history.map((payment) => (
                <TableRow key={payment.paymentId}>
                  <TableCell className="px-5 py-4 text-xs font-medium whitespace-nowrap">
                    {payment.orderNumber}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-xs">
                    <span
                      className="block max-w-[220px] truncate"
                      title={payment.referenceNumber ?? undefined}
                    >
                      {payment.referenceNumber || "\u2014"}
                    </span>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-xs">
                    {payment.method}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm font-semibold tabular-nums">
                    {formatCurrency(payment.amount)}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-xs whitespace-nowrap">
                    {payment.paymentDate}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-xs">
                    <Badge
                      variant={getStatusVariant(payment.status)}
                      className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                    >
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
