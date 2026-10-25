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
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
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
