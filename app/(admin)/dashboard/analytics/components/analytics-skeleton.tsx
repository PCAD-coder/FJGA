import { Skeleton } from "@/components/ui/skeleton"

function Placeholder({ className }: { className: string }) {
  return (
    <Skeleton
      className={`bg-foreground/10 motion-reduce:animate-none ${className}`}
    />
  )
}

export default function AnalyticsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading analytics"
      className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6"
    >
      <span className="sr-only">Loading analytics...</span>
      <div aria-hidden="true" className="space-y-4">
        <div className="flex flex-wrap justify-between gap-4 border-b pb-4">
          <div className="space-y-2">
            <Placeholder className="h-9 w-72 max-w-full" />
            <Placeholder className="h-5 w-80 max-w-full" />
          </div>
          <Placeholder className="h-9 w-48" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className="space-y-2 rounded-xl border bg-card px-4 py-3"
            >
              <div className="flex justify-between gap-2">
                <Placeholder className="h-5 w-28" />
                <Placeholder className="size-7 rounded-lg" />
              </div>
              <Placeholder className="h-8 w-28" />
              <Placeholder className="h-3 w-full" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border bg-card">
              <div className="border-b p-5">
                <Placeholder className="h-5 w-40" />
              </div>
              <div className="flex h-[312px] items-end gap-4 p-5">
                {[30, 60, 45, 80, 65, 90].map((height, j) => (
                  <Skeleton
                    key={j}
                    className="flex-1 bg-primary/10 motion-reduce:animate-none"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border bg-card">
              <div className="border-b p-5">
                <Placeholder className="h-5 w-44" />
              </div>
              {Array.from({ length: 5 }, (_, j) => (
                <div key={j} className="grid grid-cols-3 gap-4 border-b p-4">
                  <Placeholder className="h-5 w-full" />
                  <Placeholder className="h-5 w-full" />
                  <Placeholder className="h-5 w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
