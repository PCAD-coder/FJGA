import { Invoice } from "../types/payment"
import InvoiceCard from "./invoice-card"

interface Props {
  invoices: Invoice[]
}

export default function PendingInvoices({ invoices }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold">Payments Due</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Payments required before your orders can proceed to production
      </p>

      <div className="mt-2 grid gap-4 lg:grid-cols-2">
        {invoices.map((invoice) => (
          <InvoiceCard key={invoice.invoiceId} invoice={invoice} />
        ))}
      </div>
    </div>
  )
}
