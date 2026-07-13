import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Palette, ShoppingCart, MapPinned } from "lucide-react"

import { CatalogProduct } from "../types/catalog"

interface Props {
  product: CatalogProduct
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="group overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product Image */}
      <div className="relative h-30 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category Badge */}
        <Badge className="absolute top-3 right-3">{product.category}</Badge>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4">
        <div>
          <h3 className="line-clamp-2 min-h-[56px] text-lg font-semibold">
            {product.name}
          </h3>

          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p>
              {product.width}cm × {product.height}cm
            </p>

            <p>{product.glassType}</p>

            <p>{product.aluminumSeries}</p>
          </div>
        </div>

        {/* Price , buttons*/}
        <div className="mt-auto">
          <p className="text-xs text-muted-foreground">Starts at</p>

          <p className="text-m font-bold text-primary">
            ₱{product.basePrice.toLocaleString()}
          </p>
          <Button variant="outline" className="w-full">
            <Palette className="mr-1 h-4 w-4" />
            Customize
          </Button>

          <Button className="w-full">
            <ShoppingCart className="mr-1 h-4 w-4" />
            Order
          </Button>
        </div>

        {/* Inspection */}
        <Button variant="ghost" className="w-full justify-center">
          <MapPinned className="mr-1 h-4 w-4" />
          Request On-site Inspection
        </Button>
      </div>
    </div>
  )
}
