"use client"

import { getErrorMessage } from "@/lib/error-message"

import { toast } from "sonner"

import { useEffect, useMemo, useState } from "react"

import { Search } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"

import {
  getDeliveryZoneBarangays,
  markDeliveryBarangayAvailable,
  markDeliveryBarangayUnavailable,
} from "../services/delivery-zone-management"
import type {
  DeliveryZoneBarangay,
  DeliveryZoneCity,
} from "../types/delivery-zone"

interface ManageBarangaysDialogProps {
  city: DeliveryZoneCity | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ManageBarangaysDialog({
  city,
  open,
  onOpenChange,
}: ManageBarangaysDialogProps) {
  const [barangays, setBarangays] = useState<DeliveryZoneBarangay[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [changingCode, setChangingCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !city) {
      return
    }

    let cancelled = false

    const loadBarangays = async () => {
      try {
        setLoading(true)
        setError(null)
        setSearch("")

        const data = await getDeliveryZoneBarangays(city.id, city.cityPsgcCode)

        if (!cancelled) {
          setBarangays(data)
        }
      } catch (error) {
        if (!cancelled) {
          setBarangays([])
          setError(
            getErrorMessage(error, "Failed to load barangays")
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadBarangays()

    return () => {
      cancelled = true
    }
  }, [open, city])

  useEffect(() => {
    if (!open) {
      setBarangays([])
      setSearch("")
      setError(null)
      setChangingCode(null)
    }
  }, [open])

  const availableCount = useMemo(
    () => barangays.filter((barangay) => barangay.isAvailable).length,
    [barangays]
  )

  const unavailableCount = barangays.length - availableCount

  const filteredBarangays = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    if (!normalizedSearch) {
      return barangays
    }

    return barangays.filter((barangay) =>
      barangay.barangayName.toLowerCase().includes(normalizedSearch)
    )
  }, [barangays, search])

  const handleAvailabilityChange = async (
    barangay: DeliveryZoneBarangay,
    nextAvailable: boolean
  ) => {
    if (!city || changingCode) {
      return
    }

    try {
      setChangingCode(barangay.psgcCode)
      setError(null)

      if (nextAvailable) {
        await markDeliveryBarangayAvailable(city.id, barangay.psgcCode)
      } else {
        await markDeliveryBarangayUnavailable(city.id, barangay.psgcCode)
      }

      toast.success("Barangay delivery availability updated.")
      setBarangays((current) =>
        current.map((item) =>
          item.psgcCode === barangay.psgcCode
            ? {
                ...item,
                isAvailable: nextAvailable,
              }
            : item
        )
      )
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Unable to update barangay availability.")
      )
      setError(
        getErrorMessage(error, "Failed to update barangay availability")
      )
    } finally {
      setChangingCode(null)
    }
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (changingCode) {
      return
    }

    onOpenChange(nextOpen)
  }

  if (!city) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Barangays — {city.cityName}</DialogTitle>

          <DialogDescription>
            Choose which barangays are available for delivery within this city
            or municipality.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Total</p>

              <p className="mt-1 text-lg font-semibold">{barangays.length}</p>
            </div>

            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Available</p>

              <p className="mt-1 text-lg font-semibold">{availableCount}</p>
            </div>

            <div className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">Unavailable</p>

              <p className="mt-1 text-lg font-semibold">{unavailableCount}</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search barangays..."
              className="pl-9"
              disabled={loading}
            />
          </div>

          {loading ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Loading barangays...
              </p>
            </div>
          ) : error && barangays.length === 0 ? (
            <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                {filteredBarangays.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      No barangays found.
                    </p>
                  </div>
                ) : (
                  filteredBarangays.map((barangay) => {
                    const changing = changingCode === barangay.psgcCode

                    return (
                      <div
                        key={barangay.psgcCode}
                        className="flex items-center justify-between gap-4 rounded-md border p-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {barangay.barangayName}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {barangay.isAvailable
                              ? "Available for delivery"
                              : "Unavailable for delivery"}
                          </p>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-xs text-muted-foreground">
                            {changing
                              ? "Saving..."
                              : barangay.isAvailable
                                ? "Available"
                                : "Unavailable"}
                          </span>

                          <Switch
                            checked={barangay.isAvailable}
                            disabled={changingCode !== null}
                            onCheckedChange={(checked) => {
                              void handleAvailabilityChange(barangay, checked)
                            }}
                            aria-label={`Delivery availability for ${barangay.barangayName}`}
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter className="shrink-0"></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
