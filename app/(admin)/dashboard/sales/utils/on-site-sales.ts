import type {
  OnSitePaymentFilter,
  OnSiteTransaction,
  OnSiteTransactionRow,
} from "../types/on-site-sales"

function amount(value: number | string | null): number | null {
  if (value === null || value === "") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function mapOnSiteTransaction(
  row: OnSiteTransactionRow
): OnSiteTransaction {
  const customer = row.customer
  const name = [customer?.first_name?.trim(), customer?.last_name?.trim()]
    .filter(Boolean)
    .join(" ")

  return {
    id: row.id,
    visitNumber: row.visit_number,
    customerName: name || customer?.full_name?.trim() || "Unknown Customer",
    serviceName: row.service_name_snapshot,
    serviceFee: amount(row.service_fee),
    travelFee: amount(row.travel_fee),
    totalFee: amount(row.total_fee),
    // Never infer payment from visit completion, method, or payment date.
    paymentStatus:
      row.payment_status === "paid" || row.payment_status === "unpaid"
        ? row.payment_status
        : null,
    paymentMethod: row.payment_method,
    paidAt: row.paid_at,
    paymentReceivedBy: row.payment_received_by,
    createdAt: row.created_at,
  }
}

export function summarizeOnSiteTransactions(records: OnSiteTransaction[]) {
  let collectedCents = 0
  let unpaidCents = 0
  let paidTransactions = 0
  for (const record of records) {
    const cents = Math.round((record.totalFee ?? 0) * 100)
    if (record.paymentStatus === "paid") {
      collectedCents += cents
      paidTransactions += 1
    } else if (record.paymentStatus === "unpaid") {
      unpaidCents += cents
    }
  }
  return {
    totalCollected: collectedCents / 100,
    unpaidServiceFees: unpaidCents / 100,
    paidTransactions,
    totalVisits: records.length,
  }
}

function timestamp(value: string | null) {
  const time = value ? Date.parse(value) : NaN
  return Number.isFinite(time) ? time : 0
}

export function filterOnSiteTransactions(
  records: OnSiteTransaction[],
  search: string,
  status: OnSitePaymentFilter
) {
  const query = search.trim().toLowerCase()
  return records
    .filter(
      (record) =>
        (status === "all" || record.paymentStatus === status) &&
        (!query ||
          record.visitNumber?.toLowerCase().includes(query) ||
          record.customerName.toLowerCase().includes(query))
    )
    .sort(
      (a, b) =>
        (timestamp(b.paidAt) || timestamp(b.createdAt)) -
          (timestamp(a.paidAt) || timestamp(a.createdAt)) ||
        b.id.localeCompare(a.id)
    )
}

export function formatOnSiteCurrency(value: number | null) {
  return value === null
    ? "—"
    : new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(value)
}

export function formatOnSiteDate(value: string | null) {
  if (!value || !Number.isFinite(Date.parse(value))) return "—"
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date(value))
}

export function formatOnSitePaymentMethod(value: string | null) {
  if (!value?.trim()) return "—"
  return value === "cash" ? "Cash" : value.replaceAll("_", " ")
}
