import { Skeleton } from "@/components/ui/skeleton"
import { ProductCardSkeleton } from "./cards/product-card-skeleton"

export default function ModuleSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[1600px] space-y-5 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6"
      aria-label="Loading products"
      role="status"
    >
      <header className="border-b border-border/70 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Products
        </h1>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Manage furniture products and their materials.
        </p>
      </header>

      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
