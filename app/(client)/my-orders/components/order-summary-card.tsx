import type { LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface Props {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
}

export default function OrderSummaryCard({
  title,
  value,
  description,
  icon: Icon,
}: Props) {
  return (
    <Card className="gap-0 rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>

            <p className="mt-2 text-xl font-semibold tracking-tight wrap-break-word tabular-nums">
              {value}
            </p>

            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
