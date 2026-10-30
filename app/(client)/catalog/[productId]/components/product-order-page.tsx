"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ContactNumberInput } from "@/components/ui/contact-number-input"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

import { getCustomizedPrice } from "../actions/get-customized-price"

import { createCustomizedOrder } from "../actions/create-customized-order"

import type { ProductVariants } from "../services/material-variants"

import {
  getDeliveryFeeForAddress,
  getDeliveryLocationCoverage,
  type DeliveryLocationCoverage,
} from "../services/delivery-service"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import OrderAddressForm from "./order-address-form"
import type { OrderAddressFormInput } from "../../types/address"
import type { PaymentMethod } from "@/app/(admin)/dashboard/orders/types/order"

interface ProductOrderPageProps {
  contactNumber: string | null
  product: {
    id: string
    name: string
    description: string
    image: string
    width: number
    height: number
    depth: number
    isCustomizable: boolean
    isDepthCustomizable: boolean
  }
  initialPrice: number
  variants: ProductVariants
  defaultAluminumVariantId: string
  defaultGlassVariantId: string
}

export default function ProductOrderPage({
  contactNumber,
  product,
  initialPrice,
  variants,
  defaultAluminumVariantId,
  defaultGlassVariantId,
}: ProductOrderPageProps) {
  const [width, setWidth] = useState(product.width)
  const [height, setHeight] = useState(product.height)
  const [depth, setDepth] = useState(product.depth)
  const [quantityInput, setQuantityInput] = useState("1")
  const router = useRouter()
  const quantity = Number(quantityInput)
  const [notes, setNotes] = useState("")
  const [customerContactNumber, setCustomerContactNumber] = useState(
    contactNumber ?? ""
  )
  const [paymentMethod, setPaymentMethod] =
  useState<PaymentMethod>("cash")
  const [address, setAddress] = useState<OrderAddressFormInput>({
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
  })
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [deliveryZoneName, setDeliveryZoneName] = useState("")
  const [loadingDeliveryFee, setLoadingDeliveryFee] = useState(false)
  const [deliveryUnavailable, setDeliveryUnavailable] = useState(false)
  const [locationCoverage, setLocationCoverage] =
    useState<DeliveryLocationCoverage | null>(null)

  const [loadingLocationCoverage, setLoadingLocationCoverage] = useState(false)

  const [estimatedPrice, setEstimatedPrice] = useState(initialPrice)

  const [selectedAluminumVariant, setSelectedAluminumVariant] = useState(
    defaultAluminumVariantId
  )

  const [selectedGlassVariant, setSelectedGlassVariant] = useState(
    defaultGlassVariantId
  )
  const [selectedHandleVariant, setSelectedHandleVariant] = useState(
    variants.handles[0]?.id ?? ""
  )

  const [selectedLockVariant, setSelectedLockVariant] = useState(
    variants.locks[0]?.id ?? ""
  )

  const [selectedHingeVariant, setSelectedHingeVariant] = useState(
    variants.hinges[0]?.id ?? ""
  )

  const [selectedRollerVariant, setSelectedRollerVariant] = useState(
    variants.rollers[0]?.id ?? ""
  )
  console.log("Catalog variants", variants)

  useEffect(() => {
    const timeout = setTimeout(async () => {
      try {
const result = await getCustomizedPrice(product.id, {
  width,
  height,
  depth,
  aluminumVariantId: selectedAluminumVariant,
  glassVariantId: selectedGlassVariant,
  handleVariantId: selectedHandleVariant,
  lockVariantId: selectedLockVariant,
  hingeVariantId: selectedHingeVariant,
  rollerVariantId: selectedRollerVariant,
})

        setEstimatedPrice(result.sellingPrice)
      } catch (err) {
        console.error(err)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [
  width,
  height,
  depth,
  selectedAluminumVariant,
  selectedGlassVariant,
  selectedHandleVariant,
  selectedLockVariant,
  selectedHingeVariant,
  selectedRollerVariant,
  product.id,
])
  useEffect(() => {
    if (!address.regionPsgcCode) {
      setLocationCoverage(null)
      setLoadingLocationCoverage(false)
      return
    }

    let cancelled = false

    async function loadLocationCoverage() {
      try {
        setLoadingLocationCoverage(true)

        const result = await getDeliveryLocationCoverage(
          address.regionPsgcCode,
          address.provincePsgcCode,
          address.cityPsgcCode || null
        )

        if (!cancelled) {
          setLocationCoverage(result)
        }
      } catch (error) {
        console.error("Failed to load delivery coverage:", error)

        if (!cancelled) {
          setLocationCoverage(null)
        }
      } finally {
        if (!cancelled) {
          setLoadingLocationCoverage(false)
        }
      }
    }

    void loadLocationCoverage()

    return () => {
      cancelled = true
    }
  }, [address.regionPsgcCode, address.provincePsgcCode, address.cityPsgcCode])

  useEffect(() => {
    if (!address.cityPsgcCode || !address.barangayPsgcCode) {
      setDeliveryFee(0)
      setDeliveryZoneName("")
      setDeliveryUnavailable(false)
      setLoadingDeliveryFee(false)
      return
    }

    let cancelled = false

    async function loadDeliveryFee() {
      try {
        setLoadingDeliveryFee(true)
        setDeliveryUnavailable(false)
        setDeliveryFee(0)
        setDeliveryZoneName("")

        const result = await getDeliveryFeeForAddress(
          address.cityPsgcCode,
          address.barangayPsgcCode
        )

        if (cancelled) {
          return
        }

        if (!result) {
          setDeliveryUnavailable(true)
          return
        }

        setDeliveryFee(result.deliveryFee)
        setDeliveryZoneName(result.zoneName)
        setDeliveryUnavailable(false)
      } catch (error) {
        console.error("Failed to load delivery fee:", error)

        if (!cancelled) {
          setDeliveryFee(0)
          setDeliveryZoneName("")
          setDeliveryUnavailable(true)
        }
      } finally {
        if (!cancelled) {
          setLoadingDeliveryFee(false)
        }
      }
    }

    loadDeliveryFee()

    return () => {
      cancelled = true
    }
  }, [address.cityPsgcCode, address.barangayPsgcCode])

  const [placingOrder, setPlacingOrder] = useState(false)

  const handlePlaceOrder = async () => {
    try {
      if (
        !quantityInput.trim() ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 50
      ) {
        toast.error("Please enter a quantity between 1 and 50.")
        return
      }

      if (!/^09[0-9]{9}$/.test(customerContactNumber)) {
        toast.error("Contact number must start with 09 and contain exactly 11 digits.")
        return
      }
      if (!/^\d+$/.test(address.houseBuildingNumber)) {
        toast.error("House or building number must contain whole numbers only.")
        return
      }

      if (!address.street.trim()) {
        toast.error("Please enter your street.")
        return
      }

      if (!address.regionPsgcCode) {
        toast.error("Please select your region.")
        return
      }

      if (!address.cityPsgcCode) {
        toast.error("Please select your city or municipality.")
        return
      }

      if (!address.barangayPsgcCode) {
        toast.error("Please select your barangay.")
        return
      }

      if (loadingLocationCoverage) {
        toast.error("Please wait while we check delivery coverage.")
        return
      }

      if (locationCoverage && !locationCoverage.isAvailable) {
        toast.error(
          "Delivery is currently unavailable for this location. Please select another delivery location."
        )
        return
      }
      if (loadingDeliveryFee) {
        toast.error("Please wait while we check delivery availability.")
        return
      }

      if (deliveryUnavailable) {
        toast.error(
          "Delivery is currently unavailable for this location. Please contact FJGA for assistance."
        )
        return
      }

      setPlacingOrder(true)

      await createCustomizedOrder({
  productId: product.id,
  width,
  height,
  depth,
  quantity,
  notes,
  address,
  customerContactNumber: customerContactNumber.trim(),
  paymentMethod,
  aluminumVariantId: selectedAluminumVariant || undefined,
  glassVariantId: selectedGlassVariant || undefined,
  handleVariantId: selectedHandleVariant || undefined,
  lockVariantId: selectedLockVariant || undefined,
  hingeVariantId: selectedHingeVariant || undefined,
  rollerVariantId: selectedRollerVariant || undefined,
})

      router.push("/my-orders?orderCreated=1")
    } catch (error) {
      console.error("Failed to place customized order:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to place your order. Please try again."
      )
      setPlacingOrder(false)
    }
  }

  const productTotal = estimatedPrice * quantity

  const vatRate = 12

  const vatInclusiveUnitPrice =
    Math.round((estimatedPrice * (1 + vatRate / 100) + Number.EPSILON) * 100) /
    100

  const vatAmount =
    Math.round((productTotal * (vatRate / 100) + Number.EPSILON) * 100) / 100

  const totalPrice =
    Math.round(
      (productTotal + vatAmount + deliveryFee + Number.EPSILON) * 100
    ) / 100

  const deliveryCoverageUnavailable =
    locationCoverage !== null && !locationCoverage.isAvailable

  const deliverySelectionIncomplete =
    !address.regionPsgcCode ||
    !address.cityPsgcCode ||
    !address.barangayPsgcCode

  const cannotPlaceOrder =
    placingOrder ||
    loadingLocationCoverage ||
    loadingDeliveryFee ||
    deliveryCoverageUnavailable ||
    deliveryUnavailable ||
    deliverySelectionIncomplete

  return (
    <div className="mx-auto w-full max-w-7xl px-1 pt-4 pb-16 sm:px-4 lg:px-6">
      <Button asChild variant="outline" className="mb-4">
        <Link href="/catalog">
          <ArrowLeft aria-hidden="true" />
          Back
        </Link>
      </Button>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8 xl:gap-12">
        <div className="overflow-hidden rounded-2xl border bg-card lg:sticky lg:top-6">
          <div className="flex aspect-square items-center justify-center bg-white p-4 sm:p-10">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="border-t px-5 py-4">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Product dimensions
            </p>
            <p className="mt-2 text-sm">
              {product.width} &times; {product.height}
              {product.depth > 0 ? ` \u00d7 ${product.depth}` : ""} cm
            </p>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border bg-card p-5 sm:p-7">
          <div className="pb-6">
            <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {product.description}
            </p>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">
                Unit price (VAT included)
              </p>

              <p className="mt-1 text-2xl font-semibold tracking-tight">
                &#8369;
                {vatInclusiveUnitPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          <div className="border-t py-6">
            <h2 className="mb-4 font-semibold">Product options</h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Width (cm)</label>
                <Input
                  type="number"
                  value={width}
                  disabled={!product.isCustomizable}
                  onChange={(e) => setWidth(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Height (cm)</label>
                <Input
                  type="number"
                  value={height}
                  disabled={!product.isCustomizable}
                  onChange={(e) => setHeight(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Depth (cm)</label>
                <Input
                  type="number"
                  value={depth}
                  disabled={!product.isDepthCustomizable}
                  onChange={(e) => setDepth(Number(e.target.value))}
                />
              </div>
            </div>

            {variants.aluminum.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Aluminum Variant</label>

                <Select
                  value={selectedAluminumVariant}
                  onValueChange={setSelectedAluminumVariant}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select aluminum variant" />
                  </SelectTrigger>

                  <SelectContent>
                    {variants.aluminum.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.color ?? variant.material_name}
                        {variant.series ? ` ${variant.series}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {variants.glass.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Glass Variant</label>

                <Select
                  value={selectedGlassVariant}
                  onValueChange={setSelectedGlassVariant}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select glass variant" />
                  </SelectTrigger>

                  <SelectContent>
                    {variants.glass.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.color ?? variant.material_name}
                        {variant.thickness ? ` — ${variant.thickness}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {(variants.handles.length > 0 ||
              variants.locks.length > 0 ||
              variants.hinges.length > 0 ||
              variants.rollers.length > 0) && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {variants.handles.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Handle</label>

                    <Select
                      value={selectedHandleVariant}
                      onValueChange={setSelectedHandleVariant}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select handle" />
                      </SelectTrigger>

                      <SelectContent>
                        {variants.handles.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            {variant.material_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {variants.locks.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Lock</label>

                    <Select
                      value={selectedLockVariant}
                      onValueChange={setSelectedLockVariant}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select lock" />
                      </SelectTrigger>

                      <SelectContent>
                        {variants.locks.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            {variant.material_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {variants.hinges.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hinge</label>

                    <Select
                      value={selectedHingeVariant}
                      onValueChange={setSelectedHingeVariant}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select hinge" />
                      </SelectTrigger>

                      <SelectContent>
                        {variants.hinges.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            {variant.material_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {variants.rollers.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Roller</label>

                    <Select
                      value={selectedRollerVariant}
                      onValueChange={setSelectedRollerVariant}
                    >
                      <SelectTrigger className="w-full bg-background">
                        <SelectValue placeholder="Select roller" />
                      </SelectTrigger>

                      <SelectContent>
                        {variants.rollers.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id}>
                            {variant.material_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>

          <section
            aria-label="Quantity and order notes"
            className="grid gap-4 border-t py-6 sm:grid-cols-[120px_minmax(0,1fr)]"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]+"
                value={quantityInput}
                onChange={(e) => {
                  const value = e.target.value
                  const nextQuantity = Number(value)
                  if (
                    value === "" ||
                    (/^\d+$/.test(value) &&
                      Number.isInteger(nextQuantity) &&
                      nextQuantity >= 1 &&
                      nextQuantity <= 50)
                  ) {
                    setQuantityInput(value)
                  }
                }}
                onBlur={() => {
                  if (!quantityInput.trim()) setQuantityInput("1")
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Order Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional instructions..."
              />
            </div>
          </section>
          {/* CONTACT NUMBER */}

          <div className="border-t py-6">
            <h2 className="mb-5 text-base font-semibold">
              Contact &amp; payment
            </h2>
            <div className="space-y-2">
              <label
                htmlFor="customer-contact-number"
                className="text-sm font-medium"
              >
                Contact Number
              </label>

              <ContactNumberInput
            require09Prefix
                required
                id="customer-contact-number"
                type="tel"
                value={customerContactNumber}
                onChange={(e) => setCustomerContactNumber(e.target.value)}
                placeholder="e.g. 09123456789"
                inputMode="tel"
              />

              <p className="text-xs text-muted-foreground">
                This number will be used to contact you regarding this order.
                Changing it here will not change your saved profile contact
                number.
              </p>
            </div>
            {/* PAYMENT METHOD */}

            <div className="mt-5 border-t pt-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Preferred Payment Method</label>

                <Select
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as PaymentMethod)
                  }
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>

                  <SelectContent>
<SelectContent>
  <SelectItem value="cash">Cash</SelectItem>
  <SelectItem value="gcash">GCash</SelectItem>
</SelectContent>
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                  Choose your preferred payment method for the required 50%
                  down payment on your order. Your selection indicates how you
                  prefer to make this payment. Production will begin once your
                  down payment is confirmed.
                </p>
              </div>
            </div>
          </div>

          {/* Address */}

          <div className="border-t py-6">
            <OrderAddressForm
              value={address}
              onChange={setAddress}
              locationCoverage={locationCoverage}
              loadingLocationCoverage={loadingLocationCoverage}
            />

            {address.regionPsgcCode && (
              <div className="mt-4 border-t pt-4">
                {loadingLocationCoverage || loadingDeliveryFee ? (
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-sm font-medium">
                      Checking delivery coverage...
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Please wait while we check your selected location.
                    </p>
                  </div>
                ) : address.barangayPsgcCode && deliveryUnavailable ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <p className="text-sm font-semibold text-destructive">
                      Delivery Unavailable
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      FJGA currently does not deliver to this barangay. Please
                      select another delivery location or contact FJGA for
                      assistance.
                    </p>
                  </div>
                ) : address.barangayPsgcCode &&
                  !deliveryUnavailable &&
                  deliveryZoneName ? (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <p className="text-sm font-semibold">Delivery Available</p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      FJGA currently delivers to your selected location.
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Delivery Zone
                        </p>

                        <p className="text-sm font-medium">
                          {deliveryZoneName}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Estimated Delivery Fee
                        </p>

                        <p className="text-sm font-medium">
                          {new Intl.NumberFormat("en-PH", {
                            style: "currency",
                            currency: "PHP",
                          }).format(deliveryFee)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : locationCoverage && !locationCoverage.isAvailable ? (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <p className="text-sm font-semibold text-destructive">
                      Delivery Coverage Unavailable
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {locationCoverage.coverageLevel === "region"
                        ? "FJGA currently does not have delivery coverage within this region. Please select another region."
                        : locationCoverage.coverageLevel === "province"
                          ? "FJGA currently does not have delivery coverage within this province. Please select another province."
                          : "FJGA currently does not deliver to this city or municipality. Please select another city or municipality."}
                    </p>
                  </div>
                ) : locationCoverage?.isAvailable ? (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <p className="text-sm font-semibold">
                      Delivery Coverage Available
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {locationCoverage.coverageLevel === "region"
                        ? "FJGA has delivery coverage within this region. Continue selecting your delivery location."
                        : locationCoverage.coverageLevel === "province"
                          ? "FJGA has delivery coverage within this province. Select your city or municipality to continue."
                          : "FJGA delivers to this city or municipality. Select your barangay to confirm final delivery availability."}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
          <aside
            aria-label="Order summary"
            className="rounded-xl border border-primary/15 bg-muted/40 p-5 sm:p-6"
          >
            <h2 className="mb-5 border-b pb-4 text-lg font-semibold">
              Order summary
            </h2>
            <div>
              <p className="text-sm text-muted-foreground">Estimated total</p>

              <p className="text-3xl font-semibold tracking-tight tabular-nums">
                ₱
                {totalPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Unit price (VAT included): ₱
                {vatInclusiveUnitPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              <p className="text-xs text-muted-foreground">
                {quantity} piece{quantity > 1 ? "s" : ""} selected
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Your final price is confirmed before the order is placed.
              </p>
            </div>
            <div className="mt-5 border-t pt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Product Total
                </span>

                <span className="font-medium">
                  ₱
                  {productTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  VAT ({vatRate}%)
                </span>

                <span className="font-medium">
                  ₱
                  {vatAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Delivery Fee
                </span>

                <span className="font-medium">
                  {loadingDeliveryFee ? (
                    "Calculating..."
                  ) : deliveryUnavailable ? (
                    "Unavailable"
                  ) : (
                    <>
                      ₱
                      {deliveryFee.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </>
                  )}
                </span>
              </div>

              {deliveryZoneName && !deliveryUnavailable && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Delivery zone: {deliveryZoneName}
                </p>
              )}

              {deliveryUnavailable && (
                <p className="mt-2 text-sm text-destructive">
                  Delivery is currently unavailable for this location. Please
                  contact FJGA for assistance.
                </p>
              )}

              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Grand Total</span>

                  <span className="text-xl font-bold">
                    ₱
                    {totalPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="mt-6 h-12 w-full rounded-lg text-sm font-semibold"
              onClick={handlePlaceOrder}
              disabled={cannotPlaceOrder}
            >
              {placingOrder
                ? "Placing Order..."
                : loadingLocationCoverage || loadingDeliveryFee
                  ? "Checking Delivery..."
                  : deliveryCoverageUnavailable || deliveryUnavailable
                    ? "Delivery Unavailable"
                    : deliverySelectionIncomplete
                      ? "Complete Delivery Address"
                      : "Place Customized Order"}
            </Button>
          </aside>
        </div>
      </div>
    </div>
  )
}
