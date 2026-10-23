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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import type {
  DeliveryZone,
  UpdateDeliveryZoneInput,
} from "../types/delivery-zone"

interface EditDeliveryZoneDialogProps {
  zone: DeliveryZone | null
  open: boolean
  onOpenChange: (open: boolean) => void
  updating: boolean
  onUpdate: (
    zoneId: string,
    input: UpdateDeliveryZoneInput
  ) => Promise<void>
}

export default function EditDeliveryZoneDialog({
  zone,
  open,
  onOpenChange,
  updating,
  onUpdate,
}: EditDeliveryZoneDialogProps) {
  const [zoneName, setZoneName] = useState("")
  const [description, setDescription] = useState("")
  const [deliveryFee, setDeliveryFee] = useState("")
  const [submitError, setSubmitError] = useState<string | null>(
    null
  )

  useEffect(() => {
    if (!open || !zone) {
      return
    }

    setZoneName(zone.zoneName)
    setDescription(zone.description ?? "")
    setDeliveryFee(String(zone.deliveryFee))
    setSubmitError(null)
  }, [open, zone])

  const handleOpenChange = (nextOpen: boolean) => {
    if (updating) {
      return
    }

    if (!nextOpen) {
      setSubmitError(null)
    }

    onOpenChange(nextOpen)
  }

  const handleSubmit = async () => {
    if (!zone) {
      return
    }

    try {
      setSubmitError(null)

      const trimmedZoneName = zoneName.trim()

      if (!trimmedZoneName) {
        setSubmitError("Zone name is required")
        return
      }

      if (!deliveryFee.trim()) {
        setSubmitError("Delivery fee is required")
        return
      }

      const parsedDeliveryFee = Number(deliveryFee)

      if (
        !Number.isFinite(parsedDeliveryFee) ||
        parsedDeliveryFee < 0
      ) {
        setSubmitError(
          "Delivery fee must be zero or greater"
        )
        return
      }

      await onUpdate(zone.id, {
        zoneName: trimmedZoneName,
        description: description.trim() || null,
        deliveryFee: parsedDeliveryFee,

        /*
         * City assignments are managed separately.
         * Preserve the current city codes for the input shape.
         */
        cityPsgcCodes: zone.cities.map(
          (city) => city.cityPsgcCode
        ),
      })

      onOpenChange(false)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to update delivery zone"
      )
    }
  }

  if (!zone) {
    return null
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Delivery Zone</DialogTitle>

          <DialogDescription>
            Update the zone information and delivery fee.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Zone Name
            </label>

            <Input
              value={zoneName}
              onChange={(event) =>
                setZoneName(event.target.value)
              }
              disabled={updating}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Description
              <span className="ml-1 text-xs text-muted-foreground">
                Optional
              </span>
            </label>

            <Textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              className="min-h-[80px] resize-none"
              disabled={updating}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Delivery Fee
            </label>

            <Input
              type="number"
              min="0"
              step="0.01"
              value={deliveryFee}
              onChange={(event) =>
                setDeliveryFee(event.target.value)
              }
              disabled={updating}
            />

            <p className="text-xs text-muted-foreground">
              Changes to this fee apply to future delivery fee
              calculations.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Assigned Cities
            </p>

            <div className="rounded-md border bg-muted/30 p-3">
              {zone.cities.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No cities assigned.
                </p>
              ) : (
                <div className="space-y-2">
                  {zone.cities.map((city) => (
                    <div key={city.id}>
                      <p className="text-sm font-medium">
                        {city.cityName}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {[city.provinceName, city.regionName]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              City assignments will be managed separately.
            </p>
          </div>

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
            disabled={updating}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={updating}
          >
            {updating ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}