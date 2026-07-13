"use client"

import { useState } from "react"

import {
  FileText,
  Package,
  Wallet,
} from "lucide-react"

import DashboardSummaryCard from "./components/dashboard-summary-card"
import ProjectStatusChart from "./components/project-status-chart"
import NotificationsList from "./components/notifications-list"
import RecentOrdersTable from "./components/recent-orders-table"


import {
  ProjectStatus,
  ClientNotification,
  RecentOrder,
} from "./types/client-dashboard"

const projectStatusData: ProjectStatus[] = [
  {
    name: "Completed",
    value: 65,
  },

  {
    name: "In Progress",
    value: 25,
  },

  {
    name: "Pending",
    value: 10,
  },
]

const notificationsData: ClientNotification[] = [
  {
    id: 1,

    title:
      "Admin has sent a quote for Glass Partition Project",
    
    message:
      "You have received a new quotation for your Glass Partition project. Click to view details and respond.",

    time: "2 hours ago",

    type: "quotation",
  },

  {
    id: 2,

    title:
      "Production started for Aluminum Window Frame",

      message:
      "You have received a new quotation for your Glass Partition project. Click to view details and respond.",


    time: "5 hours ago",

    type: "production",
  },

  {
    id: 3,

    title:
      "Your custom dining table design has been approved",
    
    message:
      "You have received a new quotation for your Glass Partition project. Click to view details and respond.",


    time: "1 day ago",

    type: "approval",
  },

  {
    id: 4,

    title:
      "Payment reminder: Invoice #12345 is due in 3 days",
    
    message:
      "You have received a new quotation for your Glass Partition project. Click to view details and respond.",


    time: "1 day ago",

    type: "payment",
  },

  {
    id: 5,

    title:
      "Your order is ready for delivery - Schedule pickup",
    
    message:
      "You have received a new quotation for your Glass Partition project. Click to view details and respond.",


    time: "2 days ago",

    type: "delivery",
  },
]

const recentOrdersData: RecentOrder[] = [
  {
    id: 1,

    orderNumber: "ORD-2401",

    productName: "Glass Partition",

    product: "Glass Partition",

    date: "May 10, 2026",

    status: "In Production",
  },

  {
    id: 2,

    orderNumber: "ORD-2402",

    productName: "Sliding Window",

    product: "Sliding Window",

    date: "May 12, 2026",

    status:
      "Installation Scheduled",
  },

  {
    id: 3,

    orderNumber: "ORD-2403",

    productName: "Tempered Glass Door",

    product: "Tempered Glass Door",

    date: "May 14, 2026",

    status: "Pending",
  },

  {
    id: 4,

    orderNumber: "ORD-2404",

    productName: "Storefront Glass",

    product: "Storefront Glass",

    date: "May 15, 2026",

    status: "Completed",
  },
]

interface Props{
  profile:any
}

export default function ClientDashboard({ profile, }:Props) {
  const [activeQuotations] =
    useState(5)

  const [ordersInProduction] =
    useState(3)

  const [totalBalance] =
    useState(125450)

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold">
          Client Overview
        </h1>

        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your projects.
        </p>

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid gap-4 md:grid-cols-3">

        <DashboardSummaryCard
          title="Active Quotations"
          value={activeQuotations}
          icon={
            <FileText className="h-6 w-6 text-blue-500" />
          }
        />

        <DashboardSummaryCard
          title="Orders in Production"
          value={ordersInProduction}
          icon={
            <Package className="h-6 w-6 text-green-500" />
          }
        />

        <DashboardSummaryCard
          title="Total Balance"
          value={`₱${totalBalance.toLocaleString()}`}
          icon={
            <Wallet className="h-6 w-6 text-purple-500" />
          }
        />

      </div>

      {/* QUICK ACTIONS */}

      {/* CHART + NOTIFICATIONS */}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_.9fr]">

        <ProjectStatusChart
          data={projectStatusData}
        />

        <NotificationsList
          notifications={
            notificationsData
          }
        />

      </div>

      {/* RECENT ORDERS */}

      <RecentOrdersTable
        orders={recentOrdersData}
      />

    </div>
  )
}