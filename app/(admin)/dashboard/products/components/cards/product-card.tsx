"use client"

import Image from "next/image"
import { Edit, Archive, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import type { ProductWithDetails } from "../../types/product"

interface ProductCardProps {
  product: ProductWithDetails

  onEdit: (product: ProductWithDetails) => void

  onArchive: (product: ProductWithDetails) => void
}

export function ProductCard({ product, onEdit, onArchive }: ProductCardProps) {
  const thumbnail =
    product.images.length > 0 ? product.images[0].image_url : null

  return (
    <Card className="h-full gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-sm ring-0 transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/2] overflow-hidden border-b border-border/60 bg-muted">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.product_name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      <CardContent className="flex-1 space-y-3 p-4">
        <div>
          <h3 className="line-clamp-2 text-base leading-6 font-semibold tracking-tight">
            {product.product_name}
          </h3>

          <p className="text-xs leading-5 text-muted-foreground">
            {product.product_code}
          </p>
          {product.width !== null &&
            product.height !== null &&
            product.depth !== null && (
              <p className="text-xs leading-5 text-muted-foreground">
                {product.width} &times; {product.height} &times; {product.depth}{" "}
                {product.dimension_unit}
              </p>
            )}
        </div>

        <p className="text-xs text-muted-foreground">
          Product Markup: {product.markup_percentage.toFixed(2)}%
        </p>

        <div className="flex flex-wrap gap-1.5 [&_[data-slot=badge]]:rounded-full [&_[data-slot=badge]]:px-2 [&_[data-slot=badge]]:text-[10px]">
          <Badge variant="secondary">{product.category}</Badge>

          <Badge variant="outline">{product.product_type}</Badge>

          {product.is_customizable && <Badge>Customizable</Badge>}
        </div>

        <div className="space-y-2 rounded-lg border border-border/50 bg-muted/30 p-3">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
            <span className="text-muted-foreground">Production Cost</span>

            <span className="font-medium tabular-nums">
              &#8369;
              {(product.pricing?.productionCost ?? 0).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
            <span className="text-muted-foreground">Markup</span>

            <span className="font-medium text-foreground tabular-nums">
              &#8369;
              {(product.pricing?.totalMarkup ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs">
            <span className="text-muted-foreground">Selling Price</span>

            <span className="text-base font-semibold text-primary tabular-nums">
              &#8369;
              {(product.pricing?.sellingPrice ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border/60 pt-2">
            <div className="text-xs leading-5 text-muted-foreground">
              Materials: {product.materials.length}
            </div>

            <div className="text-xs leading-5 text-muted-foreground">
              Labor Services: {product.labor.length}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex flex-wrap gap-2 border-t border-border/60 bg-muted/20 p-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 min-w-0 flex-1 rounded-md bg-card px-2 text-xs shadow-none"
          onClick={() => onEdit(product)}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <Button
          variant="destructive"
          size="sm"
          className="h-9 flex-1 rounded-lg text-xs shadow-none"
          onClick={() => onArchive(product)}
        >
          <Archive className="mr-2 h-4 w-4" />
          Archive
        </Button>
        {!product.is_active && <Badge variant="destructive">Archived</Badge>}
      </CardFooter>
    </Card>
  )
}
