import { Invoice } from "../types/payment";
import InvoiceCard from "./invoice-card";

interface Props {
  invoices: Invoice[];
}

export default function PendingInvoices({
  invoices,
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">
        Pending Invoices
      </h2>

      <div className="grid gap-4 lg:grid-cols-2">
        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.invoiceId}
            invoice={invoice}
          />
        ))}
      </div>
    </div>
  );
}