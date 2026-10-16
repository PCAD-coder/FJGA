import { LucideIcon } from "lucide-react";

export interface PaymentSummary {
  totalPending: number;
  paidThisMonth: number;
  outstandingInvoices: number;
}

export interface Invoice {
  invoiceId: string
  orderId: string
  orderNumber: string
  productName: string
  dueDate: string
  amountDue: number
  status: "Pending" | "Partial" | "Paid" | "Overdue"
}
export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface PaymentHistory {
  paymentId: string
  orderNumber: string
  referenceNumber: string | null
  amount: number
  method: string
  paymentDate: string
  paymentDateRaw: string
  status: "Completed" | "Pending" | "Failed"
}