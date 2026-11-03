import { Skeleton } from "@/components/ui/skeleton"
import ProductionCardSkeleton from "./cards/production-card-skeleton"

export default function ModuleSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[1600px] space-y-5 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6"
      aria-label="Loading production"
      role="status"
    >
      <header className="border-b border-border/70 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Production Tracking
        </h1>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Track fabrication progress and manage production workflows.
        </p>
      </header>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <ProductionCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
