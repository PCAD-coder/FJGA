import type { Order } from "../types/order"
import { formatCustomerName } from "./format-customer-name"

function escape(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!)
}

const money = (value: number) => `PHP ${Number(value ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
function date(value?: string | null) {
  if (!value) return "Not scheduled"
  const parsed = new Date(value.length === 10 ? `${value}T00:00:00` : value)
  return Number.isNaN(parsed.getTime()) ? "Not scheduled" : parsed.toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })
}

function table(headers: string[], rows: unknown[][], empty: string) {
  return `<table><thead><tr>${headers.map((header) => `<th>${escape(header)}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((row) => `<tr>${row.map((cell) => `<td>${escape(cell)}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}">${escape(empty)}</td></tr>`}</tbody></table>`
}

export function buildOrderBreakdownDocument(order: Order) {
  const address = order.address
  const items = order.items ?? []
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${escape(order.order_number)} - Order Breakdown</title>
  <style>
    *{box-sizing:border-box}body{font:13px/1.5 Arial,sans-serif;color:#17202a;background:#fff;margin:0;padding:32px}h1{font-size:25px;margin:0}h2{font-size:17px;margin:24px 0 8px}h3{font-size:14px;margin:16px 0 6px}p{margin:4px 0;white-space:pre-wrap;overflow-wrap:anywhere}header{border-bottom:2px solid #17202a;padding-bottom:16px;margin-bottom:20px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}.label{color:#536171;font-size:11px;text-transform:uppercase}table{width:100%;border-collapse:collapse;margin:8px 0 16px;table-layout:fixed}th,td{border:1px solid #d6dce2;padding:8px;text-align:left;overflow-wrap:anywhere}th{background:#f1f4f7;font-size:11px}tr{break-inside:avoid}thead{display:table-header-group}.summary{margin-left:auto;max-width:340px}.total{font-weight:bold;border-top:2px solid #17202a;padding-top:8px}h2,h3{break-after:avoid}footer{border-top:1px solid #d6dce2;margin-top:24px;padding-top:10px;color:#536171;font-size:11px}@page{size:A4;margin:15mm}@media print{body{padding:0}}
  </style></head><body>
  <header><p>FJGA  /  Administrative Order Review</p><h1>Order Breakdown</h1><p>${escape(order.order_number)}</p></header>
  <div class="meta">
    <div><p class="label">Customer</p><p>${escape(formatCustomerName(order.profiles))}</p><p>${escape(order.customer_contact_number || "No contact number provided")}</p></div>
    <div><p class="label">Order date / status / type</p><p>${escape(date(order.created_at))}</p><p>${escape(order.status.replaceAll("_", " "))}  /  ${escape(order.order_type)}</p></div>
    <div><p class="label">Assigned staff / team</p><p>${escape(order.production_assigned_to || "Not assigned")}</p></div>
    <div><p class="label">Expected finish date</p><p>${escape(date(order.estimated_completion_date))}</p></div>
  </div>
  ${address ? `<h3>Delivery Address</h3><p>${escape([address.house_building_number, address.unit_floor, address.building_subdivision, address.street, address.barangay_name, address.city_name, address.province_name, address.region_name, address.postal_code].filter(Boolean).join(", "))}</p>` : ""}
  ${items.length ? items.map((item, index) => `
    <h2>${index + 1}. ${escape(item.product_name_snapshot)}</h2>
    <p>Order quantity: ${escape(item.quantity)}${[item.width, item.height, item.depth].some((value) => value != null) ? `  /  Dimensions: ${escape([item.width, item.height, item.depth].filter((value) => value != null).join(" x "))} ${escape(item.dimension_unit || item.dimensionUnit || "cm")}` : ""}</p>
    <p>Material and labor quantities and costs below are per product unit.</p>
    <h3>Materials</h3>
    ${table(["Material", "Quantity", "Unit", "Unit cost", "Subtotal"], (item.materials_snapshot ?? []).map((material) => [[material.material_name, material.series, material.thickness].filter(Boolean).join(" · "), material.quantity, material.unit, money(material.unit_cost), money(material.subtotal)]), "No material breakdown recorded.")}
    <h3>Labor</h3>
    ${table(["Service", "Quantity", "Unit", "Rate", "Subtotal"], (item.labor_snapshot ?? []).map((labor) => [labor.service_name, labor.quantity, labor.unit, money(labor.labor_cost), money(labor.subtotal)]), "No labor breakdown recorded.")}
    ${table(["Materials / unit", "Labor / unit", "Markup / unit", "Unit price", "Line total"], [[money(item.material_subtotal), money(item.labor_subtotal), money(item.markup_amount), money(item.unit_price_snapshot), money(item.line_total)]], "")}
  `).join("") : "<p>No order items recorded.</p>"}
  <div class="summary"><h2>Order Summary</h2>
    <p>Subtotal: ${money(order.subtotal)}</p><p>Labor total (included in subtotal): ${money(order.labor_total)}</p>
    <p>VAT (${escape(order.vat_rate)}%): ${money(order.vat_amount)}</p><p>Delivery fee: ${money(order.delivery_fee)}</p>
    <p class="total">Total amount: ${money(order.total_amount)}</p>
  </div>
  ${order.notes ? `<h3>Notes</h3><p>${escape(order.notes)}</p>` : ""}
  <footer>Order breakdown for administrative review. Costs reflect the saved order snapshots.</footer>
  </body></html>`
}


