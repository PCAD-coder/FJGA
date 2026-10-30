"use client"

import { useState } from "react"
import type { CatalogProduct } from "../types/catalog"
import CategoryFilter from "./category-filter"
import ProductGrid from "./product-grid"

export default function CatalogCollection({ products }: { products: CatalogProduct[] }) {
  const [category, setCategory] = useState("All")
  const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort()
  const filteredProducts = category === "All"
    ? products
    : products.filter((product) => product.category === category)

  return (
      <section aria-label="Product collection">
        <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Explore our products
            </h2>
            <span className="text-xs text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </div>
          <CategoryFilter
            value={category}
            onValueChange={setCategory}
            categories={categories}
          />
        </div>
        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <p role="status" className="py-12 text-center text-sm text-muted-foreground">
            No products are available in this category.
          </p>
        )}
      </section>
  )
}
