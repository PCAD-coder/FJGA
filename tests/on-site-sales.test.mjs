import assert from "node:assert/strict"
import test from "node:test"
import {
  filterOnSiteTransactions,
  formatOnSiteCurrency,
  formatOnSiteDate,
  formatOnSitePaymentMethod,
  mapOnSiteTransaction,
  summarizeOnSiteTransactions,
} from "../app/(admin)/dashboard/sales/utils/on-site-sales.ts"

function row(overrides = {}) {
  return {
    id: "visit-1",
    visit_number: "SV-0001",
    service_name_snapshot: "On-Site Measurement",
    service_fee: "1000.00",
    travel_fee: "250.50",
    total_fee: "1250.50",
    payment_status: "unpaid",
    payment_method: null,
    paid_at: null,
    payment_received_by: null,
    created_at: "2026-11-01T01:00:00Z",
    customer: { first_name: " Maria ", last_name: " Santos ", full_name: null },
    ...overrides,
  }
}

test("maps saved fee snapshots, customer relationship, and recorded cash payment", () => {
  const transaction = mapOnSiteTransaction(
    row({
      payment_status: "paid",
      payment_method: "cash",
      paid_at: "2026-11-02T01:00:00Z",
      payment_received_by: "FJGA Staff",
    })
  )
  assert.equal(transaction.customerName, "Maria Santos")
  assert.equal(transaction.serviceFee, 1000)
  assert.equal(transaction.travelFee, 250.5)
  assert.equal(transaction.totalFee, 1250.5)
  assert.equal(transaction.paymentStatus, "paid")
  assert.equal(transaction.paymentMethod, "cash")
  assert.equal(transaction.paymentReceivedBy, "FJGA Staff")
  assert.equal(transaction.paidAt, "2026-11-02T01:00:00Z")
})

test("only explicitly paid transactions contribute to collected revenue", () => {
  const records = [
    mapOnSiteTransaction(row({ id: "paid", payment_status: "paid" })),
    // A completed visit remains unpaid unless cash receipt was confirmed.
    mapOnSiteTransaction(
      row({ id: "completed", status: "completed", total_fee: "2000.25" })
    ),
    mapOnSiteTransaction(
      row({ id: "unknown", payment_status: null, total_fee: "3000" })
    ),
  ]
  assert.deepEqual(summarizeOnSiteTransactions(records), {
    totalCollected: 1250.5,
    unpaidServiceFees: 2000.25,
    paidTransactions: 1,
    totalVisits: 3,
  })
  assert.equal(records[1].paymentStatus, "unpaid")
  assert.equal(records[2].paymentStatus, null)
})

test("cash method or payment date alone does not confirm payment", () => {
  const transaction = mapOnSiteTransaction(
    row({
      payment_method: "cash",
      paid_at: "2026-11-02T01:00:00Z",
    })
  )
  assert.equal(summarizeOnSiteTransactions([transaction]).totalCollected, 0)
})

test("handles missing customers, fees, dates, and unsupported payment status", () => {
  const transaction = mapOnSiteTransaction(
    row({
      customer: null,
      service_fee: null,
      travel_fee: "invalid",
      total_fee: null,
      payment_status: "unknown",
      created_at: null,
    })
  )
  assert.equal(transaction.customerName, "Unknown Customer")
  assert.equal(transaction.serviceFee, null)
  assert.equal(transaction.travelFee, null)
  assert.equal(transaction.totalFee, null)
  assert.equal(transaction.paymentStatus, null)
  assert.equal(formatOnSiteCurrency(null), "—")
  assert.equal(formatOnSiteDate(null), "—")
  assert.equal(formatOnSiteDate("invalid"), "—")
  assert.equal(formatOnSitePaymentMethod(null), "—")
  assert.equal(formatOnSitePaymentMethod("cash"), "Cash")
  assert.equal(
    mapOnSiteTransaction(
      row({
        customer: {
          first_name: null,
          last_name: null,
          full_name: " Full Name ",
        },
      })
    ).customerName,
    "Full Name"
  )
})

test("searches by visit number or customer and filters by payment status", () => {
  const records = [
    mapOnSiteTransaction(row({ id: "paid", payment_status: "paid" })),
    mapOnSiteTransaction(row({ id: "unpaid", visit_number: "SV-0002" })),
  ]
  assert.deepEqual(
    filterOnSiteTransactions(records, " sv-0002 ", "all").map((r) => r.id),
    ["unpaid"]
  )
  assert.deepEqual(
    filterOnSiteTransactions(records, "MARIA", "paid").map((r) => r.id),
    ["paid"]
  )
  assert.equal(filterOnSiteTransactions(records, "missing", "all").length, 0)
  assert.equal(filterOnSiteTransactions(records, "", "unpaid").length, 1)
  assert.deepEqual(summarizeOnSiteTransactions([]), {
    totalCollected: 0,
    unpaidServiceFees: 0,
    paidTransactions: 0,
    totalVisits: 0,
  })
})

test("sorts newest payment or request date first without mutating source records", () => {
  const records = [
    mapOnSiteTransaction(row({ id: "old" })),
    mapOnSiteTransaction(
      row({
        id: "paid-later",
        payment_status: "paid",
        paid_at: "2026-11-03T00:00:00Z",
      })
    ),
    mapOnSiteTransaction(
      row({ id: "new-request", created_at: "2026-11-04T00:00:00Z" })
    ),
  ]
  assert.deepEqual(
    filterOnSiteTransactions(records, "", "all").map((r) => r.id),
    ["new-request", "paid-later", "old"]
  )
  assert.equal(records[0].id, "old")
})

test("formats peso amounts and dates in Manila regardless of host timezone", () => {
  assert.equal(formatOnSiteCurrency(1000), "₱1,000.00")
  const formatted = formatOnSiteDate("2026-11-03T18:30:00Z")
  const expected = new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(new Date("2026-11-04T02:30:00+08:00"))
  assert.equal(formatted, expected)
})

test("sums currency in cents to avoid fractional peso accumulation errors", () => {
  const records = [0.1, 0.2].map((fee, index) =>
    mapOnSiteTransaction(
      row({
        id: String(index),
        total_fee: fee,
        payment_status: "paid",
      })
    )
  )
  assert.equal(summarizeOnSiteTransactions(records).totalCollected, 0.3)
})
