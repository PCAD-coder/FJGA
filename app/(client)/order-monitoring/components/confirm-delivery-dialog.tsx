"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { MonitoredOrder } from "../types/order-monitoring"

interface Props {
  open: boolean

  onOpenChange: (
    open: boolean
  ) => void

  order: MonitoredOrder | null

  onConfirm: () => void
}

export default function ConfirmDeliveryDialog({
  open,
  onOpenChange,
  order,
  onConfirm,
}: Props) {
  if (!order) return null

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Confirm Delivery
          </DialogTitle>

          <DialogDescription>

            Are you sure you have
            received your order
            "{order.productName}"?

            This action cannot be
            undone.

          </DialogDescription>

        </DialogHeader>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
          >
            Confirm Delivery
          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  )
}