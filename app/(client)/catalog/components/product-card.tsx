"use client"

import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import type { CatalogProduct } from "../types/catalog"

import Link from "next/link"

interface Props {
  product: CatalogProduct
}

export default function ProductCard({ product }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] w-full bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{product.name}</h3>

          <p className="line-clamp-3 text-sm text-muted-foreground">
            {product.description ||
              "Custom glass and aluminum furniture product."}
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-3 text-sm">
          <p className="font-medium">Dimensions</p>
          <p className="text-muted-foreground">
            {product.width} × {product.height}
            {product.depth > 0 ? ` × ${product.depth}` : ""} cm
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="text-2xl font-bold text-primary">
              ₱
              {product.sellingPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" variant="outline">
            Customize
          </Button>

          <Button asChild className="flex-1">
            <Link href={`/catalog/${product.id}`}>Order</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
