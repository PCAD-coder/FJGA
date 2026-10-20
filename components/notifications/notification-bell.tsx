"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Bell,
  CheckCheck,
  CircleDollarSign,
  ClipboardList,
  FileText,
  PackageCheck,
  RotateCcw,
  Settings,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/notifications/notification-service"
import type { Notification, NotificationType } from "@/lib/notifications/types"
const supabase = createClient()

function NotificationIcon({ type }: { type: NotificationType }) {
  const className = "size-4"

  switch (type) {
    case "custom_request":
      return <ClipboardList className={className} />

    case "quotation":
      return <FileText className={className} />

    case "payment":
      return <CircleDollarSign className={className} />

    case "production":
      return <Wrench className={className} />

    case "delivery":
      return <PackageCheck className={className} />

    case "return":
      return <RotateCcw className={className} />

    case "system":
    default:
      return <Settings className={className} />
  }
}

function formatNotificationTime(createdAt: string) {
  const created = new Date(createdAt)
  const now = new Date()

  const difference = now.getTime() - created.getTime()
  const seconds = Math.floor(difference / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return "Just now"
  }

  if (minutes < 60) {
    return `${minutes}m ago`
  }

  if (hours < 24) {
    return `${hours}h ago`
  }

  if (days < 7) {
    return `${days}d ago`
  }

  return created.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: created.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}

export function NotificationBell() {
  const router = useRouter()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [markingAll, setMarkingAll] = useState(false)

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true)

      const [notificationData, unread] = await Promise.all([
        getNotifications(10),
        getUnreadNotificationCount(),
      ])

      setNotifications(notificationData)
      setUnreadCount(unread)
    } catch (error) {
      console.error("Failed to load notifications:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadNotifications()
  }, [loadNotifications])
  useEffect(() => {
  let channel: ReturnType<typeof supabase.channel> | null = null
  let cancelled = false

  async function subscribeToNotifications() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        throw authError
      }

      if (!user || cancelled) {
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_user_id", user.id)
        .single()

      if (profileError) {
        throw profileError
      }

      if (cancelled) {
        return
      }

      channel = supabase
        .channel(`notifications:${profile.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `recipient_profile_id=eq.${profile.id}`,
          },
          () => {
            void loadNotifications()
          }
        )
        .subscribe((status) => {
          if (status === "CHANNEL_ERROR") {
            console.error("Notification realtime channel error")
          }
        })
    } catch (error) {
      console.error(
        "Failed to subscribe to realtime notifications:",
        error
      )
    }
  }

  void subscribeToNotifications()

  return () => {
    cancelled = true

    if (channel) {
      void supabase.removeChannel(channel)
    }
  }
}, [loadNotifications])

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification.id)

        setNotifications((current) =>
          current.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : item
          )
        )

        setUnreadCount((current) => Math.max(0, current - 1))
      }

      if (notification.link) {
        router.push(notification.link)
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || markingAll) {
      return
    }

    try {
      setMarkingAll(true)

      await markAllNotificationsAsRead()

      const readAt = new Date().toISOString()

      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt ?? readAt,
        }))
      )

      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    } finally {
      setMarkingAll(false)
    }
  }

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          void loadNotifications()
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
        >
          <Bell className="size-5" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-none font-medium text-destructive-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2rem)] max-w-sm p-0"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>

          {unreadCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={markingAll}
              onClick={(event) => {
                event.preventDefault()
                void handleMarkAllAsRead()
              }}
              className="h-auto gap-1.5 px-2 py-1 text-xs"
            >
              <CheckCheck className="size-3.5" />

              {markingAll ? "Marking..." : "Mark all read"}
            </Button>
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <Bell className="mx-auto mb-3 size-8 text-muted-foreground/50" />

              <p className="text-sm font-medium">No notifications yet</p>

              <p className="mt-1 text-xs text-muted-foreground">
                New updates will appear here.
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => void handleNotificationClick(notification)}
                  className="flex w-full gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/50"
                >
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <NotificationIcon type={notification.type} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <p
                        className={
                          notification.isRead
                            ? "flex-1 text-sm font-medium text-muted-foreground"
                            : "flex-1 text-sm font-semibold"
                        }
                      >
                        {notification.title}
                      </p>

                      {!notification.isRead && (
                        <span
                          className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
                          aria-label="Unread"
                        />
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {notification.message}
                    </p>

                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      {formatNotificationTime(notification.createdAt)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
