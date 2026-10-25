"use client"

import ModuleLoading from "../loading"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import PaymentHeader from "./payment-header"
import PaymentSummaryCards from "./payment-summary-cards"
import PaymentMethods from "./payment-methods"
import PaymentHistoryTable from "./payment-history-table"
import PendingInvoices from "./pending-invoices"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import type { PaymentSummary, Invoice, PaymentHistory } from "../types/payment"

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

  if (loading) {
    return <ModuleLoading />
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 px-1 pt-4 pb-12 sm:px-4 sm:pt-6 lg:px-6">
      <PaymentHeader />

      {loading && (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          Loading payment information...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-5 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <PaymentSummaryCards summary={summary} />

          <Tabs defaultValue="due" className="space-y-5">
            <TabsList className="h-10 rounded-lg border bg-card p-1">
              <TabsTrigger value="due" className="px-4 text-sm">
                Payments Due
              </TabsTrigger>
              <TabsTrigger value="history" className="px-4 text-sm">
                Payment History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="due" className="mt-0">
              <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
                <PendingInvoices invoices={invoices} />
                <PaymentMethods />
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <PaymentHistoryTable history={history} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
