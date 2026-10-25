import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardCardProps {
  title: string
  value: string
  description: string
  icon: React.ElementType
  color?: string
}

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  color = "text-muted-foreground",
}: DashboardCardProps) {
  return (
    <Card className="gap-0 rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardHeader className="flex flex-row items-start justify-between gap-2 px-4 pt-3 pb-1">
        <CardTitle className="text-sm leading-5 font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted/70">
          <Icon className={`size-3.5 ${color}`} />
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-3">
        <div className="text-2xl font-semibold tracking-tight wrap-break-word tabular-nums">
          {value}
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
