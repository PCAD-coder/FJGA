"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { RevenueData } from "../types/analytics"

interface Props {
  data: RevenueData[]
}

export default function RevenueChart({
  data,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Revenue Trend
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="h-[350px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={data}>

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
              />

              <YAxis />

              <Tooltip
                formatter={(value) => [
                  `₱${Number(
                    value
                  ).toLocaleString()}`,
                  "Revenue",
                ]}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                strokeWidth={3}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>

      </CardContent>

    </Card>
  )
}