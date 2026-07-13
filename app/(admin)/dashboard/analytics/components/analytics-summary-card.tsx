"use client"

import {
  Card,
  CardContent,
} from "@/components/ui/card"

import { ReactNode } from "react"

interface Props {
  title: string

  value: string | number

  icon: ReactNode

  description?: string
}

export default function AnalyticsSummaryCard({
  title,
  value,
  icon,
  description,
}: Props) {
  return (
    <Card>

      <CardContent className="pt-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-muted-foreground">
              {title}
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              {value}
            </h2>

            {description && (
              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            )}

          </div>

          <div>
            {icon}
          </div>

        </div>

      </CardContent>

    </Card>
  )
}