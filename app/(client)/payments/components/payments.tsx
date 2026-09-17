"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import PaymentHeader from "./payment-header"
import PaymentSummaryCards from "./payment-summary-cards"
import PaymentMethods from "./payment-methods"
import PaymentHistoryTable from "./payment-history-table"
import PendingInvoices from "./pending-invoices"

import type {
  PaymentSummary,
  Invoice,
  PaymentHistory,
} from "../types/payment"

import { getPaymentPageData } from "../services/payment-service"

export default function Payments() {
  const searchParams = useSearchParams()
  const paymentStatus = searchParams.get("payment")
  const paymentOrderId = searchParams.get("order")

  const [summary, setSummary] = useState<PaymentSummary>({
    totalPending: 0,
    paidThisMonth: 0,
    outstandingInvoices: 0,
  })

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [history, setHistory] = useState<PaymentHistory[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    async function loadPayments() {
      try {
        const data = await getPaymentPageData()

        if (cancelled) return

        setSummary(data.summary)
        setInvoices(data.invoices)
        setHistory(data.history)

        return data
      } catch (error) {
        if (cancelled) return

        console.error("PAYMENTS LOAD ERROR:", error)

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load payment information."
        )

        return null
      }
    }

    async function loadInitialData() {
      try {
        setLoading(true)
        setError(null)

        const data = await loadPayments()

        if (
          !data ||
          cancelled ||
          paymentStatus !== "success" ||
          !paymentOrderId
        ) {
          return
        }

        let latestData = data

        for (let attempt = 1; attempt <= 5; attempt++) {
          const invoiceStillPending = latestData.invoices.some(
            (invoice) => invoice.orderId === paymentOrderId
          )

          if (!invoiceStillPending) {
            break
          }

          await new Promise<void>((resolve) => {
            timer = setTimeout(resolve, 1000)
          })

          if (cancelled) return

          const refreshedData = await loadPayments()

          if (!refreshedData) {
            break
          }

          latestData = refreshedData
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadInitialData()

    return () => {
      cancelled = true

      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [paymentStatus, paymentOrderId])

  return (
    <div className="space-y-8">
      <PaymentHeader />

      {loading && (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Loading payment information...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <PaymentSummaryCards summary={summary} />

          <PendingInvoices invoices={invoices} />

          <PaymentMethods />

          <PaymentHistoryTable history={history} />
        </>
      )}
    </div>
  )
}