import { Skeleton } from "@/components/ui/skeleton"

function Placeholder({ className }: { className: string }) {
  return (
    <Skeleton
      className={`bg-foreground/10 motion-reduce:animate-none ${className}`}
    />
  )
}

export function OrdersListSkeleton() {
  return (
    <div role="status" aria-label="Loading records" className="space-y-3">
      <span className="sr-only">Loading records...</span>
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex flex-wrap items-center justify-between gap-5 rounded-xl border bg-card p-5"
        >
          <div className="w-full space-y-3 sm:w-1/2">
            <Placeholder className="h-5 w-40 max-w-full" />
            <Placeholder className="h-4 w-56 max-w-full" />
            <Placeholder className="h-4 w-32" />
          </div>
          <Placeholder className="h-8 w-32" />
          <div className="flex gap-2">
            <Placeholder className="h-9 w-16" />
            <Placeholder className="h-9 w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function OrdersSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <div aria-hidden="true" className="space-y-4">
        <div className="space-y-2 border-b pb-4">
          <Placeholder className="h-9 w-40" />
          <Placeholder className="h-5 w-96 max-w-full" />
        </div>
        <Placeholder className="h-10 w-80 max-w-full" />
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
        <div className="flex flex-wrap justify-between gap-3 rounded-xl border bg-card p-4">
          <Placeholder className="h-9 w-full sm:w-80" />
          <Placeholder className="h-9 w-48" />
        </div>
      </div>
      <OrdersListSkeleton />
    </div>
  )
}
