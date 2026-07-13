import PaymentHeader from "./components/payment-header";
import PaymentSummaryCards from "./components/payment-summary-cards";
import PaymentMethods from "./components/payment-methods";
import PaymentHistoryTable from "./components/payment-history-table";
import PendingInvoices from "./components/pending-invoices";

export default async function PaymentsPage() {
  const summary = {
    totalPending: 73500,
    paidThisMonth: 38000,
    outstandingInvoices: 2,
  };

  const invoices = [
    {
      invoiceId: "INV-2026-001",
      orderId: "ORD-2026-001",
      productName: "Glass Office Partition",
      dueDate: "2026-04-10",
      amountDue: 45000,
      status: "Pending" as const,
    },
    {
      invoiceId: "INV-2026-002",
      orderId: "ORD-2026-003",
      productName: "Glass Dining Table",
      dueDate: "2026-04-08",
      amountDue: 28500,
      status: "Pending" as const,
    },
  ];

  const history = [
    {
      paymentId: "PAY-001",
      invoiceId: "INV-2026-000",
      amount: 15000,
      method: "GCash",
      paymentDate: "2026-03-15",
      status: "Completed"as const,
    },
    {
      paymentId: "PAY-002",
      invoiceId: "INV-2026-004",
      amount: 23000,
      method: "Bank Transfer",
      paymentDate: "2026-03-20",
      status: "Completed" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <PaymentHeader />

      <PaymentSummaryCards summary={summary} />

      <PendingInvoices invoices={invoices} />

      <PaymentMethods />

      <PaymentHistoryTable history={history} />
    </div>
  );
}