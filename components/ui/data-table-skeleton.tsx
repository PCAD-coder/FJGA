"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface Props {
  rows?: number
  columns?: number
}

export function DataTableSkeleton({
  rows = 8,
  columns = 6,
}: Props) {
  return (
    <div className="rounded-md border">

      <div className="space-y-2 p-4">

        {Array.from({ length: rows }).map((_, row) => (
          <div
            key={row}
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          >
            {Array.from({ length: columns }).map((_, col) => (
              <Skeleton
                key={col}
                className="h-8"
              />
            ))}
          </div>
        ))}

      </div>

    </div>
  )
}