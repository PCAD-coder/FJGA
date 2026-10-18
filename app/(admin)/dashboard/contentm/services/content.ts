import { createClient } from "@/lib/supabase/client"

import type {
  ContentFeedback,
  ContentProject,
  CreateContentProjectInput,
  HomepageContent,
  UpdateContentProjectInput,
  UpdateHomepageInput,
  ContentSocialLink,
  CreateSocialLinkInput,
  UpdateSocialLinkInput,
} from "../types/content"

const supabase = createClient()

interface HomepageRow {
  id: string
  hero_title: string
  hero_description: string
  hero_image_url: string | null
  updated_by: string | null
  created_at: string
  updated_at: string
}

interface ContentProjectRow {
  id: string
  title: string
  description: string | null
  category: string | null
  image_url: string
  is_visible: boolean
  display_order: number
  created_at: string
  updated_at: string
}

interface ContentFeedbackRow {
  id: string
  order_id: string
  customer_id: string
  rating: number
  comment: string
  status: "pending" | "published" | "archived"
  featured: boolean
  admin_reply: string | null
  replied_at: string | null
  created_at: string
  updated_at: string
  orders: {
    order_number: string
  } | null
  profiles: {
    first_name: string | null
    last_name: string | null
    full_name: string | null
  } | null
}
interface ContentSocialLinkRow {
  id: string
  platform:
    | "facebook"
    | "messenger"
    | "instagram"
    | "tiktok"
    | "email"
    | "phone"
    | "other"
  label: string
  url: string
  is_visible: boolean
  display_order: number
  created_at: string
  updated_at: string
}

