"use client"

import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"

import { ReturnRequest } from "../types/return"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: ReturnRequest | null
}

export default function ViewReturnDialog({
  open,
  onOpenChange,
  request,
}: Props) {
  if (!request) return null

  const statusStyles = {
    "under-review": "bg-orange-100 text-orange-700",
    "inspection-scheduled": "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    declined: "bg-red-100 text-red-700",
    resolved: "bg-gray-100 text-gray-700",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Return Request Details</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-6">
            {/* IMAGE */}
            <div>
              <div className="relative h-[300px] overflow-hidden rounded-lg border">
                <Image
                  src={request.image}
                  alt={request.title}
                  fill
                  className="object-cover"
                />
              </div>

              <p className="mt-2 text-xs text-muted-foreground">
                Damage Evidence Photo
              </p>
            </div>

            {/* DETAILS */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Return Title</p>
                <p className="font-semibold">{request.title}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-semibold">{request.clientName}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Original Order
                </p>
                <p className="font-semibold">{request.orderNumber}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Product Type</p>
                <p className="font-semibold">{request.productType}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Reported Date</p>
                <p className="font-semibold">{request.reportedDate}</p>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Original Amount
                </p>
                <p className="text-lg font-semibold">
                  ₱{request.originalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium">Issue Description</p>

              <div className="rounded-lg border bg-muted p-4">
                {request.issueDescription}
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium">Current Status</p>

              <Badge
                className={
                  statusStyles[
                    request.status as keyof typeof statusStyles
                  ]
                }
              >
                {request.status}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}