"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Loader2, MapPin, Truck, XCircle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { DeliveryAddressInput } from "@/types/delivery-address"

import {
  getBarangays,
  getCities,
  getProvinces,
  getRegions,
  type PSGCBarangay,
  type PSGCCity,
  type PSGCProvince,
  type PSGCRegion,
} from "@/app/services/delivery/psgc-service"

import {
  getDeliveryFeeForCity,
  type DeliveryZoneResult,
} from "@/app/services/delivery/delivery-zone-service"

interface DeliveryStepProps {
  contactNumber: string
  onContactNumberChange: (value: string) => void

  data: DeliveryAddressInput
  onChange: (data: DeliveryAddressInput) => void

  deliveryZone: DeliveryZoneResult | null
  onDeliveryZoneChange: (zone: DeliveryZoneResult | null) => void
}

export function DeliveryStep({
  contactNumber,
  onContactNumberChange,
  data,
  onChange,
  deliveryZone,
  onDeliveryZoneChange,
}: DeliveryStepProps) {
  const [regions, setRegions] = useState<PSGCRegion[]>([])
  const [provinces, setProvinces] = useState<PSGCProvince[]>([])
  const [cities, setCities] = useState<PSGCCity[]>([])
  const [barangays, setBarangays] = useState<PSGCBarangay[]>([])

  const [isLoadingRegions, setIsLoadingRegions] = useState(true)
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false)
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false)

  const [deliveryChecked, setDeliveryChecked] = useState(
    Boolean(data.cityPsgcCode)
  )

  useEffect(() => {
    async function loadRegions() {
      try {
        setIsLoadingRegions(true)

        const result = await getRegions()
        setRegions(result)
      } catch (error) {
        console.error("Failed to load regions:", error)
      } finally {
        setIsLoadingRegions(false)
      }
    }

    void loadRegions()
  }, [])

  useEffect(() => {
    async function loadProvinces() {
      if (!data.regionPsgcCode) {
        setProvinces([])
        return
      }

      try {
        setIsLoadingProvinces(true)

        const result = await getProvinces(data.regionPsgcCode)
        setProvinces(result)
      } catch (error) {
        console.error("Failed to load provinces:", error)
        setProvinces([])
      } finally {
        setIsLoadingProvinces(false)
      }
    }

    void loadProvinces()
  }, [data.regionPsgcCode])

  useEffect(() => {
    async function loadCities() {
      if (!data.regionPsgcCode) {
        setCities([])
        return
      }

      /*
       * If the selected region has provinces, wait until
       * the client chooses one. If it has none (for example
       * NCR), load cities directly from the region.
       */
      if (provinces.length > 0 && !data.provincePsgcCode) {
        setCities([])
        return
      }

      try {
        setIsLoadingCities(true)

        const result = await getCities(
          data.regionPsgcCode,
          data.provincePsgcCode
        )

        setCities(result)
      } catch (error) {
        console.error("Failed to load cities:", error)
        setCities([])
      } finally {
        setIsLoadingCities(false)
      }
    }

    void loadCities()
  }, [data.regionPsgcCode, data.provincePsgcCode, provinces])

  useEffect(() => {
    async function loadBarangays() {
      if (!data.cityPsgcCode) {
        setBarangays([])
        return
      }

      try {
        setIsLoadingBarangays(true)

        const result = await getBarangays(data.cityPsgcCode)
        setBarangays(result)
      } catch (error) {
        console.error("Failed to load barangays:", error)
        setBarangays([])
      } finally {
        setIsLoadingBarangays(false)
      }
    }

    void loadBarangays()
  }, [data.cityPsgcCode])

  useEffect(() => {
    async function checkDelivery() {
      if (!data.cityPsgcCode) {
        onDeliveryZoneChange(null)
        setDeliveryChecked(false)
        return
      }

      try {
        setIsCheckingDelivery(true)
        setDeliveryChecked(false)

        const result = await getDeliveryFeeForCity(data.cityPsgcCode)

        onDeliveryZoneChange(result)
      } catch (error) {
        console.error("Failed to check delivery availability:", error)

        onDeliveryZoneChange(null)
      } finally {
        setIsCheckingDelivery(false)
        setDeliveryChecked(true)
      }
    }

    void checkDelivery()
  }, [data.cityPsgcCode, onDeliveryZoneChange])

  function updateField<K extends keyof DeliveryAddressInput>(
    field: K,
    value: DeliveryAddressInput[K]
  ) {
    onChange({
      ...data,
      [field]: value,
    })
  }

  function handleRegionChange(regionCode: string) {
    const region = regions.find((item) => item.psgc_code === regionCode)

    onChange({
      ...data,

      regionPsgcCode: regionCode,
      regionName: region?.region_name ?? "",

      provincePsgcCode: null,
      provinceName: null,

      cityPsgcCode: "",
      cityName: "",

      barangayPsgcCode: "",
      barangayName: "",
    })

    setProvinces([])
    setCities([])
    setBarangays([])
    onDeliveryZoneChange(null)
    setDeliveryChecked(false)
  }

  function handleProvinceChange(provinceCode: string) {
    const province = provinces.find((item) => item.psgc_code === provinceCode)

    onChange({
      ...data,

      provincePsgcCode: provinceCode,
      provinceName: province?.province_name ?? null,

      cityPsgcCode: "",
      cityName: "",

      barangayPsgcCode: "",
      barangayName: "",
    })

    setCities([])
    setBarangays([])
    onDeliveryZoneChange(null)
    setDeliveryChecked(false)
  }

  function handleCityChange(cityCode: string) {
    const city = cities.find((item) => item.psgc_code === cityCode)

    onChange({
      ...data,

      cityPsgcCode: cityCode,
      cityName: city?.city_name ?? "",

      barangayPsgcCode: "",
      barangayName: "",
    })

    setBarangays([])
    onDeliveryZoneChange(null)
    setDeliveryChecked(false)
  }

  function handleBarangayChange(barangayCode: string) {
    const barangay = barangays.find((item) => item.psgc_code === barangayCode)

    onChange({
      ...data,
      barangayPsgcCode: barangayCode,
      barangayName: barangay?.barangay_name ?? "",
    })
  }

  const regionHasProvinces = provinces.length > 0

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
          <MapPin className="h-5 w-5 text-primary" />
        </div>

        <div>
          <p className="font-semibold">Where should we deliver your project?</p>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Your delivery location helps FJGA determine whether delivery is
            available in your area and calculate the delivery fee for your
            quotation.
          </p>
        </div>
      </div>

      <section className="space-y-5">
        <div>
          <h3 className="font-semibold">Contact Information</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Provide a contact number that FJGA can use for project coordination
            and delivery.
          </p>
        </div>

        <div className="max-w-md space-y-2">
          <Label htmlFor="contact-number">
            Contact Number
            <span className="ml-1 text-destructive">*</span>
          </Label>

          <Input
            id="contact-number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={contactNumber}
            onChange={(event) => onContactNumberChange(event.target.value)}
            placeholder="e.g. 09171234567"
            maxLength={20}
          />

          <p className="text-xs text-muted-foreground">
            Enter a Philippine mobile number, such as 09171234567.
          </p>
        </div>
      </section>

      <section className="space-y-5 border-t pt-6">
        <div>
          <h3 className="font-semibold">Street Address</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Provide the exact location where the finished project should be
            delivered.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="house-building-number">
              House / Building Number
              <span className="ml-1 text-destructive">*</span>
            </Label>

            <Input
              id="house-building-number"
              value={data.houseBuildingNumber}
              onChange={(event) =>
                updateField("houseBuildingNumber", event.target.value)
              }
              placeholder="e.g. 248"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">
              Street
              <span className="ml-1 text-destructive">*</span>
            </Label>

            <Input
              id="street"
              value={data.street}
              onChange={(event) => updateField("street", event.target.value)}
              placeholder="e.g. Camia Street"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="building-subdivision">
              Building / Subdivision
              <span className="ml-1 font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>

            <Input
              id="building-subdivision"
              value={data.buildingSubdivision}
              onChange={(event) =>
                updateField("buildingSubdivision", event.target.value)
              }
              placeholder="Subdivision or building name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit-floor">
              Unit / Floor
              <span className="ml-1 font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>

            <Input
              id="unit-floor"
              value={data.unitFloor}
              onChange={(event) => updateField("unitFloor", event.target.value)}
              placeholder="Unit or floor number"
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t pt-6">
        <div>
          <h3 className="font-semibold">Location</h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Select your location using the Philippine Standard Geographic Code.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>
              Region
              <span className="ml-1 text-destructive">*</span>
            </Label>

            <Select
              value={data.regionPsgcCode}
              onValueChange={handleRegionChange}
              disabled={isLoadingRegions}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingRegions ? "Loading regions..." : "Select region"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.psgc_code} value={region.psgc_code}>
                    {region.region_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {regionHasProvinces && (
            <div className="space-y-2">
              <Label>
                Province
                <span className="ml-1 text-destructive">*</span>
              </Label>

              <Select
                value={data.provincePsgcCode ?? ""}
                onValueChange={handleProvinceChange}
                disabled={!data.regionPsgcCode || isLoadingProvinces}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingProvinces
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
            <Label>
              City / Municipality
              <span className="ml-1 text-destructive">*</span>
            </Label>

            <Select
              value={data.cityPsgcCode}
              onValueChange={handleCityChange}
              disabled={
                !data.regionPsgcCode ||
                (regionHasProvinces && !data.provincePsgcCode) ||
                isLoadingCities
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingCities
                      ? "Loading cities..."
                      : "Select city / municipality"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.psgc_code} value={city.psgc_code}>
                    {city.city_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Barangay
              <span className="ml-1 text-destructive">*</span>
            </Label>

            <Select
              value={data.barangayPsgcCode}
              onValueChange={handleBarangayChange}
              disabled={!data.cityPsgcCode || isLoadingBarangays}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingBarangays
                      ? "Loading barangays..."
                      : "Select barangay"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {barangays.map((barangay) => (
                  <SelectItem
                    key={barangay.psgc_code}
                    value={barangay.psgc_code}
                  >
                    {barangay.barangay_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="postal-code">
              Postal Code
              <span className="ml-1 font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>

            <Input
              id="postal-code"
              value={data.postalCode}
              onChange={(event) =>
                updateField("postalCode", event.target.value)
              }
              placeholder="e.g. 3020"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="landmark">
              Landmark
              <span className="ml-1 font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>

            <Input
              id="landmark"
              value={data.landmark}
              onChange={(event) => updateField("landmark", event.target.value)}
              placeholder="Nearby landmark"
            />
          </div>
        </div>
      </section>

      {data.cityPsgcCode && (
        <section className="border-t pt-6">
          {isCheckingDelivery ? (
            <div className="flex items-center gap-3 rounded-xl border p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />

              <div>
                <p className="font-medium">Checking delivery availability...</p>

                <p className="text-sm text-muted-foreground">
                  Please wait while we check your selected city.
                </p>
              </div>
            </div>
          ) : deliveryChecked && deliveryZone ? (
            <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <div className="flex-1">
                <p className="font-semibold">Delivery Available</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  FJGA currently delivers to your selected location.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Delivery Zone
                    </p>

                    <p className="mt-1 font-medium">{deliveryZone.zoneName}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Estimated Delivery Fee
                    </p>

                    <p className="mt-1 font-medium">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(deliveryZone.deliveryFee)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  The delivery fee will be confirmed when FJGA prepares your
                  official quotation.
                </p>
              </div>

              <Truck className="h-5 w-5 shrink-0 text-primary" />
            </div>
          ) : deliveryChecked ? (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

              <div>
                <p className="font-semibold text-destructive">
                  Delivery Unavailable
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  FJGA currently does not have an active delivery zone for this
                  city or municipality. Please select another delivery location.
                </p>
              </div>
            </div>
          ) : null}
        </section>
      )}
    </div>
  )
}
