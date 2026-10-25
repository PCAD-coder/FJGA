import ProductGrid from "./product-grid"
import { getCatalogProducts } from "../services/catalog"
import CategoryFilter from "./category-filter"

export default async function Catalog() {
  const products = await getCatalogProducts()

  return (
    <div className="@container mx-auto w-full max-w-[1440px] px-1 pt-4 pb-16 sm:px-4 sm:pt-6 lg:px-8 lg:pb-24">
      <header className="mb-6 border-b border-border/70 pb-5 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Made for your space.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore glass and aluminum pieces for your home and workspace.
        </p>
      </header>
      <section aria-label="Product collection">
        <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-3">
            <h2 className="text-lg font-semibold tracking-tight">
              Explore our products
            </h2>
            <span className="text-xs text-muted-foreground">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>
          <CategoryFilter />
        </div>
        <ProductGrid products={products} />
      </section>
    </div>
  )
}
