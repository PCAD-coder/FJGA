"use client"

import type { ProductWithDetails } from "../../types/product"

import { ProductCard } from "./product-card"
import { ProductCardSkeleton } from "./product-card-skeleton"

interface ProductGridProps {
  products: ProductWithDetails[]

  onEdit: (product: ProductWithDetails) => void

  onArchive: (product: ProductWithDetails) => void
}
interface ProductGridProps {
  products: ProductWithDetails[]
  loading?: boolean
  onEdit: (product: ProductWithDetails) => void
  onArchive: (product: ProductWithDetails) => void
}

export function ProductGrid({
  products,
  loading = false,
  onEdit,
  onArchive,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onArchive={onArchive}
        />
      ))}
    </div>
  )
}