import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductionCardSkeleton() {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
        <div className="grid min-w-0 gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
          <Skeleton className="aspect-[4/3] w-full rounded-lg lg:h-[150px]" />
          <div className="space-y-4">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,140px),1fr))] gap-3">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex flex-wrap gap-2 pt-3">
              <Skeleton className="h-9 w-32 rounded-md" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
