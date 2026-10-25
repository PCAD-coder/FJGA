import { Skeleton } from "@/components/ui/skeleton"

function Placeholder({ className }: { className: string }) {
  return (
    <Skeleton
      className={`bg-foreground/10 motion-reduce:animate-none ${className}`}
    />
  )
}

export default function ActivityLogsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading activity logs"
      className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6"
    >
      <span className="sr-only">Loading activity logs...</span>
      <div aria-hidden="true" className="space-y-4">
        <div className="space-y-2 border-b pb-4">
          <Placeholder className="h-9 w-56 max-w-full" />
          <Placeholder className="h-5 w-80 max-w-full" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="space-y-2 rounded-xl border bg-card px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <Placeholder className="h-5 w-28" />
                <Placeholder className="size-7 rounded-lg" />
              </div>
              <Placeholder className="h-8 w-20" />
              <Placeholder className="h-3 w-full" />
            </div>
          ))}
        </div>
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 7 }, (_, i) => (
              <Placeholder key={i} className="h-9 w-20" />
            ))}
          </div>
          <Placeholder className="h-9 w-full sm:w-80" />
        </div>
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="grid grid-cols-5 gap-4 bg-muted/50 p-4">
            {Array.from({ length: 5 }, (_, i) => (
              <Placeholder key={i} className="h-4 w-3/4" />
            ))}
          </div>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 border-t p-4">
              {Array.from({ length: 5 }, (_, j) => (
                <Placeholder key={j} className="h-5 w-full" />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-between gap-4">
          <Placeholder className="h-4 w-48" />
          <Placeholder className="h-9 w-56" />
        </div>
      </div>
    </div>
  )
}
