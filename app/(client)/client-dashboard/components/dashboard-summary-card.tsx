"use client"

import { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"

interface Props {
  title: string

  value: string | number

  icon: ReactNode
}

export default function DashboardSummaryCard({ title, value, icon }: Props) {
  return (
    <Card className="gap-0 rounded-xl border border-border/70 py-0 shadow-none ring-0">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight break-words tabular-nums xl:text-3xl">
              {value}
            </h2>
          </div>

          <div className="shrink-0 rounded-xl border border-border/50 bg-muted/70 p-3">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
