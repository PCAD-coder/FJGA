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
    <Card>
      <CardHeader>
        <CardTitle>Orders Trend</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip
                cursor={{
                  fill: "var(--sidebar-primary)",
                  fillOpacity: 0.15,
                }}
              />

              <Bar dataKey="orders" fill="#0095fd" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
