import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card className="h-full gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-sm ring-0">
      <Skeleton className="aspect-[3/2] w-full rounded-none motion-reduce:animate-none" />

      <CardContent className="space-y-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1 motion-reduce:animate-none" />
          <Skeleton className="h-9 flex-1 motion-reduce:animate-none" />
        </div>
      </CardContent>
    </Card>
  )
}
