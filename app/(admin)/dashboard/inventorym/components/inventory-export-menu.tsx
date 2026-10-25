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

import type { InventoryMaterial } from "../types/inventory"

interface InventoryExportMenuProps {
  materials: InventoryMaterial[]
  categoryFilter: string
  stockStatusFilter: string
  expirationStatusFilter: string
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

function getStockStatus(material: InventoryMaterial) {
  if (material.stock_quantity === 0) {
    return "Out of Stock"
  }

  if (material.stock_quantity <= material.minimum_stock) {
    return "Low Stock"
  }

  return "In Stock"
}

function getExpirationStatus(material: InventoryMaterial) {
  if (!material.tracks_expiration) {
    return "Not Tracked"
  }

  if (material.expired_quantity > 0) {
    return "Expired Stock"
  }

  if (material.expiring_soon_quantity > 0) {
    return "Expiring Soon"
  }

  return "Normal"
}

function getStockFilterLabel(value: string) {
  switch (value) {
    case "in-stock":
      return "In Stock"
    case "low-stock":
      return "Low Stock"
    case "out-of-stock":
      return "Out of Stock"
    default:
      return "All Stock"
  }
}

function getExpirationFilterLabel(value: string) {
  switch (value) {
    case "not-expiring":
      return "Not Expiring"
    case "expiring-soon":
      return "Expiring Soon"
    case "expired":
      return "Expired"
    default:
      return "All Expiration"
  }
}

export function InventoryExportMenu({
  materials,
  categoryFilter,
  stockStatusFilter,
  expirationStatusFilter,
  search,
}: InventoryExportMenuProps) {
  function handleExportCsv() {
    const headers = [
      "Material",
      "Category",
      "Series",
      "Variant/Finish",
      "Thickness",
      "Color",
      "Size",
      "Unit",
      "Stock Quantity",
      "Minimum Stock",
      "Stock Status",
      "Tracks Expiration",
      "Expired Quantity",
      "Expiring Soon Quantity",
      "Expiration Status",
      "Remarks",
    ]

    const rows = materials.map((material) => [
      material.material_name,
      material.category,
      material.series ?? "",
      material.specification,
      material.thickness ?? "",
      material.color ?? "",
      material.size,
      material.unit,
      material.stock_quantity,
      material.minimum_stock,
      getStockStatus(material),
      material.tracks_expiration ? "Yes" : "No",
      material.expired_quantity,
      material.expiring_soon_quantity,
      getExpirationStatus(material),
      material.remarks ?? "",
    ])

    const csv = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\n")

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    const date = new Date().toISOString().slice(0, 10)

    link.href = url
    link.download = `fjga-inventory-${date}.csv`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
    toast.success("Inventory CSV download started.")
  }

  function handlePrintReport() {
    const printWindow = window.open("", "_blank", "width=1200,height=800")

    if (!printWindow) {
      toast.error("The print window was blocked. Allow pop-ups and try again.")
      return
    }

    const totalStock = materials.reduce(
      (sum, material) => sum + Number(material.stock_quantity || 0),
      0
    )

    const lowStockCount = materials.filter(
      (material) =>
        material.stock_quantity > 0 &&
        material.stock_quantity <= material.minimum_stock
    ).length

    const outOfStockCount = materials.filter(
      (material) => material.stock_quantity === 0
    ).length

    const expiringCount = materials.filter(
      (material) =>
        material.tracks_expiration && material.expiring_soon_quantity > 0
    ).length

    const generatedAt = new Date().toLocaleString()

    const rows = materials
      .map(
        (material) => `
          <tr>
            <td>${escapeHtml(material.material_name)}</td>
            <td>${escapeHtml(material.category)}</td>
            <td>${escapeHtml(material.specification)}</td>
            <td>${escapeHtml(material.size)}</td>
            <td>${escapeHtml(material.unit)}</td>
            <td class="number">${escapeHtml(material.stock_quantity)}</td>
            <td class="number">${escapeHtml(material.minimum_stock)}</td>
            <td>${escapeHtml(getStockStatus(material))}</td>
            <td>${escapeHtml(getExpirationStatus(material))}</td>
          </tr>
        `
      )
      .join("")

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>FJGA Inventory Report</title>

          <style>
            @page {
              size: landscape;
              margin: 12mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, sans-serif;
              color: #111827;
              margin: 0;
              font-size: 12px;
            }

            h1,
            h2,
            p {
              margin: 0;
            }

            .header {
              margin-bottom: 20px;
            }

            .company {
              font-size: 22px;
              font-weight: 700;
            }

            .report-title {
              font-size: 17px;
              margin-top: 4px;
            }

            .generated {
              color: #6b7280;
              margin-top: 6px;
            }

            .filters {
              margin-top: 12px;
              padding: 10px;
              border: 1px solid #d1d5db;
              border-radius: 6px;
            }

            .summary {
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 10px;
              margin: 16px 0;
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
              font-size: 18px;
              font-weight: 700;
              margin-top: 4px;
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
            <div class="report-title">Inventory Report</div>
            <div class="generated">
              Generated: ${escapeHtml(generatedAt)}
            </div>
          </div>

          <div class="filters">
            <strong>Report Filters:</strong>
            Category: ${escapeHtml(
              categoryFilter === "all" ? "All Categories" : categoryFilter
            )}
            &nbsp; | &nbsp;
            Stock: ${escapeHtml(getStockFilterLabel(stockStatusFilter))}
            &nbsp; | &nbsp;
            Expiration: ${escapeHtml(
              getExpirationFilterLabel(expirationStatusFilter)
            )}
            &nbsp; | &nbsp;
            Search: ${escapeHtml(search.trim() || "None")}
          </div>

          <div class="summary">
            <div class="summary-card">
              <div class="summary-label">Materials</div>
              <div class="summary-value">${materials.length}</div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Total Stock</div>
              <div class="summary-value">${escapeHtml(totalStock)}</div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Low Stock</div>
              <div class="summary-value">${lowStockCount}</div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Out of Stock</div>
              <div class="summary-value">${outOfStockCount}</div>
            </div>

            <div class="summary-card">
              <div class="summary-label">Expiring Soon</div>
              <div class="summary-value">${expiringCount}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Material</th>
                <th>Category</th>
                <th>Variant / Finish</th>
                <th>Size</th>
                <th>Unit</th>
                <th>Stock</th>
                <th>Minimum</th>
                <th>Stock Status</th>
                <th>Expiration</th>
              </tr>
            </thead>

            <tbody>
              ${
                rows ||
                `
                  <tr>
                    <td colspan="9" style="text-align:center;">
                      No inventory records match the selected filters.
                    </td>
                  </tr>
                `
              }
            </tbody>
          </table>

          <div class="footer">
            FJ Glass and Aluminum \u2014 Inventory Management Report
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
              toast.error(
                "Unable to export inventory records. Please try again."
              )
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
                "Unable to prepare the inventory report. Please try again."
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
