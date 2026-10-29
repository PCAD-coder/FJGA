"use client"

import { useEffect, useState } from "react"
import {
  CalendarDays,
  CheckCircle2,
  Loader2,
  MapPin,
  Ruler,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ContactNumberInput } from "@/components/ui/contact-number-input"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

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
  getDeliveryLocationCoverage,
  type DeliveryLocationCoverage,
} from "@/app/services/delivery/delivery-zone-service"

import {
  createSiteVisitRequest,
  getSiteVisitFeePreview,
} from "../../services/site-visit.service"

import type {
  SiteVisitFeePreview,
  SiteVisitTimeSlot,
} from "../../types/site-visit"

interface RequestSiteVisitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void | Promise<void>
}

const EMPTY_ADDRESS: DeliveryAddressInput = {
  houseBuildingNumber: "",
  street: "",
  buildingSubdivision: "",
  unitFloor: "",

  regionPsgcCode: "",
  regionName: "",

  provincePsgcCode: null,
  provinceName: null,

  cityPsgcCode: "",
  cityName: "",

  barangayPsgcCode: "",
  barangayName: "",

  postalCode: "",
  landmark: "",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value)
}

export function RequestSiteVisitDialog({
  open,
  onOpenChange,
  onSuccess,
}: RequestSiteVisitDialogProps) {
  const [contactNumber, setContactNumber] = useState("")
  const [preferredDate, setPreferredDate] = useState("")
  const [preferredTimeSlot, setPreferredTimeSlot] =
    useState<SiteVisitTimeSlot>("morning")

  const [purpose, setPurpose] = useState("measurement")
  const [clientNotes, setClientNotes] = useState("")

  const [address, setAddress] =
    useState<DeliveryAddressInput>(EMPTY_ADDRESS)

  const [regions, setRegions] = useState<PSGCRegion[]>([])
  const [provinces, setProvinces] = useState<PSGCProvince[]>([])
  const [cities, setCities] = useState<PSGCCity[]>([])
  const [barangays, setBarangays] = useState<PSGCBarangay[]>([])

  const [isLoadingRegions, setIsLoadingRegions] = useState(false)
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [isLoadingBarangays, setIsLoadingBarangays] = useState(false)

  const [coverage, setCoverage] =
    useState<DeliveryLocationCoverage | null>(null)

  const [isCheckingCoverage, setIsCheckingCoverage] = useState(false)
  const [isCheckingFee, setIsCheckingFee] = useState(false)

  const [feePreview, setFeePreview] =
    useState<SiteVisitFeePreview | null>(null)

  const [feeChecked, setFeeChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = new Date()
  const minimumDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-")

  function resetForm() {
    setContactNumber("")
    setPreferredDate("")
    setPreferredTimeSlot("morning")
    setPurpose("measurement")
    setClientNotes("")

    setAddress(EMPTY_ADDRESS)

    setProvinces([])
    setCities([])
    setBarangays([])

    setCoverage(null)
    setFeePreview(null)
    setFeeChecked(false)
  }

  useEffect(() => {
    if (!open) return

    async function loadRegions() {
      try {
        setIsLoadingRegions(true)

        const result = await getRegions()
        setRegions(result)
      } catch (error) {
        console.error("Failed to load regions:", error)
        toast.error("Unable to load regions.")
      } finally {
        setIsLoadingRegions(false)
      }
    }

    void loadRegions()
  }, [open])

  useEffect(() => {
    if (!address.regionPsgcCode) {
      setProvinces([])
      return
    }

    async function loadProvinces() {
      try {
        setIsLoadingProvinces(true)

        const result = await getProvinces(address.regionPsgcCode)
        setProvinces(result)
      } catch (error) {
        console.error("Failed to load provinces:", error)
        setProvinces([])
      } finally {
        setIsLoadingProvinces(false)
      }
    }

    void loadProvinces()
  }, [address.regionPsgcCode])

  useEffect(() => {
    if (!address.regionPsgcCode) {
      setCoverage(null)
      return
    }

    async function checkCoverage() {
      try {
        setIsCheckingCoverage(true)

        const result = await getDeliveryLocationCoverage(
          address.regionPsgcCode,
          address.provincePsgcCode,
          address.cityPsgcCode || null
        )

        setCoverage(result)
      } catch (error) {
        console.error("Failed to check visit coverage:", error)
        setCoverage(null)
      } finally {
        setIsCheckingCoverage(false)
      }
    }

    void checkCoverage()
  }, [
    address.regionPsgcCode,
    address.provincePsgcCode,
    address.cityPsgcCode,
  ])

  useEffect(() => {
    if (!address.regionPsgcCode) {
      setCities([])
      return
    }

    if (provinces.length > 0 && !address.provincePsgcCode) {
      setCities([])
      return
    }

    async function loadCities() {
      try {
        setIsLoadingCities(true)

        const result = await getCities(
          address.regionPsgcCode,
          address.provincePsgcCode
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
  }, [
    address.regionPsgcCode,
    address.provincePsgcCode,
    provinces.length,
  ])

  useEffect(() => {
    if (!address.cityPsgcCode) {
      setBarangays([])
      return
    }

    async function loadBarangays() {
      try {
        setIsLoadingBarangays(true)

        const result = await getBarangays(address.cityPsgcCode)
        setBarangays(result)
      } catch (error) {
        console.error("Failed to load barangays:", error)
        setBarangays([])
      } finally {
        setIsLoadingBarangays(false)
      }
    }

    void loadBarangays()
  }, [address.cityPsgcCode])

  useEffect(() => {
    if (!address.cityPsgcCode || !address.barangayPsgcCode) {
      setFeePreview(null)
      setFeeChecked(false)
      return
    }

    async function loadFee() {
      try {
        setIsCheckingFee(true)
        setFeeChecked(false)

        const result = await getSiteVisitFeePreview(
          address.cityPsgcCode,
          address.barangayPsgcCode
        )

        setFeePreview(result)
      } catch (error) {
        console.error("Failed to calculate site visit fee:", error)
        setFeePreview(null)
      } finally {
        setIsCheckingFee(false)
        setFeeChecked(true)
      }
    }

    void loadFee()
  }, [address.cityPsgcCode, address.barangayPsgcCode])

  function updateAddress<K extends keyof DeliveryAddressInput>(
    field: K,
    value: DeliveryAddressInput[K]
  ) {
    setAddress((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleRegionChange(regionCode: string) {
    const region = regions.find(
      (item) => item.psgc_code === regionCode
    )

    setAddress((current) => ({
      ...current,

      regionPsgcCode: regionCode,
      regionName: region?.region_name ?? "",

      provincePsgcCode: null,
      provinceName: null,

      cityPsgcCode: "",
      cityName: "",

      barangayPsgcCode: "",
      barangayName: "",
    }))

    setProvinces([])
    setCities([])
    setBarangays([])
    setCoverage(null)
    setFeePreview(null)
    setFeeChecked(false)
  }

  function handleProvinceChange(provinceCode: string) {
    const province = provinces.find(
      (item) => item.psgc_code === provinceCode
    )

    setAddress((current) => ({
      ...current,

      provincePsgcCode: provinceCode,
      provinceName: province?.province_name ?? null,

      cityPsgcCode: "",
      cityName: "",

      barangayPsgcCode: "",
      barangayName: "",
    }))

    setCities([])
    setBarangays([])
    setFeePreview(null)
    setFeeChecked(false)
  }

  function handleCityChange(cityCode: string) {
    const city = cities.find(
      (item) => item.psgc_code === cityCode
    )

    setAddress((current) => ({
      ...current,

      cityPsgcCode: cityCode,
      cityName: city?.city_name ?? "",

      barangayPsgcCode: "",
      barangayName: "",
    }))

    setBarangays([])
    setFeePreview(null)
    setFeeChecked(false)
  }

  function handleBarangayChange(barangayCode: string) {
    const barangay = barangays.find(
      (item) => item.psgc_code === barangayCode
    )

    setAddress((current) => ({
      ...current,
      barangayPsgcCode: barangayCode,
      barangayName: barangay?.barangay_name ?? "",
    }))
  }

  async function handleSubmit() {
    if (!/^[0-9]{11}$/.test(contactNumber)) {
      toast.error("Contact number must contain exactly 11 digits.")
      return
    }

    if (!address.houseBuildingNumber.trim()) {
      toast.error("House or building number is required.")
      return
    }

    if (!address.street.trim()) {
      toast.error("Street is required.")
      return
    }

    if (!address.regionPsgcCode) {
      toast.error("Region is required.")
      return
    }

    if (provinces.length > 0 && !address.provincePsgcCode) {
      toast.error("Province is required.")
      return
    }

    if (!address.cityPsgcCode) {
      toast.error("City or municipality is required.")
      return
    }

    if (!address.barangayPsgcCode) {
      toast.error("Barangay is required.")
      return
    }

    if (!feePreview) {
      toast.error(
        "On-site visitation is not available for the selected location."
      )
      return
    }

    if (!preferredDate) {
      toast.error("Preferred visit date is required.")
      return
    }

    try {
      setIsSubmitting(true)

      await createSiteVisitRequest({
        contactNumber,
        preferredDate,
        preferredTimeSlot,
        purpose,
        clientNotes,
        address,
      })

      toast.success("On-site visit request submitted successfully.")

      resetForm()
      onOpenChange(false)

      await onSuccess?.()
    } catch (error) {
      console.error("Failed to submit site visit request:", error)

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to submit the on-site visit request."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const regionHasProvinces = provinces.length > 0

  const isBusy =
    isCheckingCoverage ||
    isCheckingFee ||
    isLoadingRegions ||
    isLoadingProvinces ||
    isLoadingCities ||
    isLoadingBarangays

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSubmitting) return

        if (!nextOpen) {
          resetForm()
        }

        onOpenChange(nextOpen)
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Request On-Site Visit
          </DialogTitle>

          <DialogDescription>
            Request FJGA to visit your location for professional site
            inspection and measurement.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-semibold">Payment during the visit</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Payment for the on-site visit fee must be settled during the
              on-site visit. Please prepare the payment before your scheduled
              visit.
            </p>
          </div>

          <section className="space-y-4">
            <div>
              <h3 className="font-semibold">Contact Information</h3>

              <p className="text-sm text-muted-foreground">
                FJGA will use this number when coordinating your visit.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visit-contact">
                Contact Number
                <span className="ml-1 text-destructive">*</span>
              </Label>

              <ContactNumberInput
                required
                id="visit-contact"
                value={contactNumber}
                onChange={(event) =>
                  setContactNumber(event.target.value)
                }
                placeholder="e.g. 09123456789"
              />
            </div>
          </section>

          <section className="space-y-4 border-t pt-6">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />

              <div>
                <h3 className="font-semibold">Visit Address</h3>

                <p className="text-sm text-muted-foreground">
                  Enter the location FJGA should visit for measurement.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  Region
                  <span className="ml-1 text-destructive">*</span>
                </Label>

                <Select
                  value={address.regionPsgcCode}
                  onValueChange={handleRegionChange}
                  disabled={isLoadingRegions}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingRegions
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

              {regionHasProvinces && (
                <div className="space-y-2">
                  <Label>
                    Province
                    <span className="ml-1 text-destructive">*</span>
                  </Label>

                  <Select
                    value={address.provincePsgcCode ?? ""}
                    onValueChange={handleProvinceChange}
                    disabled={
                      !address.regionPsgcCode ||
                      isLoadingProvinces
                    }
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
                  value={address.cityPsgcCode}
                  onValueChange={handleCityChange}
                  disabled={
                    !address.regionPsgcCode ||
                    (regionHasProvinces &&
                      !address.provincePsgcCode) ||
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

              <div className="space-y-2">
                <Label>
                  Barangay
                  <span className="ml-1 text-destructive">*</span>
                </Label>

                <Select
                  value={address.barangayPsgcCode}
                  onValueChange={handleBarangayChange}
                  disabled={
                    !address.cityPsgcCode ||
                    isLoadingBarangays
                  }
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
                <Label htmlFor="visit-house">
                  House / Building Number
                  <span className="ml-1 text-destructive">*</span>
                </Label>

                <Input
                  id="visit-house"
                  value={address.houseBuildingNumber}
                  onChange={(event) =>
                    updateAddress(
                      "houseBuildingNumber",
                      event.target.value
                    )
                  }
                  placeholder="e.g. 248"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit-street">
                  Street
                  <span className="ml-1 text-destructive">*</span>
                </Label>

                <Input
                  id="visit-street"
                  value={address.street}
                  onChange={(event) =>
                    updateAddress("street", event.target.value)
                  }
                  placeholder="e.g. Camia Street"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit-subdivision">
                  Building / Subdivision
                </Label>

                <Input
                  id="visit-subdivision"
                  value={address.buildingSubdivision}
                  onChange={(event) =>
                    updateAddress(
                      "buildingSubdivision",
                      event.target.value
                    )
                  }
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit-unit">Unit / Floor</Label>

                <Input
                  id="visit-unit"
                  value={address.unitFloor}
                  onChange={(event) =>
                    updateAddress("unitFloor", event.target.value)
                  }
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit-postal">Postal Code</Label>

                <Input
                  id="visit-postal"
                  value={address.postalCode}
                  onChange={(event) =>
                    updateAddress("postalCode", event.target.value)
                  }
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit-landmark">Landmark</Label>

                <Input
                  id="visit-landmark"
                  value={address.landmark}
                  onChange={(event) =>
                    updateAddress("landmark", event.target.value)
                  }
                  placeholder="Nearby landmark"
                />
              </div>
            </div>

            {address.regionPsgcCode && (
              <div>
                {isCheckingCoverage || isCheckingFee ? (
                  <div className="flex items-center gap-3 rounded-lg border p-4">
                    <Loader2 className="h-5 w-5 animate-spin" />

                    <p className="text-sm">
                      Checking on-site visit availability...
                    </p>
                  </div>
                ) : address.barangayPsgcCode &&
                  feeChecked &&
                  feePreview ? (
                  <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />

                    <div>
                      <p className="font-semibold">
                        On-Site Visit Available
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        FJGA can provide an on-site measurement service
                        at this location.
                      </p>
                    </div>
                  </div>
                ) : address.barangayPsgcCode && feeChecked ? (
                  <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <XCircle className="mt-0.5 h-5 w-5 text-destructive" />

                    <div>
                      <p className="font-semibold text-destructive">
                        On-Site Visit Unavailable
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        FJGA currently does not provide on-site visits
                        to this barangay.
                      </p>
                    </div>
                  </div>
                ) : coverage && !coverage.isAvailable ? (
                  <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <XCircle className="mt-0.5 h-5 w-5 text-destructive" />

                    <p className="text-sm">
                      FJGA currently does not cover this selected area.
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </section>

          <section className="space-y-4 border-t pt-6">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 text-primary" />

              <div>
                <h3 className="font-semibold">Preferred Visit</h3>

                <p className="text-sm text-muted-foreground">
                  Your preferred schedule is subject to FJGA
                  confirmation.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="preferred-date">
                  Preferred Date
                  <span className="ml-1 text-destructive">*</span>
                </Label>

                <Input
                  id="preferred-date"
                  type="date"
                  min={minimumDate}
                  value={preferredDate}
                  onChange={(event) =>
                    setPreferredDate(event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Preferred Time</Label>

                <Select
                  value={preferredTimeSlot}
                  onValueChange={(value) =>
                    setPreferredTimeSlot(
                      value as SiteVisitTimeSlot
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="morning">
                      Morning
                    </SelectItem>

                    <SelectItem value="afternoon">
                      Afternoon
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Purpose</Label>

              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="measurement">
                    Measurement
                  </SelectItem>

                  <SelectItem value="site_inspection">
                    Site Inspection & Measurement
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visit-notes">
                Additional Notes
              </Label>

              <Textarea
                id="visit-notes"
                value={clientNotes}
                onChange={(event) =>
                  setClientNotes(event.target.value)
                }
                placeholder="Access instructions, project concerns, or other information FJGA should know..."
                rows={4}
              />
            </div>
          </section>

          {feePreview && (
            <section className="space-y-4 border-t pt-6">
              <div>
                <h3 className="font-semibold">
                  Estimated Visit Fee
                </h3>

                <p className="text-sm text-muted-foreground">
                  Includes professional measurement service and
                  travel to your selected location.
                </p>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      On-Site Measurement
                    </span>

                    <span>
                      {formatCurrency(feePreview.serviceFee)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Travel Fee
                    </span>

                    <span>
                      {formatCurrency(feePreview.travelFee)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
                    <span>Estimated Total</span>

                    <span>
                      {formatCurrency(feePreview.totalFee)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                The final fee is calculated securely when your
                request is submitted.
              </p>
            </section>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              isSubmitting ||
              isBusy ||
              !feePreview ||
              !preferredDate
            }
            onClick={() => void handleSubmit()}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
