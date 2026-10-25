"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Bell,
  CreditCard,
  FileText,
  Package,
  RotateCcw,
  Settings,
  Truck,
} from "lucide-react"

import type { ClientNotification } from "../types/client-dashboard"

interface Props {
  notifications: ClientNotification[]
}

function formatRelativeTime(createdAt: string): string {
  const created = new Date(createdAt)
  const now = new Date()

  const differenceInSeconds = Math.max(
    0,
    Math.floor((now.getTime() - created.getTime()) / 1000)
  )

  if (differenceInSeconds < 60) {
    return "Just now"
  }

  const minutes = Math.floor(differenceInSeconds / 60)

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  }

  const days = Math.floor(hours / 24)

  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`
  }

  return created.toLocaleDateString()
}

export default function NotificationsList({ notifications }: Props) {
  const icons = {
    custom_request: <FileText className="h-5 w-5 text-blue-500" />,

    quotation: <FileText className="h-5 w-5 text-blue-500" />,

    payment: <CreditCard className="h-5 w-5 text-orange-500" />,

    production: <Package className="h-5 w-5 text-green-500" />,

    delivery: <Truck className="h-5 w-5 text-blue-500" />,

    return: <RotateCcw className="h-5 w-5 text-purple-500" />,

    system: <Settings className="h-5 w-5 text-muted-foreground" />,
  }

  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/70 py-0 shadow-none ring-0">
      <CardHeader className="gap-1 border-b border-border/60 px-5 py-5 sm:px-6">
        <CardTitle className="text-base font-semibold tracking-tight">
          Recent Notifications
        </CardTitle>
        <p className="text-xs leading-5 text-muted-foreground">
          The latest updates on your orders and account.
        </p>
      </CardHeader>

      <CardContent className="px-5 py-5 sm:px-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="mb-3 h-8 w-8 text-muted-foreground" />

            <p className="text-sm font-medium">No notifications yet</p>

            <p className="mt-2 text-[11px] text-muted-foreground">
              Your latest order and account updates will appear here.
            </p>
          </div>
        ) : (
          <div className="max-h-[310px] space-y-4 overflow-y-auto pr-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex gap-3 border-b border-border/60 pb-4 last:border-0 last:pb-0"
              >
                <div className="h-fit shrink-0 rounded-lg bg-muted/70 p-2.5">
                  {icons[notification.type]}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <p className="flex-1 text-sm font-medium">
                      {notification.title}
                    </p>

                    {!notification.isRead && (
                      <span
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
                        aria-label="Unread notification"
                      />
                    )}
                  </div>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
