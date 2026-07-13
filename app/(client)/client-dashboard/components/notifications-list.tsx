"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  FileText,
  Package,
  TrendingUp,
  CreditCard,
  Truck,
} from "lucide-react"

import { ClientNotification } from "../types/client-dashboard"

interface Props {
  notifications: ClientNotification[]
}

export default function NotificationsList({
  notifications,
}: Props) {
  const icons = {
    quotation: (
      <FileText className="h-5 w-5 text-blue-500" />
    ),

    production: (
      <Package className="h-5 w-5 text-green-500" />
    ),

    approval: (
      <TrendingUp className="h-5 w-5 text-purple-500" />
    ),

    payment: (
      <CreditCard className="h-5 w-5 text-orange-500" />
    ),

    delivery: (
      <Truck className="h-5 w-5 text-blue-500" />
    ),
  }

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Recent Notifications
        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-4">

        {notifications.map(
          (notification) => (
            <div
              key={notification.id}
              className="flex gap-4 border-b pb-4 last:border-0"
            >
              <div className="rounded-full bg-muted p-3">

                {
                  icons[
                    notification.type
                  ]
                }

              </div>

              <div className="flex-1">

                <p className="text-sm font-medium">
                  {
                    notification.title
                  }
                </p>

                <p className="text-xs text-muted-foreground">
                  {
                    notification.time
                  }
                </p>

              </div>

            </div>
          )
        )}

      </CardContent>

    </Card>
  )
}