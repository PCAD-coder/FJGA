import { Skeleton } from "@/components/ui/skeleton"

export default function ProductOrderLoading() {
  return (
    <div
      role="status"
      aria-label="Loading product order page"
      className="mx-auto w-full max-w-7xl px-1 pt-4 pb-16 sm:px-4 lg:px-6"
    >
      <span className="sr-only">Loading product details...</span>
      <div
        aria-hidden="true"
        className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8 xl:gap-12"
      >
        <div className="overflow-hidden rounded-2xl border bg-card lg:sticky lg:top-6">
          <Skeleton className="aspect-square w-full rounded-none bg-foreground/10 motion-reduce:animate-none" />
          <div className="space-y-3 border-t px-5 py-4">
            <Skeleton className="h-3 w-36 motion-reduce:animate-none" />
            <Skeleton className="h-5 w-40 motion-reduce:animate-none" />
          </div>
        </div>
        <div className="min-w-0 rounded-2xl border bg-card p-5 sm:p-7">
          <div className="space-y-3 pb-6">
            <Skeleton className="h-10 w-3/4 motion-reduce:animate-none" />
            <Skeleton className="h-4 w-full motion-reduce:animate-none" />
            <Skeleton className="h-4 w-2/3 motion-reduce:animate-none" />
            <Skeleton className="mt-4 h-3 w-16 motion-reduce:animate-none" />
            <Skeleton className="h-8 w-36 motion-reduce:animate-none" />
          </div>
          <div className="space-y-5 border-t py-6">
            <Skeleton className="h-5 w-32 motion-reduce:animate-none" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-2/3 motion-reduce:animate-none" />
                  <Skeleton className="h-9 w-full motion-reduce:animate-none" />
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24 motion-reduce:animate-none" />
                  <Skeleton className="h-9 w-full motion-reduce:animate-none" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 border-t py-6 sm:grid-cols-[120px_minmax(0,1fr)]">
            <Skeleton className="h-14 w-full motion-reduce:animate-none" />
            <Skeleton className="h-24 w-full motion-reduce:animate-none" />
          </div>
          <div className="space-y-4 border-t py-6">
            <Skeleton className="h-5 w-40 motion-reduce:animate-none" />
            <Skeleton className="h-9 w-full motion-reduce:animate-none" />
            <Skeleton className="h-3 w-3/4 motion-reduce:animate-none" />
            <Skeleton className="h-9 w-full motion-reduce:animate-none" />
          </div>
          <div className="space-y-4 border-t py-6">
            <Skeleton className="h-5 w-36 motion-reduce:animate-none" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="h-14 w-full motion-reduce:animate-none"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-xl border bg-muted/40 p-5 sm:p-6">
            <Skeleton className="h-5 w-36 bg-foreground/10 motion-reduce:animate-none" />
            <Skeleton className="h-9 w-44 bg-foreground/10 motion-reduce:animate-none" />
            <Skeleton className="h-20 w-full bg-foreground/10 motion-reduce:animate-none" />
            <Skeleton className="h-12 w-full bg-primary/15 motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
