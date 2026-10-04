export type FeedbackStatus =
  | "pending"
  | "published"
  | "archived"

export interface Feedback {
  id: string

  orderId: string
  orderNumber: string

  projectName: string

  rating: number
  comment: string

  submittedDate: string

  status: FeedbackStatus

  featured: boolean

  adminReply: string | null
  repliedAt: string | null
}

export interface FeedbackOrder {
  id: string

  orderNumber: string

  projectName: string

  deliveredDate: string
}