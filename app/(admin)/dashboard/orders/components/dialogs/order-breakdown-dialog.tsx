"use client"

import { useEffect, useRef, useState } from "react"
import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getErrorMessage } from "@/lib/error-message"
import { getOrderById } from "../../services/orders"
import type { Order } from "../../types/order"
import { buildOrderBreakdownDocument } from "../../utils/order-breakdown-document"

export default function OrderBreakdownDialog({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [document, setDocument] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    if (order) {
      getOrderById(order.id).then((detail) => {
        if (!cancelled) setDocument(buildOrderBreakdownDocument(detail as Order))
      }).catch((reason: unknown) => {
        if (!cancelled) setError(getErrorMessage(reason, "Unable to load the order breakdown."))
      })
    }
    return () => { cancelled = true }
  }, [order, attempt])

  return <Dialog open={Boolean(order)} onOpenChange={(open) => { if (!open) onClose() }}>
    <DialogContent className="flex h-[90vh] !max-w-5xl flex-col">
      <DialogHeader>
        <DialogTitle>Order Breakdown — {order?.order_number}</DialogTitle>
        <DialogDescription>Review materials, labor, production assignment, and expected finish date.</DialogDescription>
      </DialogHeader>
      <div className="flex justify-end">
        <Button disabled={!ready || !document} onClick={() => { frame.current?.contentWindow?.focus(); frame.current?.contentWindow?.print() }}>
          <Printer className="mr-2 h-4 w-4" />Print / Save PDF
        </Button>
      </div>
      {error ? <div role="alert" className="space-y-3 p-6 text-sm"><p>{error}</p><Button variant="outline" onClick={() => { setError(null); setAttempt((value) => value + 1) }}>Try again</Button></div>
        : document ? <iframe ref={frame} title="Printable order breakdown" srcDoc={document} sandbox="allow-same-origin allow-modals" onLoad={() => setReady(true)} className="min-h-0 w-full flex-1 rounded-md border bg-white" />
        : <p role="status" className="p-6 text-sm text-muted-foreground">Loading order breakdown...</p>}
    </DialogContent>
  </Dialog>
}
