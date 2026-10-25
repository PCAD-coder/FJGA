import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      className="mx-auto w-full max-w-[1440px] space-y-6 px-1 pt-4 pb-12 sm:px-4 sm:pt-6 lg:px-6"
    >
      <span className="sr-only">Loading your dashboard...</span>
      <div aria-hidden="true" className="space-y-6">
        <div className="space-y-3 border-b border-border/70 pb-6">
          <Skeleton className="h-3 w-32 bg-foreground/10 motion-reduce:animate-none" />
          <Skeleton className="h-10 w-72 max-w-full bg-foreground/10 motion-reduce:animate-none" />
          <Skeleton className="h-5 w-96 max-w-full bg-foreground/10 motion-reduce:animate-none" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="flex items-start justify-between gap-3 rounded-xl border bg-card p-5 sm:p-6"
            >
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-3/4 motion-reduce:animate-none" />
                <Skeleton className="h-9 w-2/3 motion-reduce:animate-none" />
              </div>
              <Skeleton className="size-11 rounded-xl motion-reduce:animate-none" />
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="space-y-2 border-b px-5 py-5 sm:px-6">
            <Skeleton className="h-5 w-36 motion-reduce:animate-none" />
            <Skeleton className="h-3 w-64 max-w-full motion-reduce:animate-none" />
          </div>
          <div className="grid grid-cols-4 gap-4 bg-muted/50 px-5 py-4 sm:px-6">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton
                key={index}
                className="h-3 w-3/4 bg-foreground/10 motion-reduce:animate-none"
              />
            ))}
          </div>
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 border-t px-5 py-5 sm:px-6"
            >
              {Array.from({ length: 4 }, (_, column) => (
                <Skeleton
                  key={column}
                  className="h-4 w-full motion-reduce:animate-none"
                />
              ))}
            </div>
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.3fr_.9fr]">
          <div className="rounded-xl border bg-card">
            <div className="space-y-2 border-b px-6 py-5">
              <Skeleton className="h-5 w-32 motion-reduce:animate-none" />
              <Skeleton className="h-3 w-56 max-w-full motion-reduce:animate-none" />
            </div>
            <div className="flex h-[340px] flex-col items-center justify-center gap-7">
              <div className="size-48 animate-pulse rounded-full border-[30px] border-muted motion-reduce:animate-none" />
              <Skeleton className="h-3 w-48 motion-reduce:animate-none" />
            </div>
          </div>
          <div className="rounded-xl border bg-card">
            <div className="space-y-2 border-b px-6 py-5">
              <Skeleton className="h-5 w-44 motion-reduce:animate-none" />
              <Skeleton className="h-3 w-56 max-w-full motion-reduce:animate-none" />
            </div>
            <div className="space-y-5 p-6">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="flex gap-3">
                  <Skeleton className="size-10 shrink-0 rounded-lg motion-reduce:animate-none" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 motion-reduce:animate-none" />
                    <Skeleton className="h-3 w-full motion-reduce:animate-none" />
                    <Skeleton className="h-3 w-20 motion-reduce:animate-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
