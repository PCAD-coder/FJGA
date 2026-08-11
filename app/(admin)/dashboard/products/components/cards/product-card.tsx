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
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square bg-muted">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={product.product_name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      <CardContent className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 font-semibold">{product.product_name}</h3>

          <p className="text-sm text-muted-foreground">
            {product.product_code}
          </p>
          {product.width !== null &&
            product.height !== null &&
            product.depth !== null && (
              <p className="text-sm text-muted-foreground">
                {product.width} × {product.height} × {product.depth}{" "}
                {product.dimension_unit}
              </p>
            )}
        </div>

        <p className="text-xs text-muted-foreground">
          Product Markup: {product.markup_percentage.toFixed(2)}%
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{product.category}</Badge>

          <Badge variant="outline">{product.product_type}</Badge>

          {product.is_customizable && <Badge>Customizable</Badge>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Production Cost</span>

            <span className="font-medium">
              ₱
              {(product.pricing?.productionCost ?? 0).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Markup</span>

            <span className="font-medium text-blue-600">
              ₱
              {(product.pricing?.totalMarkup ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Selling Price</span>

            <span className="font-semibold text-green-600">
              ₱
              {(product.pricing?.sellingPrice ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="space-y-1 border-t pt-2">
            <div className="text-sm text-muted-foreground">
              Materials: {product.materials.length}
            </div>

            <div className="text-sm text-muted-foreground">
              Labor Services: {product.labor.length}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onEdit(product)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>

        <Button
          variant="destructive"
          size="sm"
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
