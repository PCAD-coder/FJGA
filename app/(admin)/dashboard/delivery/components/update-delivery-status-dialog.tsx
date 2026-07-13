"use client"

import { useState, useEffect } from "react"

import { Delivery } from "../types/delivery"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UpdateDeliveryStatusDialogProps {
  delivery: Delivery | null

  open: boolean

  onOpenChange: (
    open: boolean
  ) => void

  onSave: (
    status: Delivery["status"]
  ) => void
}

export default function UpdateDeliveryStatusDialog({
  delivery,
  open,
  onOpenChange,
  onSave,
}: UpdateDeliveryStatusDialogProps) {
  const [status, setStatus] =
    useState<Delivery["status"]>(
      "ready"
    )

  useEffect(() => {
    if (delivery) {
      setStatus(delivery.status)
    }
  }, [delivery])

  if (!delivery) return null

  const formatStatus = (
    value: string
  ) => {
    switch (value) {
      case "out-for-delivery":
        return "Out For Delivery"

      default:
        return (
          value.charAt(0).toUpperCase() +
          value.slice(1)
        )
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Update Delivery Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <p className="text-sm text-muted-foreground">
              Project
            </p>

            <p className="font-medium">
              {delivery.projectName}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Current Status
            </p>

            <p className="font-medium">
              {formatStatus(
                delivery.status
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              New Status
            </p>

            <Select
              value={status}
              onValueChange={(
                value
              ) =>
                setStatus(
                  value as Delivery["status"]
                )
              }
            >

              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="ready">
                  Ready
                </SelectItem>

                <SelectItem value="scheduled">
                  Scheduled
                </SelectItem>

                <SelectItem value="out-for-delivery">
                  Out For Delivery
                </SelectItem>

                <SelectItem value="delivered">
                  Delivered
                </SelectItem>

                <SelectItem value="cancelled">
                  Cancelled
                </SelectItem>

              </SelectContent>

            </Select>
          </div>

        </div>

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
            onClick={() =>
              onSave(status)
            }
          >
            Save Changes
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}