export interface HomepageContent {
  id: string
  heroTitle: string
  heroDescription: string
  heroImageUrl: string | null
  updatedBy: string | null
  createdAt: string
  updatedAt: string
}

export interface ContentProject {
  id: string
  title: string
  description: string | null
  category: string | null
  imageUrl: string
  isVisible: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export type SocialPlatform =
  | "facebook"
  | "messenger"
  | "instagram"
  | "tiktok"
  | "email"
  | "phone"
  | "other"

export interface ContentSocialLink {
  id: string
  platform: SocialPlatform
  label: string
  url: string
  isVisible: boolean
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export type FeedbackStatus = "pending" | "approved" | "rejected"

export interface ContentFeedback {
  id: string
  orderId: string
  orderNumber: string
  customerId: string
  customerName: string
  rating: number
  comment: string
  status: FeedbackStatus
  featured: boolean
  adminReply: string | null
  repliedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateContentProjectInput {
  title: string
  description?: string | null
  category?: string | null
  imageUrl: string
  isVisible?: boolean
  displayOrder?: number
}

export interface UpdateContentProjectInput {
  title?: string
  description?: string | null
  category?: string | null
  imageUrl?: string
  isVisible?: boolean
  displayOrder?: number
}

export interface CreateSocialLinkInput {
  platform: SocialPlatform
  label: string
  url: string
  isVisible?: boolean
  displayOrder?: number
}

export interface UpdateSocialLinkInput {
  platform?: SocialPlatform
  label?: string
  url?: string
  isVisible?: boolean
  displayOrder?: number
}

export interface UpdateHomepageInput {
  heroTitle: string
  heroDescription: string
  heroImageUrl: string | null
}