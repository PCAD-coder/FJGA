import { Skeleton } from "@/components/ui/skeleton"

function Placeholder({ className }: { className: string }) {
  return (
    <Skeleton
      className={`bg-foreground/10 motion-reduce:animate-none ${className}`}
    />
  )
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="space-y-3 border-b p-5">
        <Placeholder className="h-5 w-48" />
        <Placeholder className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-5 gap-4 bg-muted/50 p-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Placeholder key={i} className="h-4 w-3/4" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4 border-t p-4">
          {Array.from({ length: 5 }, (_, j) => (
            <Placeholder key={j} className="h-5 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function SalesSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading sales"
      className="mx-auto w-full max-w-[1600px] space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6"
    >
      <span className="sr-only">Loading sales records...</span>
      <div aria-hidden="true" className="space-y-4">
        <div className="space-y-2">
          <Placeholder className="h-8 w-32" />
          <Placeholder className="h-5 w-96 max-w-full" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="space-y-2 rounded-xl border bg-card px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <Placeholder className="h-5 w-28" />
                <Placeholder className="size-7 rounded-lg" />
              </div>
              <Placeholder className="h-8 w-3/4" />
              <Placeholder className="h-3 w-full" />
            </div>
          ))}
        </div>
        <TableSkeleton rows={2} />
        <div className="flex flex-wrap gap-3 rounded-xl border bg-card p-5">
          <Placeholder className="h-9 w-full sm:w-80" />
          <Placeholder className="h-9 w-48" />
        </div>
        <TableSkeleton rows={10} />
        <div className="flex justify-between gap-4">
          <Placeholder className="h-4 w-48" />
          <Placeholder className="h-9 w-56" />
        </div>
      </div>
    </div>
  )
}
