import { createClient } from "@/lib/supabase/client"

import type {
  Notification,
  NotificationRow,
} from "./types"

const supabase = createClient()

function mapNotification(
  row: NotificationRow
): Notification {
  return {
    id: row.id,
    recipientProfileId: row.recipient_profile_id,
    type: row.type,
    title: row.title,
    message: row.message,
    link: row.link,
    isRead: row.is_read,
    readAt: row.read_at,
    createdAt: row.created_at,
  }
}

export async function getNotifications(
  limit = 10
): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select(`
      id,
      recipient_profile_id,
      type,
      title,
      message,
      link,
      is_read,
      read_at,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return ((data ?? []) as NotificationRow[]).map(
    mapNotification
  )
}

export async function getUnreadNotificationCount(): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("is_read", false)

  if (error) {
    throw error
  }

  return count ?? 0
}

export async function markNotificationAsRead(
  notificationId: string
): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("id", notificationId)
    .eq("is_read", false)

  if (error) {
    throw error
  }
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq("is_read", false)

  if (error) {
    throw error
  }
}