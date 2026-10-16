"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Props {
  activeTab: string
  onChange: (tab: string) => void
  counts?: Record<string, number>
}

const tabs = [
  "All",
  "Active",
  "Approved",
  "Completed",
  "Declined",
  "Cancelled",
]

export default function OrderFilterTabs({
  activeTab,
  onChange,
  counts = {},
}: Props) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full items-center gap-1 rounded-lg border bg-card p-1 sm:min-w-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab
          const count = counts[tab] ?? 0

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onChange(tab)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span>{tab}</span>

              <Badge
                variant="secondary"
                className={cn(
                  "h-4 min-w-4 justify-center rounded-full px-1 text-[10px]",
                  isActive &&
                    "bg-primary-foreground/15 text-primary-foreground"
                )}
              >
                {count}
              </Badge>
            </button>
          )
        })}
      </div>
    </div>
  )
}
