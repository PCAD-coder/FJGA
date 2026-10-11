"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

export default function RecentOrdersTable({
  orders,
}: Props) {
  const statusStyles: Record<
    RecentOrder["status"],
    string
  > = {
    Pending:
      "bg-orange-100 text-orange-700",

    Quoted:
      "bg-yellow-100 text-yellow-700",

    Approved:
      "bg-purple-100 text-purple-700",

    "In Production":
      "bg-blue-100 text-blue-700",

    "Ready for Delivery":
      "bg-indigo-100 text-indigo-700",

    Delivered:
      "bg-green-100 text-green-700",

    Cancelled:
      "bg-red-100 text-red-700",

    Denied:
      "bg-red-100 text-red-700",
  }

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Recent Orders
        </CardTitle>

      </CardHeader>

      <CardContent>

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                Order No.
              </TableHead>

              <TableHead>
                Product
              </TableHead>

              <TableHead>
                Date
              </TableHead>

              <TableHead>
                Status
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {orders.length === 0 ? (
              <TableRow>

                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No orders found.
                </TableCell>

              </TableRow>
            ) : (
              orders.map(
                (order) => (
                  <TableRow
                    key={order.id}
                  >

                    <TableCell>
                      {
                        order.orderNumber
                      }
                    </TableCell>

                    <TableCell>
                      {order.product}
                    </TableCell>

                    <TableCell>
                      {order.date}
                    </TableCell>

                    <TableCell>

                      <Badge
                        className={
                          statusStyles[
                            order.status
                          ]
                        }
                      >
                        {
                          order.status
                        }
                      </Badge>

                    </TableCell>

                  </TableRow>
                )
              )
            )}

          </TableBody>

        </Table>

      </CardContent>

    </Card>
  )
}