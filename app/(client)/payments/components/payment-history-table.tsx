import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PaymentHistory } from "../types/payment";

interface Props {
  history: PaymentHistory[];
}

export default function PaymentHistoryTable({
  history,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Payment History
      </h2>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {history.map((payment) => (
              <TableRow key={payment.paymentId}>
                <TableCell>{payment.paymentId}</TableCell>
                <TableCell>{payment.invoiceId}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>
                  ₱{payment.amount.toLocaleString()}
                </TableCell>
                <TableCell>{payment.paymentDate}</TableCell>
                <TableCell>{payment.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}