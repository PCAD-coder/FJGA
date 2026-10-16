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
    <Card className="shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
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