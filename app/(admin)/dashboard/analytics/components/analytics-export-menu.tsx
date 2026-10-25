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

import type {
  AnalyticsSummary,
  MaterialUsage,
  OrdersData,
  RevenueData,
  TopProduct,
} from "../types/analytics"

import type { AnalyticsPeriod } from "../services/analytics-service"

interface AnalyticsExportMenuProps {
  period: AnalyticsPeriod
  summary: AnalyticsSummary
  revenueData: RevenueData[]
  ordersData: OrdersData[]
  topProducts: TopProduct[]
  materialsUsage: MaterialUsage[]
}

function escapeCsv(value: string | number | null | undefined) {
  const text = String(value ?? "")

  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value)
}

function getPeriodLabel(period: AnalyticsPeriod) {
  switch (period) {
    case "quarterly":
      return "Quarterly"
    case "yearly":
      return "Yearly"
    default:
      return "Monthly"
  }
}

function downloadCsv(csv: string, filename: string) {
  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = filename

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
  toast.success("Analytics CSV download started.")
}

export default function AnalyticsExportMenu({
  period,
  summary,
  revenueData,
  ordersData,
  topProducts,
  materialsUsage,
}: AnalyticsExportMenuProps) {
  function handleExportCsv() {
    const periodLabel = getPeriodLabel(period)

    const trendRows = revenueData.map((revenue, index) => [
      revenue.month,
      revenue.revenue,
      ordersData[index]?.orders ?? 0,
    ])

    const rows: (string | number)[][] = [
      ["FJ Glass and Aluminum"],
      [`${periodLabel} Analytics Report`],
      [],
      ["SUMMARY"],
      ["Total Revenue", summary.totalRevenue],
      ["Completed Orders", summary.completedOrders],
      ["Return Requests", summary.returnRequests],
      ["Customer Satisfaction", summary.customerSatisfaction],
      [],
      ["REVENUE AND ORDERS TREND"],
      ["Period", "Revenue", "Orders"],
      ...trendRows,
      [],
      ["TOP PRODUCTS"],
      ["Product", "Orders", "Revenue"],
      ...topProducts.map((product) => [
        product.productName,
        product.orders,
        product.revenue,
      ]),
      [],
      ["MATERIALS USAGE"],
      ["Material", "Quantity Used", "Unit"],
      ...materialsUsage.map((material) => [
        material.materialName,
        material.quantityUsed,
        material.unit,
      ]),
    ]

    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n")

    const date = new Date().toISOString().slice(0, 10)

    downloadCsv(csv, `fjga-analytics-${period}-${date}.csv`)
  }

  function handlePrintReport() {
    const printWindow = window.open("", "_blank", "width=1200,height=800")

    if (!printWindow) {
      toast.error("The print window was blocked. Allow pop-ups and try again.")
      return
    }

    const periodLabel = getPeriodLabel(period)
    const generatedAt = new Date().toLocaleString()

    const trendRows = revenueData
      .map(
        (revenue, index) => `
          <tr>
            <td>${escapeHtml(revenue.month)}</td>
            <td class="number">
              ${escapeHtml(formatCurrency(revenue.revenue))}
            </td>
            <td class="number">
              ${escapeHtml(ordersData[index]?.orders ?? 0)}
            </td>
          </tr>
        `
      )
      .join("")

    const productRows = topProducts
      .map(
        (product) => `
          <tr>
            <td>${escapeHtml(product.productName)}</td>
            <td class="number">${escapeHtml(product.orders)}</td>
            <td class="number">
              ${escapeHtml(formatCurrency(product.revenue))}
            </td>
          </tr>
        `
      )
      .join("")

    const materialRows = materialsUsage
      .map(
        (material) => `
          <tr>
            <td>${escapeHtml(material.materialName)}</td>
            <td class="number">
              ${escapeHtml(material.quantityUsed)}
            </td>
            <td>${escapeHtml(material.unit)}</td>
          </tr>
        `
      )
      .join("")

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>FJGA ${periodLabel} Analytics Report</title>

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
              font-family: Arial, sans-serif;
              color: #111827;
              font-size: 12px;
            }

            .header {
              margin-bottom: 18px;
            }

            .company {
              font-size: 22px;
              font-weight: 700;
            }

            .report-title {
              margin-top: 4px;
              font-size: 17px;
            }

            .generated {
              margin-top: 6px;
              color: #6b7280;
            }

            .summary {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin: 16px 0 22px;
            }

            .summary-card {
              border: 1px solid #d1d5db;
              border-radius: 6px;
              padding: 10px;
            }

            .summary-label {
              color: #6b7280;
              font-size: 10px;
              text-transform: uppercase;
            }

            .summary-value {
              margin-top: 4px;
              font-size: 18px;
              font-weight: 700;
            }

            .section {
              margin-top: 20px;
              break-inside: avoid;
            }

            .section-title {
              margin-bottom: 8px;
              font-size: 14px;
              font-weight: 700;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th,
            td {
              border: 1px solid #d1d5db;
              padding: 7px;
              text-align: left;
              vertical-align: top;
            }

            th {
              background: #f3f4f6;
              font-size: 10px;
              text-transform: uppercase;
            }

            .number {
              text-align: right;
              white-space: nowrap;
            }

            .empty {
              padding: 18px;
              text-align: center;
            }

            .two-column {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 18px;
            }

            .footer {
              margin-top: 18px;
              color: #6b7280;
              font-size: 10px;
            }
          </style>
        </head>

        <body>
          <div class="header">
            <div class="company">FJ Glass and Aluminum</div>

            <div class="report-title">
              ${escapeHtml(periodLabel)} Analytics Report
            </div>

            <div class="generated">
              Generated: ${escapeHtml(generatedAt)}
            </div>
          </div>

          <div class="summary">
            <div class="summary-card">
              <div class="summary-label">Total Revenue</div>
              <div class="summary-value">
                ${escapeHtml(formatCurrency(summary.totalRevenue))}
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Completed Orders</div>
              <div class="summary-value">
                ${escapeHtml(summary.completedOrders)}
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Return Requests</div>
              <div class="summary-value">
                ${escapeHtml(summary.returnRequests)}
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Customer Satisfaction</div>
              <div class="summary-value">
                ${escapeHtml(summary.customerSatisfaction.toFixed(2))} / 5
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              Revenue &amp; Orders Trend
            </div>

            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Revenue</th>
                  <th>Orders</th>
                </tr>
              </thead>

              <tbody>
                ${
                  trendRows ||
                  `
                    <tr>
                      <td colspan="3" class="empty">
                        No trend data available for this period.
                      </td>
                    </tr>
                  `
                }
              </tbody>
            </table>
          </div>

          <div class="two-column">
            <div class="section">
              <div class="section-title">Top Products</div>

              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Orders</th>
                    <th>Revenue</th>
                  </tr>
                </thead>

                <tbody>
                  ${
                    productRows ||
                    `
                      <tr>
                        <td colspan="3" class="empty">
                          No product data available.
                        </td>
                      </tr>
                    `
                  }
                </tbody>
              </table>
            </div>

            <div class="section">
              <div class="section-title">Materials Usage</div>

              <table>
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Quantity Used</th>
                    <th>Unit</th>
                  </tr>
                </thead>

                <tbody>
                  ${
                    materialRows ||
                    `
                      <tr>
                        <td colspan="3" class="empty">
                          No material usage data available.
                        </td>
                      </tr>
                    `
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div class="footer">
            FJ Glass and Aluminum — Analytics Report
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()

    setTimeout(() => {
      printWindow.focus()
      printWindow.print()
      toast.info("Print dialog opened. Choose a printer or save as PDF.")
    }, 250)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            try {
              handleExportCsv()
            } catch {
              toast.error("Unable to export analytics. Please try again.")
            }
          }}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export CSV
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            try {
              handlePrintReport()
            } catch {
              toast.error(
                "Unable to prepare the analytics report. Please try again."
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
