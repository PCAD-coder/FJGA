import { createClient } from "@/lib/supabase/client"

import type {
  HomepageContent,
  UpdateHomepageInput,
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

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
]

export function validateContentImage(file: File): void {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "Only JPG, PNG, and WebP images are allowed."
    )
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      "Image must be 5 MB or smaller."
    )
  }
}

export async function uploadHomepageImage(
  file: File
): Promise<string> {
  validateContentImage(file)

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg"

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

export async function deleteContentImage(
  imageUrl: string
): Promise<void> {
  const marker = `/storage/v1/object/public/${SITE_CONTENT_BUCKET}/`

  const markerIndex = imageUrl.indexOf(marker)

  if (markerIndex === -1) {
    return
  }

  const encodedPath = imageUrl.slice(
    markerIndex + marker.length
  )

  if (!encodedPath) {
    return
  }

  const filePath = decodeURIComponent(encodedPath)

  const { error } = await supabase.storage
    .from(SITE_CONTENT_BUCKET)
    .remove([filePath])

  if (error) {
    throw error
  }
}