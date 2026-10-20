"use client"

import { useEffect, useState } from "react"

import { FileText, Package, Wallet } from "lucide-react"

import DashboardSummaryCard from "./components/dashboard-summary-card"
import ProjectStatusChart from "./components/project-status-chart"
import NotificationsList from "./components/notifications-list"
import RecentOrdersTable from "./components/recent-orders-table"

import type {
  ProjectStatus,
  ClientNotification,
  RecentOrder,
} from "./types/client-dashboard"

import {
  getClientDashboardSummary,
  getClientProjectStatus,
  getClientRecentOrders,
  getClientRecentNotifications,
} from "./services/client-dashboard-service"

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

  const [notifications, setNotifications] = useState<ClientNotification[]>([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError(null)

        const [
          summary,
          projectStatus,
          recentOrders,
          recentNotifications,
        ] = await Promise.all([
          getClientDashboardSummary(),
          getClientProjectStatus(),
          getClientRecentOrders(),
          getClientRecentNotifications(),
        ])

        setReadyForDelivery(summary.readyForDelivery)

        setOrdersInProduction(summary.ordersInProduction)

        setTotalBalance(summary.totalBalance)

        setProjectStatusData(projectStatus)

        setRecentOrdersData(recentOrders)

        setNotifications(recentNotifications)
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

        <NotificationsList notifications={notifications} />
      </div>

      {/* RECENT ORDERS */}

      <RecentOrdersTable orders={recentOrdersData} />
    </div>
  )
}