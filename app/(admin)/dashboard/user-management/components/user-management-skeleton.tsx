import { Skeleton } from "@/components/ui/skeleton"
import UserManagementHeader from "./user-management-header"

function Placeholder({ className }: { className: string }) {
  return (
    <Skeleton
      className={`bg-foreground/10 motion-reduce:animate-none ${className}`}
    />
  )
}

export default function UserManagementSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading user management"
      className="mx-auto w-full max-w-[1600px] space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6"
    >
      <span className="sr-only">Loading users...</span>
      <div aria-hidden="true" className="space-y-4">
        <UserManagementHeader />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="space-y-2 rounded-xl border bg-card px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <Placeholder className="h-5 w-28" />
                <Placeholder className="size-7 rounded-lg" />
              </div>
              <Placeholder className="h-8 w-20" />
              <Placeholder className="h-3 w-3/4" />
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="space-y-2 border-b px-5 py-4">
            <Placeholder className="h-5 w-32" />
            <Placeholder className="h-3 w-80 max-w-full" />
          </div>
          <div className="space-y-4 p-4 sm:p-5">
            <div className="flex flex-wrap gap-2">
              <Placeholder className="h-9 w-full sm:w-64" />
              <Placeholder className="h-9 w-20" />
              <Placeholder className="h-9 w-24" />
              <Placeholder className="ml-auto h-9 w-32" />
            </div>
            <div className="overflow-hidden rounded-md border">
              <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 bg-muted/50 p-4">
                <Placeholder className="h-4 w-16" />
                <Placeholder className="h-4 w-14" />
                <Placeholder className="h-4 w-14" />
              </div>
              {Array.from({ length: 6 }, (_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[2fr_1fr_1fr] items-center gap-4 border-t p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Placeholder className="size-9 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Placeholder className="h-4 w-3/4" />
                      <Placeholder className="h-3 w-full" />
                    </div>
                  </div>
                  <Placeholder className="h-6 w-20 max-w-full rounded-full" />
                  <Placeholder className="h-6 w-16 max-w-full rounded-full" />
                </div>
              ))}
            </div>
            <div className="flex justify-between gap-4">
              <Placeholder className="h-4 w-32" />
              <Placeholder className="h-8 w-44" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
