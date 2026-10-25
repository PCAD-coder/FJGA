"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

import { RecentOrder } from "../types/client-dashboard"

interface Props {
  orders: RecentOrder[]
}

export default function RecentOrdersTable({ orders }: Props) {
  const statusStyles: Record<RecentOrder["status"], string> = {
    Pending: "bg-orange-100 text-orange-700",

    Quoted: "bg-yellow-100 text-yellow-700",

    Approved: "bg-purple-100 text-purple-700",

    "In Production": "bg-blue-100 text-blue-700",

    "Ready for Delivery": "bg-indigo-100 text-indigo-700",

    Delivered: "bg-green-100 text-green-700",

    Cancelled: "bg-red-100 text-red-700",

    Denied: "bg-red-100 text-red-700",
  }

  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/70 py-0 shadow-none ring-0">
      <CardHeader className="gap-1 border-b border-border/60 px-5 py-5 sm:px-6">
        <CardTitle className="text-base font-semibold tracking-tight">
          Recent Orders
        </CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">
          Keep track of your latest orders and their progress.
        </p>
      </CardHeader>

      <CardContent className="px-0 pb-1">
        <Table className="min-w-[560px]">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="h-11 px-5 text-xs font-medium sm:px-6">
                Order No.
              </TableHead>

              <TableHead className="h-11 px-5 text-xs font-medium sm:px-6">
                Product
              </TableHead>

              <TableHead className="h-11 px-5 text-xs font-medium sm:px-6">
                Date
              </TableHead>

              <TableHead className="h-11 px-5 text-xs font-medium sm:px-6">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-36 text-center text-sm text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 text-sm sm:px-6">
                    {order.orderNumber}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm sm:px-6">
                    {order.product}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm sm:px-6">
                    {order.date}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-sm sm:px-6">
                    <Badge
                      className={
                        "rounded-full border-0 px-2.5 py-1 text-[11px] font-medium " +
                        statusStyles[order.status]
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
