import { Skeleton } from "@/components/ui/skeleton"

function Placeholder({ className }: { className: string }) {
  return (
    <Skeleton
      className={`bg-foreground/10 motion-reduce:animate-none ${className}`}
    />
  )
}

export default function AdminDashboardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading admin dashboard"
      className="mx-auto w-full max-w-[1600px] space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6"
    >
      <span className="sr-only">Loading dashboard statistics...</span>
      <div aria-hidden="true" className="space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3">
          <Placeholder className="h-7 w-40" />
          <Placeholder className="h-4 w-40 max-w-full" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="space-y-2 rounded-xl border bg-card px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <Placeholder className="h-4 w-28" />
                <Placeholder className="size-7 rounded-lg" />
              </div>
              <Placeholder className="h-6 w-3/4" />
              <Placeholder className="h-3 w-full" />
            </div>
          ))}
        </div>
        <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
          <div className="flex h-[360px] min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
            <div className="space-y-3 border-b p-5">
              <Placeholder className="h-5 w-40" />
              <Placeholder className="h-3 w-56 max-w-full" />
            </div>
            <div className="flex min-h-0 flex-1 items-end gap-3 p-6">
              {[30, 45, 35, 70, 55, 90].map((height, index) => (
                <Skeleton
                  key={index}
                  className="flex-1 bg-primary/10 motion-reduce:animate-none"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          <div className="flex h-[360px] min-w-0 flex-col overflow-hidden rounded-xl border bg-card">
            <div className="space-y-3 border-b p-5">
              <Placeholder className="h-5 w-52 max-w-full" />
              <Placeholder className="h-3 w-32" />
            </div>
            <div className="flex h-[160px] shrink-0 items-center justify-center">
              <div className="size-[136px] animate-pulse rounded-full border-[20px] border-muted motion-reduce:animate-none" />
            </div>
            <div className="space-y-3 px-6 pb-5">
              {Array.from({ length: 3 }, (_, index) => (
                <Placeholder key={index} className="h-5 w-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="space-y-3 border-b p-5">
            <Placeholder className="h-5 w-40" />
            <Placeholder className="h-3 w-56 max-w-full" />
          </div>
          <div className="space-y-4 p-5">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex justify-between gap-5">
                <Placeholder className="h-5 w-2/3" />
                <Placeholder className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
