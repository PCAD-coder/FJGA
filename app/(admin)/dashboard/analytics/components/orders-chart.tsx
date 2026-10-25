"use client"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { OrdersData } from "../types/analytics"

interface Props {
  data: OrdersData[]
}

export default function OrdersChart({ data }: Props) {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardHeader className="border-b border-border/60 px-5 py-4">
        <CardTitle className="text-base font-semibold">Orders Trend</CardTitle>
      </CardHeader>

      <CardContent className="px-3 py-4 sm:px-5">
        <div className="h-[280px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="4 4"
                opacity={0.6}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickMargin={10}
                minTickGap={20}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={65}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--popover)",
                  color: "var(--popover-foreground)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--popover-foreground)" }}
                cursor={{
                  fill: "var(--primary)",
                  fillOpacity: 0.15,
                }}
              />

              <Bar
                dataKey="orders"
                fill="var(--chart-2)"
                maxBarSize={38}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
