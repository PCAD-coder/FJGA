import { Skeleton } from "@/components/ui/skeleton"

function Placeholder({ className }: { className: string }) {
  return (
    <Skeleton
      className={`bg-foreground/10 motion-reduce:animate-none ${className}`}
    />
  )
}

export function ContentPanelSkeleton({
  variant = "cards",
}: {
  variant?: "cards" | "homepage"
}) {
  return (
    <div role="status" aria-label="Loading content">
      <span className="sr-only">Loading content...</span>
      {variant === "homepage" ? (
        <div
          aria-hidden="true"
          className="space-y-5 rounded-xl border bg-card p-5"
        >
          <div className="flex justify-between gap-3">
            <Placeholder className="h-6 w-48" />
            <Placeholder className="h-9 w-28" />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Placeholder className="aspect-video w-full" />
            <div className="space-y-4">
              <Placeholder className="h-4 w-28" />
              <Placeholder className="h-7 w-3/4" />
              <Placeholder className="h-4 w-full" />
              <Placeholder className="h-4 w-full" />
              <Placeholder className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4"
        >
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border bg-card">
              <Placeholder className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Placeholder className="h-5 w-3/4" />
                <Placeholder className="h-4 w-full" />
                <Placeholder className="h-4 w-2/3" />
                <div className="flex gap-2 pt-2">
                  <Placeholder className="h-8 flex-1" />
                  <Placeholder className="h-8 flex-1" />
                  <Placeholder className="h-8 flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ContentSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <div aria-hidden="true" className="space-y-4">
        <div className="space-y-2 border-b pb-4">
          <Placeholder className="h-9 w-72 max-w-full" />
          <Placeholder className="h-5 w-96 max-w-full" />
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
        <Placeholder className="h-10 w-96 max-w-full" />
      </div>
      <ContentPanelSkeleton variant="homepage" />
    </div>
  )
}
