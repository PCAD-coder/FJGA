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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  getCities,
  getProvinces,
  getRegions,
  type PSGCCity,
  type PSGCProvince,
  type PSGCRegion,
} from "@/app/services/delivery/psgc-service"

import type { CreateDeliveryZoneInput } from "../types/delivery-zone"

interface AddDeliveryZoneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  creating: boolean
  onCreate: (input: CreateDeliveryZoneInput) => Promise<void>
}

export default function AddDeliveryZoneDialog({
  open,
  onOpenChange,
  creating,
  onCreate,
}: AddDeliveryZoneDialogProps) {
  const [zoneName, setZoneName] = useState("")
  const [description, setDescription] = useState("")
  const [deliveryFee, setDeliveryFee] = useState("")

  const [regionPsgcCode, setRegionPsgcCode] = useState("")
  const [provincePsgcCode, setProvincePsgcCode] = useState("")
  const [cityPsgcCode, setCityPsgcCode] = useState("")

  const [regions, setRegions] = useState<PSGCRegion[]>([])
  const [provinces, setProvinces] = useState<PSGCProvince[]>([])
  const [cities, setCities] = useState<PSGCCity[]>([])

  const [loadingRegions, setLoadingRegions] = useState(false)
  const [loadingProvinces, setLoadingProvinces] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)

  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    let cancelled = false

    async function loadRegions() {
      try {
        setLoadingRegions(true)

        const data = await getRegions()

        if (!cancelled) {
          setRegions(data)
        }
      } catch (error) {
        console.error("Failed to load regions:", error)

        if (!cancelled) {
          setSubmitError("Failed to load regions")
        }
      } finally {
        if (!cancelled) {
          setLoadingRegions(false)
        }
      }
    }

    loadRegions()

    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!regionPsgcCode) {
      setProvinces([])
      setCities([])
      return
    }

    let cancelled = false

    async function loadProvinces() {
      try {
        setLoadingProvinces(true)

        const data = await getProvinces(regionPsgcCode)

        if (cancelled) {
          return
        }

        setProvinces(data)

        if (data.length === 0) {
          setLoadingCities(true)

          const cityData = await getCities(
            regionPsgcCode,
            null
          )

          if (!cancelled) {
            setCities(cityData)
          }

          setLoadingCities(false)
        } else {
          setCities([])
        }
      } catch (error) {
        console.error("Failed to load provinces:", error)

        if (!cancelled) {
          setProvinces([])
          setCities([])
        }
      } finally {
        if (!cancelled) {
          setLoadingProvinces(false)
        }
      }
    }

    loadProvinces()

    return () => {
      cancelled = true
    }
  }, [regionPsgcCode])

  useEffect(() => {
    if (!regionPsgcCode || !provincePsgcCode) {
      return
    }

    let cancelled = false

    async function loadCities() {
      try {
        setLoadingCities(true)

        const data = await getCities(
          regionPsgcCode,
          provincePsgcCode
        )

        if (!cancelled) {
          setCities(data)
        }
      } catch (error) {
        console.error("Failed to load cities:", error)

        if (!cancelled) {
          setCities([])
        }
      } finally {
        if (!cancelled) {
          setLoadingCities(false)
        }
      }
    }

    loadCities()

    return () => {
      cancelled = true
    }
  }, [regionPsgcCode, provincePsgcCode])

  const resetForm = () => {
    setZoneName("")
    setDescription("")
    setDeliveryFee("")

    setRegionPsgcCode("")
    setProvincePsgcCode("")
    setCityPsgcCode("")

    setProvinces([])
    setCities([])

    setSubmitError(null)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (creating) {
      return
    }

    if (!nextOpen) {
      resetForm()
    }

    onOpenChange(nextOpen)
  }

  const handleRegionChange = (value: string) => {
    setRegionPsgcCode(value)
    setProvincePsgcCode("")
    setCityPsgcCode("")

    setProvinces([])
    setCities([])
    setSubmitError(null)
  }

  const handleProvinceChange = (value: string) => {
    setProvincePsgcCode(value)
    setCityPsgcCode("")

    setCities([])
    setSubmitError(null)
  }

  const handleCityChange = (value: string) => {
    setCityPsgcCode(value)
    setSubmitError(null)
  }

  const handleSubmit = async () => {
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

      if (!cityPsgcCode) {
        setSubmitError("Select a city or municipality")
        return
      }

      await onCreate({
        zoneName: trimmedZoneName,
        description: description.trim() || null,
        deliveryFee: parsedDeliveryFee,
        cityPsgcCodes: [cityPsgcCode],
      })

      resetForm()
      onOpenChange(false)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create delivery zone"
      )
    }
  }

  const hasProvinces = provinces.length > 0

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Delivery Zone</DialogTitle>

          <DialogDescription>
            Create a delivery zone and assign its initial city
            or municipality.
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
              placeholder="e.g. Bulacan Zone"
              disabled={creating}
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
              placeholder="Describe the delivery coverage for this zone."
              className="min-h-[80px] resize-none"
              disabled={creating}
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
              placeholder="0.00"
              disabled={creating}
            />

            <p className="text-xs text-muted-foreground">
              This fee will be used for future orders
              delivered to cities assigned to this zone.
            </p>
          </div>

          <div className="border-t pt-5">
            <h3 className="font-medium">
              Initial City / Municipality
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Select the first city covered by this delivery
              zone.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Region
            </label>

            <Select
              value={regionPsgcCode}
              onValueChange={handleRegionChange}
              disabled={creating || loadingRegions}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingRegions
                      ? "Loading regions..."
                      : "Select region"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {regions.map((region) => (
                  <SelectItem
                    key={region.psgc_code}
                    value={region.psgc_code}
                  >
                    {region.region_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {regionPsgcCode && hasProvinces && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Province
              </label>

              <Select
                value={provincePsgcCode}
                onValueChange={handleProvinceChange}
                disabled={creating || loadingProvinces}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingProvinces
                        ? "Loading provinces..."
                        : "Select province"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem
                      key={province.psgc_code}
                      value={province.psgc_code}
                    >
                      {province.province_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              City / Municipality
            </label>

            <Select
              value={cityPsgcCode}
              onValueChange={handleCityChange}
              disabled={
                creating ||
                !regionPsgcCode ||
                loadingCities ||
                (hasProvinces && !provincePsgcCode)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingCities
                      ? "Loading cities..."
                      : "Select city / municipality"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {cities.map((city) => (
                  <SelectItem
                    key={city.psgc_code}
                    value={city.psgc_code}
                  >
                    {city.city_name}
                    {city.locality_type
                      ? ` (${city.locality_type})`
                      : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            disabled={creating}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={creating}
          >
            {creating
              ? "Creating..."
              : "Create Delivery Zone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}