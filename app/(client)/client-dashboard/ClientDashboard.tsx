"use client"

import { useEffect, useState } from "react"

import { FileText, Package, Wallet } from "lucide-react"

import DashboardSummaryCard from "./components/dashboard-summary-card"
import ProjectStatusChart from "./components/project-status-chart"
import NotificationsList from "./components/notifications-list"
import RecentOrdersTable from "./components/recent-orders-table"

import {
  ProjectStatus,
  ClientNotification,
  RecentOrder,
} from "./types/client-dashboard"

import {
  getClientDashboardSummary,
  getClientProjectStatus,
  getClientRecentOrders,
} from "./services/client-dashboard-service"

const notificationsData: ClientNotification[] = [
  {
    id: 1,

    title: "Admin has sent a quote for Glass Partition Project",

    message:
      "You have received a new quotation for your Glass Partition project. Click to view details and respond.",

    time: "2 hours ago",

    type: "quotation",
  },

  {
    id: 2,

    title: "Production started for Aluminum Window Frame",

    message:
      "You have received a new quotation for your Glass Partition project. Click to view details and respond.",

    time: "5 hours ago",

    type: "production",
  },

  {
    id: 3,

    title: "Your custom dining table design has been approved",

    message:
      "You have received a new quotation for your Glass Partition project. Click to view details and respond.",

    time: "1 day ago",

    type: "approval",
  },

  {
    id: 4,

    title: "Payment reminder: Invoice #12345 is due in 3 days",

    message:
      "You have received a new quotation for your Glass Partition project. Click to view details and respond.",

    time: "1 day ago",

    type: "payment",
  },

  {
    id: 5,

    title: "Your order is ready for delivery - Schedule pickup",

    message:
      "You have received a new quotation for your Glass Partition project. Click to view details and respond.",

    time: "2 days ago",

    type: "delivery",
  },
]

interface Props {
  profile: any
}

export default function ClientDashboard({ profile }: Props) {
  const [readyForDelivery, setReadyForDelivery] = useState(0)

  const [ordersInProduction, setOrdersInProduction] = useState(0)

  const [totalBalance, setTotalBalance] = useState(0)

  const [projectStatusData, setProjectStatusData] = useState<ProjectStatus[]>(
    []
  )

  const [recentOrdersData, setRecentOrdersData] = useState<RecentOrder[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError(null)

        const [summary, projectStatus, recentOrders] = await Promise.all([
          getClientDashboardSummary(),
          getClientProjectStatus(),
          getClientRecentOrders(),
        ])

        setReadyForDelivery(summary.readyForDelivery)

        setOrdersInProduction(summary.ordersInProduction)

        setTotalBalance(summary.totalBalance)

        setProjectStatusData(projectStatus)

        setRecentOrdersData(recentOrders)
      } catch (error) {
        console.error("CLIENT DASHBOARD ERROR:", error)

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard data"
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">Client Overview</h1>

        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardSummaryCard
          title="Ready for Delivery"
          value={loading ? "..." : readyForDelivery}
          icon={<FileText className="h-6 w-6 text-blue-500" />}
        />

        <DashboardSummaryCard
          title="Orders in Production"
          value={loading ? "..." : ordersInProduction}
          icon={<Package className="h-6 w-6 text-green-500" />}
        />

        <DashboardSummaryCard
          title="Total Balance"
          value={
            loading
              ? "..."
              : `₱${totalBalance.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
          }
          icon={<Wallet className="h-6 w-6 text-purple-500" />}
        />
      </div>

      {/* CHART + NOTIFICATIONS */}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_.9fr]">
        <ProjectStatusChart data={projectStatusData} />

        <NotificationsList notifications={notificationsData} />
      </div>

      {/* RECENT ORDERS */}

      <RecentOrdersTable orders={recentOrdersData} />
    </div>
  )
}
