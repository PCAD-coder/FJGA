import { Invoice } from "../types/payment"
import InvoiceCard from "./invoice-card"

interface Props {
  invoices: Invoice[]
}

export default function PendingInvoices({ invoices }: Props) {
  return (
    <section className="min-w-0">
      <h2 className="text-lg font-semibold tracking-tight">Payments Due</h2>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">
        Payments required before your orders can proceed to production
      </p>

      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
        {invoices.map((invoice) => (
          <InvoiceCard key={invoice.invoiceId} invoice={invoice} />
        ))}
      </div>
    </section>
  )
}
