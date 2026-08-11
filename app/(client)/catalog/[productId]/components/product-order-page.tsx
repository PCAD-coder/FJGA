"use client"

import { useMemo, useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { getCustomizedPrice } from "../actions/get-customized-price"

import { createCustomizedOrder } from "../actions/create-customized-order"

import type { ProductVariants } from "../services/material-variants"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductOrderPageProps {
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

  const [placingOrder, setPlacingOrder] = useState(false)

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true)

      await createCustomizedOrder({
        productId: product.id,
        width,
        height,
        depth,
        quantity,
        notes,
        aluminumVariantId: selectedAluminumVariant || undefined,
        glassVariantId: selectedGlassVariant || undefined,
      })
    } catch (error) {
      console.error("Failed to place customized order:", error)
      setPlacingOrder(false)
    }
  }
  const totalPrice = estimatedPrice * quantity

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

            <Button
              className="w-full"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Customized Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
