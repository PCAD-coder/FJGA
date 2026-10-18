export type NotificationType =
  | "custom_request"
  | "quotation"
  | "payment"
  | "production"
  | "delivery"
  | "return"
  | "system"

export interface Notification {
  id: string
  recipientProfileId: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export interface NotificationRow {
  id: string
  recipient_profile_id: string
  type: NotificationType
  title: string
  message: string
  link: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
}