function mapContentSocialLink(
  row: ContentSocialLinkRow
): ContentSocialLink {
  return {
    id: row.id,
    platform: row.platform,
    label: row.label,
    url: row.url,
    isVisible: row.is_visible,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getContentSocialLinks():
  Promise<ContentSocialLink[]> {
  const { data, error } = await supabase
    .from("content_social_links")
    .select(`
      id,
      platform,
      label,
      url,
      is_visible,
      display_order,
      created_at,
      updated_at
    `)
    .order("display_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: true,
    })

  if (error) {
    throw error
  }

  return (data as ContentSocialLinkRow[]).map(
    mapContentSocialLink
  )
}

export async function createContentSocialLink(
  input: CreateSocialLinkInput
): Promise<ContentSocialLink> {
  const { data, error } = await supabase
    .from("content_social_links")
    .insert({
      platform: input.platform,
      label: input.label.trim(),
      url: input.url.trim(),
      is_visible: input.isVisible ?? true,
      display_order: input.displayOrder ?? 0,
    })
    .select(`
      id,
      platform,
      label,
      url,
      is_visible,
      display_order,
      created_at,
      updated_at
    `)
    .single()

  if (error) {
    throw error
  }

  return mapContentSocialLink(
    data as ContentSocialLinkRow
  )
}

export async function updateContentSocialLink(
  id: string,
  input: UpdateSocialLinkInput
): Promise<ContentSocialLink> {
  const updates: Record<string, unknown> = {}

  if (input.platform !== undefined) {
    updates.platform = input.platform
  }

  if (input.label !== undefined) {
    updates.label = input.label.trim()
  }

  if (input.url !== undefined) {
    updates.url = input.url.trim()
  }

  if (input.isVisible !== undefined) {
    updates.is_visible = input.isVisible
  }

  if (input.displayOrder !== undefined) {
    updates.display_order = input.displayOrder
  }

  const { data, error } = await supabase
    .from("content_social_links")
    .update(updates)
    .eq("id", id)
    .select(`
      id,
      platform,
      label,
      url,
      is_visible,
      display_order,
      created_at,
      updated_at
    `)
    .single()

  if (error) {
    throw error
  }

  return mapContentSocialLink(
    data as ContentSocialLinkRow
  )
}

export async function deleteContentSocialLink(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("content_social_links")
    .delete()
    .eq("id", id)

  if (error) {
    throw error
  }
}

function getFeedbackCustomerName(
  profile: ContentFeedbackRow["profiles"]
): string {
  if (!profile) {
    return "Customer"
  }

  const fullName = profile.full_name?.trim()

  if (fullName) {
    return fullName
  }

  const firstName = profile.first_name?.trim() ?? ""
  const lastName = profile.last_name?.trim() ?? ""

  const combinedName =
    `${firstName} ${lastName}`.trim()

  return combinedName || "Customer"
}

function mapContentFeedback(
  row: ContentFeedbackRow
): ContentFeedback {
  return {
    id: row.id,
    orderId: row.order_id,
    orderNumber:
      row.orders?.order_number ?? "Unknown Order",
    customerId: row.customer_id,
    customerName:
      getFeedbackCustomerName(row.profiles),
    rating: row.rating,
    comment: row.comment,
    status: row.status,
    featured: row.featured,
    adminReply: row.admin_reply,
    repliedAt: row.replied_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getContentFeedback():
  Promise<ContentFeedback[]> {
  const { data, error } = await supabase
    .from("feedback")
    .select(`
      id,
      order_id,
      customer_id,
      rating,
      comment,
      status,
      featured,
      admin_reply,
      replied_at,
      created_at,
      updated_at,
      orders (
        order_number
      ),
      profiles (
        first_name,
        last_name,
        full_name
      )
    `)
    .order("created_at", {
      ascending: false,
    })

  if (error) {
    throw error
  }

  return (data as unknown as ContentFeedbackRow[]).map(
    mapContentFeedback
  )
}

export async function setFeedbackFeatured(
  id: string,
  featured: boolean
): Promise<ContentFeedback> {
  /*
   * Only published feedback should ever become
   * featured website content.
   */
  if (featured) {
    const { data: existingFeedback, error: fetchError } =
      await supabase
        .from("feedback")
        .select("status")
        .eq("id", id)
        .single()

    if (fetchError) {
      throw fetchError
    }

    if (existingFeedback.status !== "published") {
      throw new Error(
        "Only published feedback can be featured."
      )
    }
  }

  const { data, error } = await supabase
    .from("feedback")
    .update({
      featured,
    })
    .eq("id", id)
    .select(`
      id,
      order_id,
      customer_id,
      rating,
      comment,
      status,
      featured,
      admin_reply,
      replied_at,
      created_at,
      updated_at,
      orders (
        order_number
      ),
      profiles (
        first_name,
        last_name,
        full_name
      )
    `)
    .single()

  if (error) {
    throw error
  }

  return mapContentFeedback(
    data as unknown as ContentFeedbackRow
  )
}

function mapContentProject(
  row: ContentProjectRow
): ContentProject {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    imageUrl: row.image_url,
    isVisible: row.is_visible,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapHomepage(row: HomepageRow): HomepageContent {
  return {
    id: row.id,
    heroTitle: row.hero_title,
    heroDescription: row.hero_description,
    heroImageUrl: row.hero_image_url,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const { data, error } = await supabase
    .from("content_homepage")
    .select(
      `
        id,
        hero_title,
        hero_description,
        hero_image_url,
        updated_by,
        created_at,
        updated_at
      `
    )
    .order("created_at", { ascending: true })
    .limit(1)
    .single()

  if (error) {
    throw error
  }

  return mapHomepage(data as HomepageRow)
}

export async function updateHomepageContent(
  id: string,
  input: UpdateHomepageInput
): Promise<HomepageContent> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    throw userError
  }

  if (!user) {
    throw new Error("Authentication required")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("auth_user_id", user.id)
    .single()

  if (profileError) {
    throw profileError
  }

  const { data, error } = await supabase
    .from("content_homepage")
    .update({
      hero_title: input.heroTitle.trim(),
      hero_description: input.heroDescription.trim(),
      hero_image_url: input.heroImageUrl,
      updated_by: profile.id,
    })
    .eq("id", id)
    .select(
      `
        id,
        hero_title,
        hero_description,
        hero_image_url,
        updated_by,
        created_at,
        updated_at
      `
    )
    .single()

  if (error) {
    throw error
  }

  return mapHomepage(data as HomepageRow)
}
const SITE_CONTENT_BUCKET = "site-content"
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

export function validateContentImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, and WebP images are allowed.")
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be 5 MB or smaller.")
  }
}

export async function uploadHomepageImage(file: File): Promise<string> {
  validateContentImage(file)

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"

  const fileName = `${crypto.randomUUID()}.${extension}`
  const filePath = `homepage/${fileName}`

  const { error } = await supabase.storage
    .from(SITE_CONTENT_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })

  if (error) {
    throw error
  }

  const { data } = supabase.storage
    .from(SITE_CONTENT_BUCKET)
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function uploadProjectImage(
  file: File
): Promise<string> {
  validateContentImage(file)

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg"

  const fileName = `${crypto.randomUUID()}.${extension}`
  const filePath = `projects/${fileName}`

  const { error } = await supabase.storage
    .from(SITE_CONTENT_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    })

  if (error) {
    throw error
  }

  const { data } = supabase.storage
    .from(SITE_CONTENT_BUCKET)
    .getPublicUrl(filePath)

  return data.publicUrl
}

export async function deleteContentImage(imageUrl: string): Promise<void> {
  const bucketPath = "/site-content/"
  const bucketIndex = imageUrl.indexOf(bucketPath)

  if (bucketIndex === -1) {
    console.warn("Could not determine site-content storage path:", imageUrl)
    return
  }

  const encodedFilePath = imageUrl.slice(bucketIndex + bucketPath.length)

  const filePath = decodeURIComponent(encodedFilePath.split("?")[0])

  if (!filePath) {
    console.warn("Could not determine file path from image URL:", imageUrl)
    return
  }

  const { error } = await supabase.storage
    .from("site-content")
    .remove([filePath])

  if (error) {
    throw error
  }
}

export async function getContentProjects(): Promise<
  ContentProject[]
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
        is_visible,
        display_order,
        created_at,
        updated_at
      `
    )
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    throw error
  }

  return (data as ContentProjectRow[]).map(
    mapContentProject
  )
}

export async function createContentProject(
  input: CreateContentProjectInput
): Promise<ContentProject> {
  const { data, error } = await supabase
    .from("content_projects")
    .insert({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      category: input.category?.trim() || null,
      image_url: input.imageUrl,
      is_visible: input.isVisible ?? true,
      display_order: input.displayOrder ?? 0,
    })
    .select(
      `
        id,
        title,
        description,
        category,
        image_url,
        is_visible,
        display_order,
        created_at,
        updated_at
      `
    )
    .single()

  if (error) {
    throw error
  }

  return mapContentProject(data as ContentProjectRow)
}

export async function updateContentProject(
  id: string,
  input: UpdateContentProjectInput
): Promise<ContentProject> {
  const updates: {
    title?: string
    description?: string | null
    category?: string | null
    image_url?: string
    is_visible?: boolean
    display_order?: number
  } = {}

  if (input.title !== undefined) {
    updates.title = input.title.trim()
  }

  if (input.description !== undefined) {
    updates.description =
      input.description?.trim() || null
  }

  if (input.category !== undefined) {
    updates.category =
      input.category?.trim() || null
  }

  if (input.imageUrl !== undefined) {
    updates.image_url = input.imageUrl
  }

  if (input.isVisible !== undefined) {
    updates.is_visible = input.isVisible
  }

  if (input.displayOrder !== undefined) {
    updates.display_order = input.displayOrder
  }

  const { data, error } = await supabase
    .from("content_projects")
    .update(updates)
    .eq("id", id)
    .select(
      `
        id,
        title,
        description,
        category,
        image_url,
        is_visible,
        display_order,
        created_at,
        updated_at
      `
    )
    .single()

  if (error) {
    throw error
  }

  return mapContentProject(data as ContentProjectRow)
}

export async function deleteContentProject(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("content_projects")
    .delete()
    .eq("id", id)

  if (error) {
    throw error
  }
}
