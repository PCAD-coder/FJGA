import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface PublicHomepageContent {
  heroTitle: string
  heroDescription: string
  heroImageUrl: string | null
}

interface HomepageRow {
  hero_title: string
  hero_description: string
  hero_image_url: string | null
}

export async function getPublicHomepageContent(): Promise<PublicHomepageContent> {
  const { data, error } = await supabase
    .from("content_homepage")
    .select(
      `
      hero_title,
      hero_description,
      hero_image_url
    `
    )
    .order("created_at", { ascending: true })
    .limit(1)
    .single()

  if (error) {
    throw error
  }

  const row = data as HomepageRow

  return {
    heroTitle: row.hero_title,
    heroDescription: row.hero_description,
    heroImageUrl: row.hero_image_url,
  }
}

export interface PublicContentProject {
  id: string
  title: string
  description: string | null
  category: string | null
  imageUrl: string
  displayOrder: number
}

interface ProjectRow {
  id: string
  title: string
  description: string | null
  category: string | null
  image_url: string
  display_order: number
}

export async function getPublicContentProjects(): Promise<
  PublicContentProject[]
> {
  const { data, error } = await supabase
    .from("content_projects")
    .select(
      `
      id,
      title,
      description,
      category,
      image_url,
      display_order
    `
    )
    .eq("is_visible", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    throw error
  }

  return (data as ProjectRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    imageUrl: row.image_url,
    displayOrder: row.display_order,
  }))
}

export interface PublicFeaturedFeedback {
  id: string
  customerName: string
  rating: number
  comment: string
  createdAt: string
}

interface FeaturedFeedbackRow {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: string
}

export async function getPublicFeaturedFeedback(): Promise<
  PublicFeaturedFeedback[]
> {
  const { data, error } = await supabase.rpc("get_featured_feedback")

  if (error) {
    throw error
  }

  return ((data ?? []) as FeaturedFeedbackRow[]).map((row) => ({
    id: row.id,
    customerName: row.customer_name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  }))
}

export type PublicSocialPlatform =
  | "facebook"
  | "messenger"
  | "instagram"
  | "tiktok"
  | "email"
  | "phone"
  | "other"

export interface PublicSocialLink {
  id: string
  platform: PublicSocialPlatform
  label: string
  url: string
  displayOrder: number
}

interface SocialLinkRow {
  id: string
  platform: PublicSocialPlatform
  label: string
  url: string
  display_order: number
}

export async function getPublicSocialLinks(): Promise<PublicSocialLink[]> {
  const { data, error } = await supabase
    .from("content_social_links")
    .select(
      `
      id,
      platform,
      label,
      url,
      display_order
    `
    )
    .eq("is_visible", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    throw error
  }

  return ((data ?? []) as SocialLinkRow[]).map((row) => ({
    id: row.id,
    platform: row.platform,
    label: row.label,
    url: row.url,
    displayOrder: row.display_order,
  }))
}
