'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const summary = [
  { title: "Inventory", count: 4, color: "bg-blue-100 text-blue-600" },
  { title: "Orders", count: 3, color: "bg-purple-100 text-purple-600" },
  { title: "Returns", count: 2, color: "bg-orange-100 text-orange-600" },
  { title: "Config", count: 1, color: "bg-gray-100 text-gray-600" },
  { title: "Users", count: 1, color: "bg-green-100 text-green-600" },
  { title: "Security", count: 1, color: "bg-red-100 text-red-600" },
]

const activities = [
  {
    title: "Approved Return Request",
    tag: "Return",
    description: "Approved return request #RET201 with material deduction",
    user: "Alex Johnson",
    time: "11:45 AM",
    date: "Mar 26",
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Updated Inventory",
    tag: "Inventory",
    description: "Updated 1/4\" Clear Glass stock from 45 to 50 sheets",
    user: "Maria Santos",
    time: "11:30 AM",
    date: "Mar 26",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Created Quotation",
    tag: "Order",
    description: "Generated quotation #Q-2026-0326-001 for $2,845.50",
    user: "David Chen",
    time: "11:15 AM",
    date: "Mar 26",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Updated Business Config",
    tag: "Config",
    description: "Changed frosted glass markup rate from 23% to 25%",
    user: "Admin",
    time: "10:50 AM",
    date: "Mar 26",
    color: "bg-gray-100 text-gray-600",
  },
]

export default function ActivityLogPage() {
  return (
    <div className="space-y-6">

      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Audit Log & Activity Feed</h1>
        <p className="text-sm text-muted-foreground">
          Real-time tracking of all system actions and changes
        </p>
      </div>

      {/* 🔹 SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-2">
        <Input placeholder="Search activities..." />
        <Button variant="outline">All Categories</Button>
      </div>

      {/* 🔹 SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {summary.map((item, i) => (
          <Card key={i} className={`p-3 ${item.color}`}>
            <p className="text-xs">{item.title}</p>
            <p className="text-xl font-bold">{item.count}</p>
          </Card>
        ))}
      </div>

      {/* 🔹 ACTIVITY FEED */}
      <Card className="p-4 space-y-4">
        <h2 className="font-semibold">Recent Activity (12 events)</h2>

        <div className="space-y-4">

          {activities.map((act, i) => (
            <div key={i} className="flex gap-4 border-b pb-4 last:border-none">

              {/* 🔹 ICON DOT */}
              <div className="w-2 h-2 mt-2 rounded-full bg-primary"></div>

              {/* 🔹 CONTENT */}
              <div className="flex-1 space-y-1">

                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{act.title}</p>

                  <span className={`text-xs px-2 py-0.5 rounded ${act.color}`}>
                    {act.tag}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {act.description}
                </p>

                <p className="text-xs text-muted-foreground">
                  {act.user} • {act.time} • {act.date}
                </p>

              </div>
            </div>
          ))}

        </div>
      </Card>

    </div>
  )
}