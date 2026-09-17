"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { getCustomizedPrice } from "../actions/get-customized-price"

import { createCustomizedOrder } from "../actions/create-customized-order"

import type { ProductVariants } from "../services/material-variants"

import { getDeliveryFeeForCity } from "../services/delivery-service"

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
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [customerContactNumber, setCustomerContactNumber] = useState(
    contactNumber ?? ""
  )
  const [paymentMethod, setPaymentMethod] =
  useState<PaymentMethod>("cash_on_delivery")
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

  const [estimatedPrice, setEstimatedPrice] = useState(initialPrice)

  const [selectedAluminumVariant, setSelectedAluminumVariant] = useState(
    defaultAluminumVariantId
  )

  const [selectedGlassVariant, setSelectedGlassVariant] = useState(
    defaultGlassVariantId
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
    product.id,
  ])
  useEffect(() => {
    if (!address.cityPsgcCode) {
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

        const result = await getDeliveryFeeForCity(address.cityPsgcCode)

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
  }, [address.cityPsgcCode])

  const [placingOrder, setPlacingOrder] = useState(false)

  const handlePlaceOrder = async () => {
    try {
      if (!customerContactNumber.trim()) {
        alert("Please enter your contact number.")
        return
      }
      if (!address.houseBuildingNumber.trim()) {
        alert("Please enter your house or building number.")
        return
      }

      if (!address.street.trim()) {
        alert("Please enter your street.")
        return
      }

      if (!address.regionPsgcCode) {
        alert("Please select your region.")
        return
      }

      if (!address.cityPsgcCode) {
        alert("Please select your city or municipality.")
        return
      }

      if (!address.barangayPsgcCode) {
        alert("Please select your barangay.")
        return
      }
      if (loadingDeliveryFee) {
        alert("Please wait while we check delivery availability.")
        return
      }

      if (deliveryUnavailable) {
        alert(
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
      })
    } catch (error) {
      console.error("Failed to place customized order:", error)
      setPlacingOrder(false)
    }
  }

  const productTotal = estimatedPrice * quantity

  const totalPrice = productTotal + deliveryFee

  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg border object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>

            <p className="mt-2 text-muted-foreground">{product.description}</p>
          </div>

          <div className="rounded-lg border p-4">
            <h2 className="mb-4 font-semibold">Customize Product</h2>

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

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Aluminum Variant</label>
                <Select
                  value={selectedAluminumVariant}
                  onValueChange={setSelectedAluminumVariant}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Glass Variant</label>
                <Select
                  value={selectedGlassVariant}
                  onValueChange={setSelectedGlassVariant}
                >
                  <SelectTrigger>
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
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Estimated Total</p>

            <p className="text-3xl font-bold text-primary">
              ₱
              {totalPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Unit price: ₱
              {estimatedPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

            <p className="text-xs text-muted-foreground">
              {quantity} piece{quantity > 1 ? "s" : ""} selected
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Final price will be calculated on the server before the order is
              created.
            </p>
          </div>
          <div className="rounded-lg border p-4">
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

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
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
            {/* CONTACT NUMBER */}

<div className="rounded-lg border p-4">
  <div className="space-y-2">
    <label
      htmlFor="customer-contact-number"
      className="text-sm font-medium"
    >
      Contact Number
    </label>

    <Input
      id="customer-contact-number"
      type="tel"
      value={customerContactNumber}
      onChange={(e) =>
        setCustomerContactNumber(e.target.value)
      }
      placeholder="e.g. 09123456789"
      inputMode="tel"
    />

    <p className="text-xs text-muted-foreground">
      This number will be used to contact you regarding this order.
      Changing it here will not change your saved profile contact number.
    </p>
  </div>
  {/* PAYMENT METHOD */}

<div className="rounded-lg border p-4">
  <div className="space-y-2">
    <label className="text-sm font-medium">
      Payment Method
    </label>

    <Select
      value={paymentMethod}
      onValueChange={(value) =>
        setPaymentMethod(value as PaymentMethod)
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select payment method" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="cash_on_delivery">
          Cash on Delivery
        </SelectItem>
        {/*<SelectItem value="card">
          Card
        </SelectItem>
        <SelectItem value="gcash">
          Gcash
        </SelectItem>*/}
      </SelectContent>
    </Select>

    <p className="text-xs text-muted-foreground">
      Select how you would like to pay for this order.
    </p>
  </div>
</div>
</div>


{/* Address */}

<div className="rounded-lg border p-4">
  <OrderAddressForm
    value={address}
    onChange={setAddress}
  />
</div>
            <Button
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={
                placingOrder || loadingDeliveryFee || deliveryUnavailable
              }
            >
              {placingOrder
                ? "Placing Order..."
                : loadingDeliveryFee
                  ? "Checking Delivery..."
                  : deliveryUnavailable
                    ? "Delivery Unavailable"
                    : "Place Customized Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
