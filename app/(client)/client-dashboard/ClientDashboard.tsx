"use client"

import { useEffect, useState } from "react"

import { FileText, Package, Wallet } from "lucide-react"

import DashboardSummaryCard from "./components/dashboard-summary-card"
import ProjectStatusChart from "./components/project-status-chart"
import NotificationsList from "./components/notifications-list"
import RecentOrdersTable from "./components/recent-orders-table"
import DashboardSkeleton from "./components/dashboard-skeleton"

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

        const [summary, projectStatus, recentOrders, recentNotifications] =
          await Promise.all([
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

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6 px-1 pt-4 pb-12 sm:px-4 sm:pt-6 lg:px-6">
      {/* HEADER */}

      <div className="border-b border-border/70 pb-6">
        <p className="mb-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          Your workspace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Client Overview
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardSummaryCard
          title="Ready for Delivery"
          value={loading ? "..." : readyForDelivery}
          icon={
            <FileText className="size-5 text-blue-600 dark:text-blue-400" />
          }
        />

        <DashboardSummaryCard
          title="Orders in Production"
          value={loading ? "..." : ordersInProduction}
          icon={
            <Package className="size-5 text-emerald-600 dark:text-emerald-400" />
          }
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
          icon={<Wallet className="size-5 text-primary" />}
        />
      </div>

      {/* RECENT ORDERS */}

      <RecentOrdersTable orders={recentOrdersData} />

      {/* CHART + NOTIFICATIONS */}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_.9fr]">
        <ProjectStatusChart data={projectStatusData} />

        <NotificationsList notifications={notifications} />
      </div>
    </div>
  )
}
