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

import type { DeliveryZone, DeliveryZoneCity } from "../types/delivery-zone"

interface RemoveCityFromZoneDialogProps {
  zone: DeliveryZone | null
  city: DeliveryZoneCity | null
  open: boolean
  onOpenChange: (open: boolean) => void
  removingCity: boolean
  onRemoveCity: (zoneId: string, cityPsgcCode: string) => Promise<void>
}

export default function RemoveCityFromZoneDialog({
  zone,
  city,
  open,
  onOpenChange,
  removingCity,
  onRemoveCity,
}: RemoveCityFromZoneDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setSubmitError(null)
    }
  }, [open])

  const handleOpenChange = (nextOpen: boolean) => {
    if (removingCity) {
      return
    }

    if (!nextOpen) {
      setSubmitError(null)
    }

    onOpenChange(nextOpen)
  }

  const handleRemove = async () => {
    if (!zone || !city) {
      return
    }

    try {
      setSubmitError(null)

      await onRemoveCity(zone.id, city.cityPsgcCode)

      onOpenChange(false)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to remove city from delivery zone"
      )
    }
  }

  if (!zone || !city) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove City</DialogTitle>

          <DialogDescription>
            Are you sure you want to remove{" "}
            <span className="font-medium text-foreground">{city.cityName}</span>{" "}
            from{" "}
            <span className="font-medium text-foreground">{zone.zoneName}</span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border bg-muted/30 p-3">
            <p className="text-sm font-medium">{city.cityName}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              {[city.provinceName, city.regionName].filter(Boolean).join(" · ")}
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Future orders using this city will no longer use this delivery
            zone&apos;s fee unless the city is assigned to another delivery
            zone.
          </p>

          {submitError && (
            <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">{submitError}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={removingCity}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleRemove}
            disabled={removingCity}
          >
            {removingCity ? "Removing..." : "Remove City"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
