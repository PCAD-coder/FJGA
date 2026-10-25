import { Skeleton } from "@/components/ui/skeleton"

type ModuleSkeletonProps = {
  label: string
  summaryCount?: number
  compact?: boolean
  layout?: "cards" | "table" | "returns" | "feedback" | "payments"
}

function Placeholder({ className }: { className: string }) {
  return (
    <Skeleton
      className={`bg-foreground/10 motion-reduce:animate-none ${className}`}
    />
  )
}

function CardList({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-4"
          : "space-y-4"
      }
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className={`flex flex-col rounded-xl border bg-card ${compact ? "gap-4 overflow-hidden pb-4" : "gap-5 p-5 sm:flex-row sm:items-center"}`}
        >
          <Placeholder
            className={
              compact
                ? "aspect-[16/10] w-full shrink-0 rounded-none"
                : "h-28 w-full shrink-0 sm:w-36"
            }
          />
          <div
            className={compact ? "flex-1 space-y-3 px-4" : "flex-1 space-y-3"}
          >
            <Placeholder className="h-4 w-40 max-w-full" />
            <Placeholder className="h-6 w-3/4" />
            <Placeholder className="h-4 w-1/2" />
          </div>
          <Placeholder
            className={compact ? "mx-4 h-9 w-28 shrink-0" : "h-9 w-28 shrink-0"}
          />
        </div>
      ))}
    </div>
  )
}

function TablePlaceholder() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="space-y-3 border-b p-5">
        <Placeholder className="h-5 w-40" />
        <Placeholder className="h-3 w-64 max-w-full" />
      </div>
      <div className="grid grid-cols-4 gap-4 bg-muted/50 p-5">
        {Array.from({ length: 4 }, (_, index) => (
          <Placeholder key={index} className="h-3 w-3/4" />
        ))}
      </div>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="grid grid-cols-4 gap-4 border-t p-5">
          {Array.from({ length: 4 }, (_, column) => (
            <Placeholder key={column} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function ModuleSkeleton({
  label,
  summaryCount = 3,
  compact = false,
  layout = "cards",
}: ModuleSkeletonProps) {
  return (
    <div
      role="status"
      aria-label={`Loading ${label}`}
      className={
        compact
          ? "mx-auto w-full max-w-[1440px] space-y-5 px-1 pt-4 pb-10 sm:px-4 lg:px-6"
          : "space-y-6 pb-8"
      }
    >
      <span className="sr-only">Loading {label}...</span>
      <div aria-hidden="true" className="space-y-6">
        <div className="space-y-3">
          <Placeholder className="h-9 w-64 max-w-full" />
          <Placeholder className="h-5 w-96 max-w-full" />
        </div>
        {summaryCount > 0 && (
          <div
            className={`grid gap-4 sm:grid-cols-2 ${summaryCount === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}
          >
            {Array.from({ length: summaryCount }, (_, index) => (
              <div
                key={index}
                className={`space-y-3 rounded-xl border bg-card ${compact ? "p-4" : "p-6"}`}
              >
                <Placeholder className="h-4 w-28" />
                <Placeholder className="h-9 w-32 max-w-full" />
                <Placeholder className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        )}
        {layout === "cards" && (
          <>
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <Placeholder className="h-10 w-full sm:w-80" />
              <Placeholder className="h-10 w-full sm:w-64" />
            </div>
            <CardList compact={compact} />
          </>
        )}
        {layout === "table" && <TablePlaceholder />}
        {layout === "feedback" && (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="order-2 space-y-4 rounded-xl border bg-card p-5">
              <Placeholder className="h-5 w-48" />
              <Placeholder className="h-3 w-40" />
              {Array.from({ length: 2 }, (_, index) => (
                <div
                  key={index}
                  className="space-y-3 rounded-lg border bg-muted/25 p-4"
                >
                  <Placeholder className="h-5 w-3/4" />
                  <Placeholder className="h-3 w-1/2" />
                  <Placeholder className="h-3 w-2/3" />
                  <Placeholder className="h-9 w-full" />
                </div>
              ))}
            </div>
            <div className="order-1 space-y-4">
              <Placeholder className="h-5 w-36" />
              <Placeholder className="h-3 w-48" />
              {Array.from({ length: 2 }, (_, index) => (
                <div
                  key={index}
                  className="space-y-4 rounded-xl border bg-card p-5"
                >
                  <Placeholder className="h-5 w-3/4" />
                  <Placeholder className="h-3 w-1/2" />
                  <Placeholder className="h-9 w-full" />
                  <Placeholder className="h-14 w-full" />
                  <Placeholder className="h-3 w-32" />
                </div>
              ))}
            </div>
          </div>
        )}
        {layout === "payments" && (
          <>
            <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-4">
                <Placeholder className="h-6 w-48" />
                <Placeholder className="h-3 w-80 max-w-full" />
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
                  {Array.from({ length: 2 }, (_, index) => (
                    <div
                      key={index}
                      className="space-y-4 rounded-xl border bg-card p-5"
                    >
                      <Placeholder className="h-5 w-3/4" />
                      <Placeholder className="h-12 w-full" />
                      <Placeholder className="h-32 w-full" />
                      <Placeholder className="h-9 w-full" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 rounded-xl border bg-card p-5">
                <Placeholder className="h-5 w-36" />
                <Placeholder className="h-10 w-full" />
                {Array.from({ length: 3 }, (_, index) => (
                  <Placeholder key={index} className="h-20 w-full" />
                ))}
                <Placeholder className="h-14 w-full" />
              </div>
            </div>
            <TablePlaceholder />
          </>
        )}
        {layout === "returns" && (
          <>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-5 rounded-xl border bg-card p-6 lg:col-span-2">
                <Placeholder className="h-6 w-48" />
                {Array.from({ length: 3 }, (_, index) => (
                  <Placeholder key={index} className="h-14 w-full" />
                ))}
                <Placeholder className="h-28 w-full" />
                <Placeholder className="h-10 w-full" />
              </div>
              <div className="space-y-6">
                {Array.from({ length: 2 }, (_, index) => (
                  <div
                    key={index}
                    className="space-y-4 rounded-xl border bg-card p-6"
                  >
                    <Placeholder className="h-5 w-3/4" />
                    <Placeholder className="h-24 w-full" />
                  </div>
                ))}
              </div>
            </div>
            <Placeholder className="h-6 w-48" />
            <CardList />
          </>
        )}
      </div>
    </div>
  )
}
