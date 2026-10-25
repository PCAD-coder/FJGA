"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ProjectStatus } from "../types/client-dashboard"

interface Props {
  data: ProjectStatus[]
}

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"]

export default function ProjectStatusChart({ data }: Props) {
  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/70 py-0 shadow-none ring-0">
      <CardHeader className="gap-1 border-b border-border/60 px-5 py-5 sm:px-6">
        <CardTitle className="text-base font-semibold tracking-tight">
          Project status
        </CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">
          A breakdown of your projects by current status.
        </p>
      </CardHeader>

      <CardContent className="px-3 py-5 sm:px-6">
        <div className="h-[300px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                cornerRadius={5}
                label
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  fontSize: 12,
                }}
              />

              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
