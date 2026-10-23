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

import type { DeliveryZone } from "../types/delivery-zone"

interface AddCityToZoneDialogProps {
  zone: DeliveryZone | null
  open: boolean
  onOpenChange: (open: boolean) => void
  addingCity: boolean
  onAddCity: (
    zoneId: string,
    cityPsgcCode: string
  ) => Promise<void>
}

export default function AddCityToZoneDialog({
  zone,
  open,
  onOpenChange,
  addingCity,
  onAddCity,
}: AddCityToZoneDialogProps) {
  const [regions, setRegions] = useState<PSGCRegion[]>([])
  const [provinces, setProvinces] = useState<PSGCProvince[]>([])
  const [cities, setCities] = useState<PSGCCity[]>([])

  const [regionPsgcCode, setRegionPsgcCode] = useState("")
  const [provincePsgcCode, setProvincePsgcCode] = useState("")
  const [cityPsgcCode, setCityPsgcCode] = useState("")

  const [loadingRegions, setLoadingRegions] = useState(false)
  const [loadingProvinces, setLoadingProvinces] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    let cancelled = false

    const loadRegions = async () => {
      try {
        setLoadingRegions(true)
        setSubmitError(null)

        const data = await getRegions()

        if (!cancelled) {
          setRegions(data)
        }
      } catch (error) {
        if (!cancelled) {
          setSubmitError(
            error instanceof Error
              ? error.message
              : "Failed to load regions"
          )
        }
      } finally {
        if (!cancelled) {
          setLoadingRegions(false)
        }
      }
    }

    void loadRegions()

    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setRegionPsgcCode("")
      setProvincePsgcCode("")
      setCityPsgcCode("")
      setProvinces([])
      setCities([])
      setSubmitError(null)
    }
  }, [open])

  const handleRegionChange = async (regionCode: string) => {
    setRegionPsgcCode(regionCode)
    setProvincePsgcCode("")
    setCityPsgcCode("")
    setProvinces([])
    setCities([])
    setSubmitError(null)

    try {
      setLoadingProvinces(true)

      const provinceData = await getProvinces(regionCode)

      setProvinces(provinceData)

      if (provinceData.length === 0) {
        setLoadingCities(true)

        const cityData = await getCities(regionCode, null)

        setCities(cityData)
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to load locations"
      )
    } finally {
      setLoadingProvinces(false)
      setLoadingCities(false)
    }
  }

  const handleProvinceChange = async (
    provinceCode: string
  ) => {
    setProvincePsgcCode(provinceCode)
    setCityPsgcCode("")
    setCities([])
    setSubmitError(null)

    try {
      setLoadingCities(true)

      const cityData = await getCities(
        regionPsgcCode,
        provinceCode
      )

      setCities(cityData)
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to load cities"
      )
    } finally {
      setLoadingCities(false)
    }
  }

  const handleSubmit = async () => {
    if (!zone) {
      return
    }

    if (!cityPsgcCode) {
      setSubmitError("Select a city")
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

    onOpenChange(nextOpen)
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
          <DialogTitle>Add City</DialogTitle>

          <DialogDescription>
            Add another city to {zone.zoneName}. Orders from
            this city will use the zone&apos;s delivery fee of{" "}
            ₱
            {zone.deliveryFee.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            .
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Region
            </label>

            <Select
              value={regionPsgcCode}
              onValueChange={handleRegionChange}
              disabled={loadingRegions || addingCity}
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

          {regionPsgcCode && provinces.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Province
              </label>

              <Select
                value={provincePsgcCode}
                onValueChange={handleProvinceChange}
                disabled={loadingProvinces || addingCity}
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

          {regionPsgcCode &&
            (provincePsgcCode ||
              (!loadingProvinces &&
                provinces.length === 0)) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  City / Municipality
                </label>

                <Select
                  value={cityPsgcCode}
                  onValueChange={setCityPsgcCode}
                  disabled={loadingCities || addingCity}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingCities
                          ? "Loading cities..."
                          : "Select city or municipality"
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
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            disabled={addingCity}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={addingCity || !cityPsgcCode}
          >
            {addingCity ? "Adding..." : "Add City"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}