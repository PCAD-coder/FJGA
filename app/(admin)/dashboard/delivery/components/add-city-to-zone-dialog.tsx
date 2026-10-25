"use client"

import { useEffect, useState } from "react"

import { MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { getCities, type PSGCCity } from "@/app/services/delivery/psgc-service"

import type { DeliveryZone } from "../types/delivery-zone"

interface AddCityToZoneDialogProps {
  zone: DeliveryZone | null
  open: boolean
  onOpenChange: (open: boolean) => void
  addingCity: boolean
  onAddCity: (zoneId: string, cityPsgcCode: string) => Promise<void>
}

export default function AddCityToZoneDialog({
  zone,
  open,
  onOpenChange,
  addingCity,
  onAddCity,
}: AddCityToZoneDialogProps) {
  const [cities, setCities] = useState<PSGCCity[]>([])
  const [cityPsgcCode, setCityPsgcCode] = useState("")

  const [loadingCities, setLoadingCities] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !zone) {
      return
    }

    let cancelled = false

    const loadCities = async () => {
      try {
        setLoadingCities(true)
        setSubmitError(null)
        setCityPsgcCode("")

        const data = await getCities(zone.regionPsgcCode, zone.provincePsgcCode)

        if (!cancelled) {
          /*
           * Do not show cities that are already assigned
           * to this delivery zone.
           *
           * The RPC still protects against cities assigned
           * to another delivery zone.
           */
          const assignedCityCodes = new Set(
            zone.cities.map((city) => city.cityPsgcCode)
          )

          setCities(
            data.filter((city) => !assignedCityCodes.has(city.psgc_code))
          )
        }
      } catch (error) {
        if (!cancelled) {
          setCities([])

          setSubmitError(
            error instanceof Error ? error.message : "Failed to load cities"
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingCities(false)
        }
      }
    }

    void loadCities()

    return () => {
      cancelled = true
    }
  }, [open, zone])

  useEffect(() => {
    if (!open) {
      setCities([])
      setCityPsgcCode("")
      setSubmitError(null)
    }
  }, [open])

  const handleSubmit = async () => {
    if (!zone) {
      return
    }

    if (!cityPsgcCode) {
      setSubmitError("Select a city or municipality")
      return
    }

    try {
      setSubmitError(null)

      await onAddCity(zone.id, cityPsgcCode)

      onOpenChange(false)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to add city to delivery zone"
      )
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (addingCity) {
      return
    }

    if (!nextOpen) {
      setSubmitError(null)
    }

    onOpenChange(nextOpen)
  }

  if (!zone) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add City</DialogTitle>

          <DialogDescription>
            Add another city or municipality to {zone.zoneName}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <>
            <div className="rounded-md border bg-muted/30 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                <div className="space-y-1">
                  <p className="text-sm font-medium">Zone Location</p>

                  <p className="text-sm text-muted-foreground">
                    {zone.regionName}
                  </p>

                  {zone.provinceName && (
                    <p className="text-sm text-muted-foreground">
                      {zone.provinceName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">City / Municipality</label>

              <Select
                value={cityPsgcCode}
                onValueChange={(value) => {
                  setCityPsgcCode(value)
                  setSubmitError(null)
                }}
                disabled={loadingCities || addingCity || cities.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingCities
                        ? "Loading cities..."
                        : cities.length === 0
                          ? "No available cities"
                          : "Select city or municipality"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.psgc_code} value={city.psgc_code}>
                      {city.city_name}
                      {city.locality_type ? ` (${city.locality_type})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                Only cities and municipalities within this zone&apos;s region
                and province are shown.
              </p>
            </div>

            <div className="rounded-md border p-3">
              <p className="text-sm text-muted-foreground">Delivery fee</p>

              <p className="mt-1 font-medium">
                ₱
                {zone.deliveryFee.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </>

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
            disabled={addingCity}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={addingCity || loadingCities || !cityPsgcCode}
          >
            {addingCity ? "Adding..." : "Add City"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
