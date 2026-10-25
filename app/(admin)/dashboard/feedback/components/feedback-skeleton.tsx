import { Skeleton } from "@/components/ui/skeleton"

function Placeholder({ className }: { className: string }) {
  return (
    <Skeleton
      className={`bg-foreground/10 motion-reduce:animate-none ${className}`}
    />
  )
}

export default function FeedbackSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading admin feedback"
      className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6"
    >
      <span className="sr-only">Loading customer reviews...</span>
      <div aria-hidden="true" className="space-y-4">
        <div className="space-y-2 border-b pb-4">
          <Placeholder className="h-9 w-64 max-w-full" />
          <Placeholder className="h-5 w-72 max-w-full" />
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
          <Placeholder className="h-9 w-96 max-w-full" />
          <Placeholder className="h-9 w-full sm:w-80" />
        </div>
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="space-y-4 rounded-xl border bg-card p-4 sm:p-5"
          >
            <div className="flex justify-between gap-3">
              <div className="flex-1 space-y-2">
                <Placeholder className="h-5 w-40 max-w-full" />
                <Placeholder className="h-4 w-64 max-w-full" />
              </div>
              <Placeholder className="h-6 w-24 rounded-full" />
            </div>
            <Placeholder className="h-8 w-28" />
            <Placeholder className="h-20 w-full" />
            <div className="flex flex-wrap gap-2 border-t pt-3">
              <Placeholder className="h-9 w-28" />
              <Placeholder className="h-9 w-36" />
              <Placeholder className="h-9 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
