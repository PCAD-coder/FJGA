"use client"

import { toast } from "sonner"

import { Download, FileSpreadsheet, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { SalesRecord } from "../types/sales"

interface SalesExportMenuProps {
  sales: SalesRecord[]
  paymentStatusFilter: "all" | SalesRecord["paymentStatus"]
  search: string
}

function escapeCsvValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return ""
  }

  const stringValue = String(value)

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

function formatPaymentStatus(status: SalesRecord["paymentStatus"]) {
  switch (status) {
    case "unpaid":
      return "Unpaid"

    case "partial":
      return "Partially Paid"

    case "paid":
      return "Paid"
  }
}

function formatPaymentMethod(paymentMethod: SalesRecord["paymentMethod"]) {
  switch (paymentMethod) {
    case "cash":
      return "Cash"

    case "cash_on_delivery":
      return "Cash on Delivery"

    case "card":
      return "Card"

    case "gcash":
      return "GCash"

    case "online_banking":
      return "Online Banking"

    case "qrph":
      return "QR Ph"

    default:
      return ""
  }
}

function formatDate(value: string | null) {
  if (!value) {
    return ""
  }

  return new Date(value).toLocaleDateString()
}

function getPaymentStatusFilename(
  paymentStatusFilter: SalesExportMenuProps["paymentStatusFilter"]
) {
  if (paymentStatusFilter === "all") {
    return "all"
  }

  return paymentStatusFilter
}

