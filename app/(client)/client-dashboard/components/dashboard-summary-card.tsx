"use client"

import { ReactNode } from "react"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

interface Props {
  title: string

  value: string | number

  icon: ReactNode
}

export default function DashboardSummaryCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <Card>

      <CardContent className="p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-muted-foreground">
              {title}
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {value}
            </h2>

          </div>

          <div className="rounded-full bg-muted p-4">
            {icon}
          </div>

        </div>

      </CardContent>

    </Card>
  )
}