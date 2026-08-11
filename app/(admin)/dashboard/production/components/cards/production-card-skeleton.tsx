import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductionCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>

        {/* Body */}
        <div className="grid gap-5 md:grid-cols-[300px_1fr]">
          {/* Image */}
          <Skeleton className="h-[220px] w-full rounded-lg" />

          <div className="space-y-4">
            {/* Info cards */}
            <div className="grid gap-3 md:grid-cols-3">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>

            {/* Stage chips */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-2 w-full rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-10 w-36 rounded-md" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}