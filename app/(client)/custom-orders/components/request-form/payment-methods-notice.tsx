"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function PaymentMethodsNotice() {
  const [open, setOpen] = useState(true)

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
        <p className="text-sm font-medium">Payment methods: GCash or cash only.</p>
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          View payment details
        </Button>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>GCash or cash payments only</AlertDialogTitle>
            <AlertDialogDescription>
              Custom orders can only be paid through GCash or cash. If you
              prefer to pay with cash, please visit FJGA at the address below.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-lg border bg-muted/40 p-4">
            <p className="text-sm font-semibold">Cash payment location</p>
            <p className="mt-1 text-sm">
              248 Camia St. Bancal, Meycauayan City of Bulacan.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>I understand</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