function escapeHtml(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return ""
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function getPaymentStatusLabel(
  paymentStatusFilter: SalesExportMenuProps["paymentStatusFilter"]
) {
  switch (paymentStatusFilter) {
    case "unpaid":
      return "Unpaid"

    case "partial":
      return "Partially Paid"

    case "paid":
      return "Paid"

    default:
      return "All Statuses"
  }
}

function formatPrintCurrency(value: number) {
  return `â‚±${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function SalesExportMenu({
  sales,
  paymentStatusFilter,
  search,
}: SalesExportMenuProps) {
  function exportCsv() {
    if (sales.length === 0) {
      return
    }

    const headers = [
      "Order Number",
      "Customer",
      "Contact Number",
      "Order Type",
      "Subtotal",
      "VAT Rate",
      "VAT Amount",
      "Delivery Fee",
      "Total Amount",
      "Amount Paid",
      "Outstanding Balance",
      "Payment Method",
      "Payment Status",
      "Last Payment",
      "Next Due",
      "Order Date",
    ]

    const rows = sales.map((sale) => [
      sale.orderNumber,
      sale.customerName,
      sale.contactNumber ?? "",
      sale.orderType === "standard" ? "Standard" : "Custom",
      sale.subtotal.toFixed(2),
      `${sale.vatRate}%`,
      sale.vatAmount.toFixed(2),
      sale.deliveryFee.toFixed(2),
      sale.totalAmount.toFixed(2),
      sale.amountPaid.toFixed(2),
      sale.balance.toFixed(2),
      formatPaymentMethod(sale.paymentMethod),
      formatPaymentStatus(sale.paymentStatus),
      formatDate(sale.lastPaymentDate),
      formatDate(sale.nextPaymentDue),
      formatDate(sale.createdAt),
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\r\n")

    // UTF-8 BOM helps Excel display characters such as â‚± correctly.
    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    const date = new Date().toISOString().slice(0, 10)
    const status = getPaymentStatusFilename(paymentStatusFilter)

    link.href = url
    link.download = `fjga-sales-${status}-${date}.csv`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
    toast.success("Sales CSV download started.")
  }

  function printReport() {
    if (sales.length === 0) {
      return
    }

    const printWindow = window.open("", "_blank", "width=1200,height=800")

    if (!printWindow) {
      toast.error(
        "The print window was blocked by your browser. Please allow pop-ups and try again."
      )
      return
    }

    const totalSales = sales.reduce(
      (total, sale) => total + sale.totalAmount,
      0
    )

    const totalPaid = sales.reduce((total, sale) => total + sale.amountPaid, 0)

    const totalBalance = sales.reduce((total, sale) => total + sale.balance, 0)

    const generatedAt = new Date().toLocaleString()

    const statusLabel = getPaymentStatusLabel(paymentStatusFilter)

    const searchLabel = search.trim() ? escapeHtml(search.trim()) : "None"

    const tableRows = sales
      .map(
        (sale) => `
        <tr>
          <td>${escapeHtml(sale.orderNumber)}</td>

          <td>
            <strong>${escapeHtml(sale.customerName)}</strong>
            ${
              sale.contactNumber
                ? `<div class="secondary">${escapeHtml(
                    sale.contactNumber
                  )}</div>`
                : ""
            }
          </td>

          <td class="amount">
            ${escapeHtml(formatPrintCurrency(sale.totalAmount))}
          </td>

          <td class="amount">
            ${escapeHtml(formatPrintCurrency(sale.amountPaid))}
          </td>

          <td class="amount">
            ${escapeHtml(formatPrintCurrency(sale.balance))}
          </td>

          <td>
            ${escapeHtml(formatPaymentMethod(sale.paymentMethod))}
          </td>

          <td>
            ${escapeHtml(formatPaymentStatus(sale.paymentStatus))}
          </td>

          <td>
            ${escapeHtml(formatDate(sale.lastPaymentDate) || "â€”")}
          </td>

          <td>
            ${escapeHtml(formatDate(sale.nextPaymentDue) || "â€”")}
          </td>
        </tr>
      `
      )
      .join("")

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>FJGA Sales Report</title>

        <meta charset="UTF-8" />

        <style>
          @page {
            size: landscape;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            color: #111827;
            background: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
          }

          .report {
            width: 100%;
          }

          .header {
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 2px solid #111827;
          }

          .company {
            margin: 0;
            font-size: 22px;
            font-weight: 700;
          }

          .report-title {
            margin: 4px 0 0;
            font-size: 16px;
            font-weight: 600;
          }

          .generated {
            margin-top: 5px;
            color: #6b7280;
          }

          .filters {
            display: flex;
            gap: 24px;
            margin-bottom: 16px;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
          }

          .filter-label {
            color: #6b7280;
            font-size: 10px;
            text-transform: uppercase;
          }

          .filter-value {
            margin-top: 2px;
            font-weight: 600;
          }

          .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 18px;
          }

          .summary-card {
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
          }

          .summary-label {
            color: #6b7280;
            font-size: 10px;
            text-transform: uppercase;
          }

          .summary-value {
            margin-top: 4px;
            font-size: 14px;
            font-weight: 700;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          thead {
            display: table-header-group;
          }

          tr {
            page-break-inside: avoid;
          }

          th,
          td {
            padding: 7px 6px;
            border: 1px solid #d1d5db;
            vertical-align: top;
            text-align: left;
          }

          th {
            background: #f3f4f6;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
          }

          .amount {
            white-space: nowrap;
            text-align: right;
          }

          .secondary {
            margin-top: 2px;
            color: #6b7280;
            font-size: 9px;
          }

          .footer {
            margin-top: 16px;
            color: #6b7280;
            font-size: 9px;
            text-align: right;
          }

          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>

      <body>
        <main class="report">
          <header class="header">
            <h1 class="company">FJ Glass and Aluminum</h1>
            <p class="report-title">Sales Report</p>

            <div class="generated">
              Generated: ${escapeHtml(generatedAt)}
            </div>
          </header>

          <section class="filters">
            <div>
              <div class="filter-label">Payment Status</div>
              <div class="filter-value">
                ${escapeHtml(statusLabel)}
              </div>
            </div>

            <div>
              <div class="filter-label">Search</div>
              <div class="filter-value">
                ${searchLabel}
              </div>
            </div>
          </section>

          <section class="summary">
            <div class="summary-card">
              <div class="summary-label">Records</div>
              <div class="summary-value">${sales.length}</div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Total Sales</div>
              <div class="summary-value">
                ${escapeHtml(formatPrintCurrency(totalSales))}
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Amount Collected</div>
              <div class="summary-value">
                ${escapeHtml(formatPrintCurrency(totalPaid))}
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Outstanding Balance</div>
              <div class="summary-value">
                ${escapeHtml(formatPrintCurrency(totalBalance))}
              </div>
            </div>
          </section>

          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Last Payment</th>
                <th>Next Due</th>
              </tr>
            </thead>

            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="footer">
            FJ Glass and Aluminum â€” Sales Report
          </div>
        </main>
      </body>
    </html>
  `)

    printWindow.document.close()

    printWindow.focus()

    window.setTimeout(() => {
      printWindow.print()
      toast.info("Print dialog opened. Choose a printer or save as PDF.")
    }, 250)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={sales.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            try {
              exportCsv()
            } catch {
              toast.error("Unable to export sales records. Please try again.")
            }
          }}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export CSV
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            try {
              printReport()
            } catch {
              toast.error(
                "Unable to prepare the sales report. Please try again."
              )
            }
          }}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
