"use client";

import { DashboardCard } from "@/components/dashboard_cards";

import {
  TrendingUp,
  ClipboardList,
  AlertTriangle,
  Truck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type DashboardClientProps = {
  profile: {
    id: string;
    role: string;
    first_name?: string | null;
    last_name?: string | null;
  };
};

const revenueData = [
  { month: "Oct 2025", revenue: 52000 },
  { month: "Nov 2025", revenue: 61000 },
  { month: "Dec 2025", revenue: 70000 },
  { month: "Jan 2026", revenue: 75000 },
  { month: "Feb 2026", revenue: 69000 },
  { month: "Mar 2026", revenue: 82000 },
  { month: "Apr 2026", revenue: 90000 },
];

const categoryData = [
  { name: "Windows", value: 35, color: "#3b82f6" },
  { name: "Doors", value: 28, color: "#10b981" },
  { name: "Railings", value: 20, color: "#f59e0b" },
  { name: "Partitions", value: 17, color: "#8b5cf6" },
];

export default function DashboardClient({
  profile,
}: DashboardClientProps) {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Welcome back{profile.first_name ? `, ${profile.first_name}` : ""}!
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Total Weekly Sales"
          value="₱485,250"
          description="+12.5% from last week"
          icon={TrendingUp}
          color="text-green-500"
        />

        <DashboardCard
          title="Active Orders"
          value="24"
          description="8 in production"
          icon={ClipboardList}
          color="text-blue-500"
        />

        <DashboardCard
          title="Low Stock Items"
          value="7"
          description="Reorder required"
          icon={AlertTriangle}
          color="text-orange-500"
        />

        <DashboardCard
          title="Pending Deliveries"
          value="12"
          description="5 scheduled today"
          icon={Truck}
          color="text-purple-500"
        />

      </div>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-3">

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>
              Monthly revenue trend (₱)
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Category Distribution</CardTitle>

            <CardDescription>
              Sales by category (%)
            </CardDescription>
          </CardHeader>

          <CardContent>

            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-2">
              {categoryData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-sm"
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="font-medium">
                    {item.name}
                  </span>

                  <span className="text-muted-foreground">
                    ({item.value}%)
                  </span>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>

      </div>

      {/* RECENT ACTIVITY */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>

          <CardDescription>
            Latest actions performed in the system
          </CardDescription>
        </CardHeader>

        <CardContent>

          <div className="space-y-4">

            <div className="flex justify-between border-b pb-3">
              <span>Admin added new aluminum profile</span>
              <span className="text-muted-foreground">
                10 mins ago
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>Staff updated inventory stock</span>
              <span className="text-muted-foreground">
                35 mins ago
              </span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span>New custom order approved</span>
              <span className="text-muted-foreground">
                1 hour ago
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery marked as completed</span>
              <span className="text-muted-foreground">
                3 hours ago
              </span>
            </div>

          </div>

        </CardContent>
      </Card>

    </div>
  );
}