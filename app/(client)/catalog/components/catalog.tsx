import CatalogCollection from "./catalog-collection"
import { getCatalogProducts } from "../services/catalog"

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
      <CatalogCollection products={products} />
    </div>
  )
}
