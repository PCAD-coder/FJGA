"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Download } from "lucide-react"

import { MonitoredOrder } from "../types/order-monitoring"

import ProductionStageProgress from "./production-stage-progress"

interface Props {
  orders: MonitoredOrder[]

  onConfirmDelivery: (order: MonitoredOrder) => void
}

export default function OrdersMonitoringTable({
  orders,
  onConfirmDelivery,
}: Props) {
  const statusStyles = {
    "Quotation Approved": "bg-blue-100 text-blue-700",

    "Material Prep": "bg-yellow-100 text-yellow-700",

    "In Fabrication": "bg-purple-100 text-purple-700",

    "Ready for Delivery": "bg-green-100 text-green-700",
  }

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>

            <TableHead>Product</TableHead>

            <TableHead>Delivery Address</TableHead>

            <TableHead>Status</TableHead>

            <TableHead>Production Stage</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>

              <TableCell>{order.date}</TableCell>

              <TableCell>{order.productName}</TableCell>

              <TableCell>{order.deliveryAddress}</TableCell>

              <TableCell>
                <Badge className={statusStyles[order.status]}>
                  {order.status}
                </Badge>
              </TableCell>

              <TableCell>
                <ProductionStageProgress stage={order.productionStage} />
              </TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    PDF
                  </Button>

                  {order.canConfirm && (
                    <Button size="sm" onClick={() => onConfirmDelivery(order)}>
                      Confirm
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
