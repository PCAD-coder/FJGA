"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { ProjectStatus } from "../types/client-dashboard"

interface Props {
  data: ProjectStatus[]
}

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
]

export default function ProjectStatusChart({
  data,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Project Status Chart
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="h-[350px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>

              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                label
              >
                {data.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[index]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </CardContent>

    </Card>
  )
}