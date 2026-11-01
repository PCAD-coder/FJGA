"use client"

import ModuleLoading from "../loading"

import { useCallback, useEffect, useState } from "react"

import ReturnHeader from "./return-header"
import ReturnRequestForm from "./return-request-form"
import ReturnPolicy from "./return-policy"
import HelpCard from "./help-card"
import RequestStatusList from "./request-status-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { getReturnPageData } from "../services/return-service"

import type { CustomerOrder, ReturnRequest } from "../types/return"

export default function Returns() {
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [requests, setRequests] = useState<ReturnRequest[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReturns = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getReturnPageData()

      setOrders(data.orders)
      setRequests(data.requests)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load return information"
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadReturns()
  }, [loadReturns])

  if (loading) {
    return <ModuleLoading />
  }

  if (error) {
    return (
      <div className="space-y-8">
        <ReturnHeader />

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold text-destructive">
            Unable to load returns
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <ReturnHeader />

      <aside
        aria-label="Refund policy"
        className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm"
      >
        <p className="font-semibold">Please note: FJGA does not offer refunds.</p>
        <p className="mt-1 leading-6 text-muted-foreground">
          Return requests are evaluated for repair or replacement, subject to
          approval. If you choose not to proceed with an approved repair or
          replacement, you may keep your order, but no refund will be issued.
        </p>
      </aside>

      <Tabs defaultValue="request" className="space-y-5">
        <TabsList className="h-10 rounded-lg border bg-card p-1">
          <TabsTrigger value="request" className="px-4 text-sm">
            Request a Return
          </TabsTrigger>
          <TabsTrigger value="status" className="px-4 text-sm">
            Request Status
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="request"
          className="mt-0 data-[state=inactive]:hidden"
          forceMount
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ReturnRequestForm orders={orders} onSubmitted={loadReturns} />
            </div>

            <div className="space-y-6">
              <ReturnPolicy />
              <HelpCard />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="status" className="mt-0">
          <RequestStatusList requests={requests} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
