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

import { Textarea } from "@/components/ui/textarea"

interface UpdateDeliveryStatusDialogProps {
  delivery: Delivery | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (status: Delivery["status"], notes: string) => void
}

export default function UpdateDeliveryStatusDialog({
  delivery,
  open,
  onOpenChange,
  onSave,
}: UpdateDeliveryStatusDialogProps) {
  const [status, setStatus] = useState<Delivery["status"]>("scheduled")

  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (delivery) {
      setStatus(delivery.status)
      setNotes("")
    }
  }, [delivery])

  if (!delivery) return null

  const formatStatus = (value: string) => {
    switch (value) {
      case "out_for_delivery":
        return "Out For Delivery"

      default:
        return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }

  const canGoOutForDelivery =
    Boolean(delivery.deliveryDate) &&
    Boolean(delivery.deliveryTime) &&
    Boolean(delivery.assignedDriver) &&
    Boolean(delivery.assignedTruck)

  const isGoingOutForDelivery =
    status === "out_for_delivery" && delivery.status !== "out_for_delivery"

  const isBeingDelivered =
    status === "delivered" && delivery.status !== "delivered"

  const handleSave = () => {
    if (isGoingOutForDelivery && !canGoOutForDelivery) {
      return
    }

    onSave(status, notes.trim())
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Delivery Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* PROJECT */}

          <div>
            <p className="text-sm text-muted-foreground">Project</p>

            <p className="font-medium">{delivery.projectName}</p>
          </div>

          {/* CURRENT STATUS */}

          <div>
            <p className="mb-2 text-sm text-muted-foreground">Current Status</p>

            <p className="font-medium">{formatStatus(delivery.status)}</p>
          </div>

          {/* NEW STATUS */}

          <div>
            <p className="mb-2 text-sm text-muted-foreground">New Status</p>

            <Select
              value={status}
              onValueChange={(value) => setStatus(value as Delivery["status"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {delivery.status === "scheduled" && (
                  <>
                    <SelectItem value="scheduled">Scheduled</SelectItem>

                    <SelectItem value="out_for_delivery">
                      Out For Delivery
                    </SelectItem>

                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </>
                )}

                {delivery.status === "out_for_delivery" && (
                  <>
                    <SelectItem value="out_for_delivery">
                      Out For Delivery
                    </SelectItem>

                    <SelectItem value="delivered">Delivered</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* SCHEDULE REQUIREMENT */}

          {isGoingOutForDelivery && !canGoOutForDelivery && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
              <p className="text-sm font-medium text-orange-800">
                Delivery information is incomplete.
              </p>

              <p className="mt-1 text-sm text-orange-700">
                Before marking this delivery as Out For Delivery, assign a
                delivery date, time, driver, and truck.
              </p>
            </div>
          )}

          {/* DELIVERY NOTES */}

          <div>
            <p className="mb-2 text-sm text-muted-foreground">Delivery Notes</p>

            <Textarea
              placeholder="Add notes about this delivery status update..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
            />

            {isBeingDelivered && (
              <p className="mt-1 text-xs text-muted-foreground">
                Add any relevant information about the completed delivery.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={isGoingOutForDelivery && !canGoOutForDelivery}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
