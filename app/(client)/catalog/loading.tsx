import { Skeleton } from "@/components/ui/skeleton"

export default function CatalogLoading() {
  return (
    <div
      role="status"
      aria-label="Loading catalog"
      className="mx-auto w-full max-w-[1440px] px-1 pt-4 pb-16 sm:px-4 sm:pt-6 lg:px-8 lg:pb-24"
    >
      <span className="sr-only">Loading products...</span>
      <div aria-hidden="true">
        <div className="mb-6 space-y-3 border-b border-border/70 pb-5 sm:mb-8">
          <Skeleton className="h-9 w-64 max-w-full bg-foreground/10 motion-reduce:animate-none" />
          <Skeleton className="h-5 w-96 max-w-full bg-foreground/10 motion-reduce:animate-none" />
        </div>
        <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-7 w-56 bg-foreground/10 motion-reduce:animate-none" />
          <Skeleton className="h-10 w-full bg-foreground/10 motion-reduce:animate-none sm:w-[260px]" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,210px),1fr))] gap-x-4 gap-y-7">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border bg-card shadow-sm"
            >
              <Skeleton className="aspect-[3/2] w-full rounded-none bg-foreground/10 motion-reduce:animate-none" />
              <div className="space-y-3 p-3">
                <Skeleton className="h-4 w-3/4 motion-reduce:animate-none" />
                <Skeleton className="h-3 w-full motion-reduce:animate-none" />
                <Skeleton className="h-3 w-2/3 motion-reduce:animate-none" />
                <Skeleton className="h-3 w-1/2 motion-reduce:animate-none" />
                <div className="space-y-2 border-t pt-3">
                  <Skeleton className="h-3 w-14 motion-reduce:animate-none" />
                  <Skeleton className="h-6 w-28 motion-reduce:animate-none" />
                </div>
                <Skeleton className="h-9 w-full bg-primary/15 motion-reduce:animate-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
