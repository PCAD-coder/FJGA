"use client"

import { useEffect, useState } from "react"

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
  getRegions,
  getProvinces,
  getCities,
  getBarangays,
  type PSGCRegion,
  type PSGCProvince,
  type PSGCCity,
  type PSGCBarangay,
} from "../services/address-service"

import type { OrderAddressFormInput } from "../../types/address"

interface Props {
  value: OrderAddressFormInput
  onChange: (address: OrderAddressFormInput) => void
}

export default function OrderAddressForm({
  value,
  onChange,
}: Props) {
  const [regions, setRegions] = useState<PSGCRegion[]>([])
  const [provinces, setProvinces] = useState<PSGCProvince[]>([])
  const [cities, setCities] = useState<PSGCCity[]>([])
  const [barangays, setBarangays] = useState<PSGCBarangay[]>([])

  const [loadingRegions, setLoadingRegions] = useState(false)
  const [loadingProvinces, setLoadingProvinces] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [loadingBarangays, setLoadingBarangays] = useState(false)

  /*
   * Load regions when the form mounts.
   */
  useEffect(() => {
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
  }, [])

  /*
   * Load provinces whenever the region changes.
   */
  useEffect(() => {
    if (!value.regionPsgcCode) {
      setProvinces([])
      setCities([])
      setBarangays([])
      return
    }

    let cancelled = false

    async function loadProvinces() {
      try {
        setLoadingProvinces(true)

        const data = await getProvinces(value.regionPsgcCode)

        if (cancelled) return

        setProvinces(data)

        /*
         * NCR and other province-less regions.
         *
         * If there are no provinces, load cities directly
         * using the region.
         */
        if (data.length === 0) {
          setLoadingCities(true)

          const cityData = await getCities(
            value.regionPsgcCode,
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
  }, [value.regionPsgcCode])

  /*
   * Load cities whenever the province changes.
   *
   * For NCR, provinceCode is null and cities were already
   * loaded by the region effect above.
   */
  useEffect(() => {
    if (
      !value.regionPsgcCode ||
      !value.provincePsgcCode
    ) {
      return
    }

    let cancelled = false

    async function loadCities() {
      try {
        setLoadingCities(true)

        const data = await getCities(
          value.regionPsgcCode,
          value.provincePsgcCode
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
  }, [value.regionPsgcCode, value.provincePsgcCode])

  /*
   * Load barangays whenever the city changes.
   */
  useEffect(() => {
    if (!value.cityPsgcCode) {
      setBarangays([])
      return
    }

    let cancelled = false

    async function loadBarangays() {
      try {
        setLoadingBarangays(true)

        const data = await getBarangays(
          value.cityPsgcCode
        )

        if (!cancelled) {
          setBarangays(data)
        }
      } catch (error) {
        console.error("Failed to load barangays:", error)

        if (!cancelled) {
          setBarangays([])
        }
      } finally {
        if (!cancelled) {
          setLoadingBarangays(false)
        }
      }
    }

    loadBarangays()

    return () => {
      cancelled = true
    }
  }, [value.cityPsgcCode])

  const selectedRegion = regions.find(
    (region) =>
      region.psgc_code === value.regionPsgcCode
  )

  const selectedProvince = provinces.find(
    (province) =>
      province.psgc_code === value.provincePsgcCode
  )

  const selectedCity = cities.find(
    (city) =>
      city.psgc_code === value.cityPsgcCode
  )

  const handleRegionChange = (regionCode: string) => {
    const region = regions.find(
      (item) => item.psgc_code === regionCode
    )

    onChange({
      ...value,

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
  }

  const handleProvinceChange = (
    provinceCode: string
  ) => {
    const province = provinces.find(
      (item) => item.psgc_code === provinceCode
    )

    onChange({
      ...value,

      provincePsgcCode: provinceCode,
      provinceName: province?.province_name ?? "",

      cityPsgcCode: "",
      cityName: "",

      barangayPsgcCode: "",
      barangayName: "",
    })

    setCities([])
    setBarangays([])
  }

  const handleCityChange = (cityCode: string) => {
    const city = cities.find(
      (item) => item.psgc_code === cityCode
    )

    onChange({
      ...value,

      cityPsgcCode: cityCode,
      cityName: city?.city_name ?? "",

      barangayPsgcCode: "",
      barangayName: "",
    })

    setBarangays([])
  }

  const handleBarangayChange = (
    barangayCode: string
  ) => {
    const barangay = barangays.find(
      (item) => item.psgc_code === barangayCode
    )

    onChange({
      ...value,

      barangayPsgcCode: barangayCode,
      barangayName: barangay?.barangay_name ?? "",
    })
  }

  const hasProvinces = provinces.length > 0

  return (
    <div className="space-y-6">
      {/* Address heading */}

      <div>
        <h2 className="text-lg font-semibold">
          Delivery Address
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter the complete address where your order
          should be delivered.
        </p>
      </div>

      {/* House / street */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            House / Building Number
          </label>

          <Input
            value={value.houseBuildingNumber}
            onChange={(e) =>
              onChange({
                ...value,
                houseBuildingNumber: e.target.value,
              })
            }
            placeholder="e.g. 123"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Street
          </label>

          <Input
            value={value.street}
            onChange={(e) =>
              onChange({
                ...value,
                street: e.target.value,
              })
            }
            placeholder="e.g. Rizal Street"
          />
        </div>
      </div>

      {/* Building / subdivision */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Building / Subdivision
            <span className="ml-1 text-xs text-muted-foreground">
              Optional
            </span>
          </label>

          <Input
            value={value.buildingSubdivision ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                buildingSubdivision: e.target.value,
              })
            }
            placeholder="e.g. Greenview Subdivision"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Unit / Floor
            <span className="ml-1 text-xs text-muted-foreground">
              Optional
            </span>
          </label>

          <Input
            value={value.unitFloor ?? ""}
            onChange={(e) =>
              onChange({
                ...value,
                unitFloor: e.target.value,
              })
            }
            placeholder="e.g. Unit 4B, 2nd Floor"
          />
        </div>
      </div>

      {/* Region */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Region
        </label>

        <Select
          value={value.regionPsgcCode}
          onValueChange={handleRegionChange}
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

      {/* Province */}

      {value.regionPsgcCode && hasProvinces && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Province
          </label>

          <Select
            value={value.provincePsgcCode ?? ""}
            onValueChange={handleProvinceChange}
            disabled={loadingProvinces}
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

      {/* City / Municipality */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          City / Municipality
        </label>

        <Select
          value={value.cityPsgcCode}
          onValueChange={handleCityChange}
          disabled={
            !value.regionPsgcCode ||
            (hasProvinces && !value.provincePsgcCode) ||
            loadingCities
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

      {/* Barangay */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Barangay
        </label>

        <Select
          value={value.barangayPsgcCode}
          onValueChange={handleBarangayChange}
          disabled={
            !value.cityPsgcCode ||
            loadingBarangays
          }
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                loadingBarangays
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

      {/* Postal code */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Postal Code
          <span className="ml-1 text-xs text-muted-foreground">
            Optional
          </span>
        </label>

        <Input
          value={value.postalCode ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              postalCode: e.target.value,
            })
          }
          placeholder="e.g. 1000"
          inputMode="numeric"
        />
      </div>

      {/* Landmark */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Landmark
          <span className="ml-1 text-xs text-muted-foreground">
            Optional
          </span>
        </label>

        <Textarea
          value={value.landmark ?? ""}
          onChange={(e) =>
            onChange({
              ...value,
              landmark: e.target.value,
            })
          }
          placeholder="e.g. Near the barangay hall"
          className="min-h-[80px] resize-none"
        />
      </div>
    </div>
  )
}