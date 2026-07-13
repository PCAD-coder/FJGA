"use client"

import { ReactNode } from "react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

interface Props {
  title: string

  value: number

  icon: ReactNode
}

export default function MonitoringSummaryCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <Card>
      <CardContent className="p-2">

        <div className="flex items-center gap-4">

          <div className="rounded-full bg-muted p-3">
            {icon}
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              {title}
            </p>

            <h2 className="text-3xl font-bold">
              {value}
            </h2>
          </div>

        </div>

      </CardContent>
    </Card>
  )
}