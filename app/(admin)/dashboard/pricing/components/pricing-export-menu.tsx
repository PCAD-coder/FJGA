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

import type { LaborPricing, MaterialPricing } from "../types/pricing"

interface PricingExportMenuProps {
  activeTab: "materials" | "labor"
  materials: MaterialPricing[]
  laborServices: LaborPricing[]
  search: string
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
  toast.success("Pricing CSV download started.")
}

export default function PricingExportMenu({
  activeTab,
  materials,
  laborServices,
  search,
}: PricingExportMenuProps) {
  function handleExportCsv() {
    const date = new Date().toISOString().slice(0, 10)

    if (activeTab === "materials") {
      const headers = [
        "Material",
        "Category",
        "Specification",
        "Size",
        "Unit",
        "Unit Cost",
        "Markup Percentage",
        "Selling Price",
      ]

      const rows = materials.map((material) => [
        material.material_name,
        material.category,
        material.specification,
        material.size,
        material.unit,
        material.unit_cost,
        material.markup_percentage ?? 0,
        material.selling_price,
      ])

      const csv = [
        headers.map(escapeCsv).join(","),
        ...rows.map((row) => row.map(escapeCsv).join(",")),
      ].join("\n")

      downloadCsv(csv, `fjga-material-pricing-${date}.csv`)

      return
    }

    const headers = [
      "Service",
      "Description",
      "Unit",
      "Labor Cost",
      "Markup Percentage",
      "Selling Price",
    ]

    const rows = laborServices.map((service) => [
      service.service_name,
      service.description ?? "",
      service.unit,
      service.labor_cost,
      service.markup_percentage,
      service.selling_price,
    ])

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n")

    downloadCsv(csv, `fjga-labor-pricing-${date}.csv`)
  }

  function handlePrintReport() {
    const printWindow = window.open("", "_blank", "width=1200,height=800")

    if (!printWindow) {
      toast.error("The print window was blocked. Allow pop-ups and try again.")
      return
    }

    const generatedAt = new Date().toLocaleString()

    const isMaterials = activeTab === "materials"

    const recordCount = isMaterials ? materials.length : laborServices.length

    const averageMarkup =
      recordCount === 0
        ? 0
        : isMaterials
          ? materials.reduce(
              (sum, material) => sum + Number(material.markup_percentage ?? 0),
              0
            ) / materials.length
          : laborServices.reduce(
              (sum, service) => sum + Number(service.markup_percentage ?? 0),
              0
            ) / laborServices.length

    const averageSellingPrice =
      recordCount === 0
        ? 0
        : isMaterials
          ? materials.reduce(
              (sum, material) => sum + Number(material.selling_price || 0),
              0
            ) / materials.length
          : laborServices.reduce(
              (sum, service) => sum + Number(service.selling_price || 0),
              0
            ) / laborServices.length

    const materialRows = materials
      .map(
        (material) => `
          <tr>
            <td>${escapeHtml(material.material_name)}</td>
            <td>${escapeHtml(material.category)}</td>
            <td>${escapeHtml(material.specification)}</td>
            <td>${escapeHtml(material.size)}</td>
            <td>${escapeHtml(material.unit)}</td>
            <td class="number">
              ${escapeHtml(formatCurrency(material.unit_cost))}
            </td>
            <td class="number">
              ${escapeHtml(material.markup_percentage ?? 0)}%
            </td>
            <td class="number">
              ${escapeHtml(formatCurrency(material.selling_price))}
            </td>
          </tr>
        `
      )
      .join("")

    const laborRows = laborServices
      .map(
        (service) => `
          <tr>
            <td>${escapeHtml(service.service_name)}</td>
            <td>${escapeHtml(service.description ?? "\u2014")}</td>
            <td>${escapeHtml(service.unit)}</td>
            <td class="number">
              ${escapeHtml(formatCurrency(service.labor_cost))}
            </td>
            <td class="number">
              ${escapeHtml(service.markup_percentage)}%
            </td>
            <td class="number">
              ${escapeHtml(formatCurrency(service.selling_price))}
            </td>
          </tr>
        `
      )
      .join("")

    const table = isMaterials
      ? `
          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Category</th>
                <th>Specification</th>
                <th>Size</th>
                <th>Unit</th>
                <th>Unit Cost</th>
                <th>Markup</th>
                <th>Selling Price</th>
              </tr>
            </thead>

            <tbody>
              ${
                materialRows ||
                `
                  <tr>
                    <td colspan="8" class="empty">
                      No material pricing records match the current search.
                    </td>
                  </tr>
                `
              }
            </tbody>
          </table>
        `
      : `
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Description</th>
                <th>Unit</th>
                <th>Labor Cost</th>
                <th>Markup</th>
                <th>Selling Price</th>
              </tr>
            </thead>

            <tbody>
              ${
                laborRows ||
                `
                  <tr>
                    <td colspan="6" class="empty">
                      No labor pricing records match the current search.
                    </td>
                  </tr>
                `
              }
            </tbody>
          </table>
        `

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>
            FJGA ${isMaterials ? "Material Pricing" : "Labor Pricing"} Report
          </title>

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
              margin-bottom: 20px;
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

            .filters {
              margin-top: 12px;
              padding: 10px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
            }

            .summary {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 10px;
              margin: 16px 0;
            }

            .summary-card {
              padding: 10px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
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

            table {
              width: 100%;
              border-collapse: collapse;
            }

            th,
            td {
              padding: 7px;
              border: 1px solid #d1d5db;
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
              padding: 20px;
              text-align: center;
            }

            .footer {
              margin-top: 14px;
              color: #6b7280;
              font-size: 10px;
            }
          </style>
        </head>

        <body>
          <div class="header">
            <div class="company">FJ Glass and Aluminum</div>

            <div class="report-title">
              ${
                isMaterials ? "Material Pricing Report" : "Labor Pricing Report"
              }
            </div>

            <div class="generated">
              Generated: ${escapeHtml(generatedAt)}
            </div>
          </div>

          <div class="filters">
            <strong>Report:</strong>
            ${isMaterials ? "Materials" : "Labor Services"}
            &nbsp; | &nbsp;
            <strong>Search:</strong>
            ${escapeHtml(search.trim() || "None")}
          </div>

          <div class="summary">
            <div class="summary-card">
              <div class="summary-label">Records</div>
              <div class="summary-value">${recordCount}</div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Average Markup</div>
              <div class="summary-value">
                ${averageMarkup.toFixed(2)}%
              </div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Average Selling Price</div>
              <div class="summary-value">
                ${escapeHtml(formatCurrency(averageSellingPrice))}
              </div>
            </div>
          </div>

          ${table}

          <div class="footer">
            FJ Glass and Aluminum \u2014 Pricing Management Report
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
              toast.error("Unable to export pricing records. Please try again.")
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
                "Unable to prepare the pricing report. Please try again."
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
