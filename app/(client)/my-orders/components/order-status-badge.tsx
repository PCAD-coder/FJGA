"use client"

import { Badge } from "@/components/ui/badge"

import type { OrderStatus } from "../types/order"

interface Props {
  status: OrderStatus
}

const variant: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
  Quoted: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  Approved: "bg-green-100 text-green-700 hover:bg-green-100",
  Production: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  "Ready for Delivery":
    "bg-purple-100 text-purple-700 hover:bg-purple-100",
  Completed: "bg-green-100 text-green-700 hover:bg-green-100",
  Declined: "bg-red-100 text-red-700 hover:bg-red-100",
  Cancelled: "bg-gray-100 text-gray-700 hover:bg-gray-100",
}

export default function OrderStatusBadge({ status }: Props) {
  return (
    <Badge className={variant[status]}>
      {status}
    </Badge>
  )
}