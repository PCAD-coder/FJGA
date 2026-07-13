"use client"

import Image from "next/image"
import { Eye, Pencil, Archive } from "lucide-react"

import { Product } from "../types/product"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


interface ProductCardProps {
  product: Product
  onView: () => void
  onEdit: () => void
  onArchive: () => void
}


export default function ProductCard({
  product,
  onView,
  onEdit,
  onArchive,
}: ProductCardProps) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-300">

      <div className="relative h-52">

        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />

      </div>

      <div className="p-4 space-y-3">

        <Badge variant="secondary">
          {product.category}
        </Badge>

        <div>
          <h3 className="font-semibold">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground">
            {product.dimensions}
          </p>
        </div>

        <div className="flex items-center justify-between">

          <span className="font-bold text-lg">
            ₱{product.price.toLocaleString()}
          </span>

          <Badge
            variant={
              product.status === "active"
                ? "default"
                : "secondary"
            }
          >
            {product.status}
          </Badge>

        </div>

        <Button
          className="w-full"
          variant="outline"
          onClick={onView}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>

        <div className="flex gap-2">

          <Button
            variant="outline"
            className="flex-1"
            onClick={onEdit}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button
            variant="destructive"
            className="flex-1"
            onClick={onArchive}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>

        </div>

      </div>

    </div>
  )
}