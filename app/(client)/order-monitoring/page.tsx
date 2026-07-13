"use client"

import { useState } from "react"

import { FileText, Package, Wrench, CheckCircle } from "lucide-react"

import MonitoringSummaryCard from "./components/monitoring-summary-card"
import OrdersMonitoringTable from "./components/orders-monitoring-table"
import ProductionStageLegend from "./components/production-stage-legend"
import ConfirmDeliveryDialog from "./components/confirm-delivery-dialog"

import { MonitoredOrder } from "./types/order-monitoring"

const initialOrders: MonitoredOrder[] = [
  {
    id: 1,

    orderNumber: "ORD-2026-001",

    date: "2026-04-01",

    productName: "Glass Office Partition",

    deliveryAddress: "Makati Business District",

    status: "In Fabrication",

    productionStage: {
      quotationApproved: true,
      materialPrep: true,
      fabrication: true,
      ready: false,
    },

    canConfirm: false,
  },

  {
    id: 2,

    orderNumber: "ORD-2026-002",

    date: "2026-04-03",

    productName: "Aluminum Sliding Door",

    deliveryAddress: "Quezon City Residence",

    status: "Material Prep",

    productionStage: {
      quotationApproved: true,
      materialPrep: true,
      fabrication: false,
      ready: false,
    },

    canConfirm: false,
  },

  {
    id: 3,

    orderNumber: "ORD-2026-003",

    date: "2026-03-28",

    productName: "Glass Dining Table",

    deliveryAddress: "BGC Condo Unit 2501",

    status: "Ready for Delivery",

    productionStage: {
      quotationApproved: true,
      materialPrep: true,
      fabrication: true,
      ready: true,
    },

    canConfirm: true,
  },

  {
    id: 4,

    orderNumber: "ORD-2026-004",

    date: "2026-04-05",

    productName: "Frameless Shower Enclosure",

    deliveryAddress: "Pasig City Home",

    status: "Quotation Approved",

    productionStage: {
      quotationApproved: true,
      materialPrep: false,
      fabrication: false,
      ready: false,
    },

    canConfirm: false,
  },
]

export default function OrderMonitoringPage() {
  const [orders, setOrders] = useState(initialOrders)

  const [selectedOrder, setSelectedOrder] = useState<MonitoredOrder | null>(
    null
  )

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const handleOpenConfirm = (order: MonitoredOrder) => {
    setSelectedOrder(order)

    setConfirmDialogOpen(true)
  }

  const handleConfirmDelivery = () => {
    if (!selectedOrder) return

    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,

              status: "Ready for Delivery",

              canConfirm: false,
            }
          : order
      )
    )

    setConfirmDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}

      <div>
        <h1 className="text-2xl font-bold">Order Monitoring</h1>

        <p className="text-muted-foreground">
          Track your orders from quotation to delivery
        </p>
      </div>

      {/* SUMMARY */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MonitoringSummaryCard
          title="Pending Approval"
          value={1}
          icon={<FileText className="h-4 w-4 text-blue-500" />}
        />

        <MonitoringSummaryCard
          title="In Preparation"
          value={1}
          icon={<Package className="h-4 w-4 text-yellow-500" />}
        />

        <MonitoringSummaryCard
          title="In Fabrication"
          value={1}
          icon={<Wrench className="h-4 w-4 text-purple-500" />}
        />

        <MonitoringSummaryCard
          title="Ready"
          value={1}
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        />
      </div>

      {/* TABLE */}

      <OrdersMonitoringTable
        orders={orders}
        onConfirmDelivery={handleOpenConfirm}
      />

      {/* LEGEND */}

      <ProductionStageLegend />

      {/* DIALOG */}

      <ConfirmDeliveryDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        order={selectedOrder}
        onConfirm={handleConfirmDelivery}
      />
    </div>
  )
}
