"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { DeliveryZone } from "../types/delivery-zone"

interface ChangeDeliveryZoneStatusDialogProps {
  zone: DeliveryZone | null
  open: boolean
  onOpenChange: (open: boolean) => void
  changingStatus: boolean
  onChangeStatus: (
    zoneId: string,
    isActive: boolean
  ) => Promise<void>
}

export default function ChangeDeliveryZoneStatusDialog({
  zone,
  open,
  onOpenChange,
  changingStatus,
  onChangeStatus,
}: ChangeDeliveryZoneStatusDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (open) {
      setSubmitError(null)
    }
  }, [open])

  const handleOpenChange = (nextOpen: boolean) => {
    if (changingStatus) {
      return
    }

    if (!nextOpen) {
      setSubmitError(null)
    }

    onOpenChange(nextOpen)
  }

  const handleConfirm = async () => {
    if (!zone) {
      return
    }

    try {
      setSubmitError(null)

      await onChangeStatus(
        zone.id,
        !zone.isActive
      )

      onOpenChange(false)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : `Failed to ${
              zone.isActive ? "deactivate" : "activate"
            } delivery zone`
      )
    }
  }

  if (!zone) {
    return null
  }

  const willActivate = !zone.isActive

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {willActivate
              ? "Activate Delivery Zone"
              : "Deactivate Delivery Zone"}
          </DialogTitle>

          <DialogDescription>
            {willActivate
              ? `Are you sure you want to activate ${zone.zoneName}?`
              : `Are you sure you want to deactivate ${zone.zoneName}?`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border bg-muted/30 p-3">
            <p className="font-medium">
              {zone.zoneName}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              ₱
              {zone.deliveryFee.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              delivery fee
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {zone.cities.length}{" "}
              {zone.cities.length === 1
                ? "assigned city"
                : "assigned cities"}
            </p>
          </div>

          {willActivate ? (
            <div className="rounded-md border p-3">
              <p className="text-sm">
                Activating this zone will make its assigned
                cities available again for future delivery fee
                calculations.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-amber-500/50 bg-amber-500/5 p-3">
              <p className="text-sm">
                Customers in the cities assigned to this zone
                will no longer receive this zone&apos;s delivery
                fee for future orders while it is inactive.
                Existing orders are not changed.
              </p>
            </div>
          )}

          {submitError && (
            <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">
                {submitError}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={changingStatus}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant={willActivate ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={changingStatus}
          >
            {changingStatus
              ? "Saving..."
              : willActivate
                ? "Activate Zone"
                : "Deactivate Zone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}