import { createClient } from "@/lib/supabase/client"

import type { ServiceResult } from "./service-result"

const BUCKET_NAME = "products"

/**
 * Upload a product image
 */
export async function uploadProductImage(
  productId: string,
  file: File
): Promise<ServiceResult<string>> {
  const supabase = createClient()

  const fileExtension = file.name.split(".").pop()

  const fileName = `${crypto.randomUUID()}.${fileExtension}`

  const filePath = `${productId}/${fileName}`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file)

  if (error) {
    console.error("Storage upload error:", error)

    return {
      data: null,
      error: JSON.stringify(error),
    }
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

  return {
    data: data.publicUrl,
    error: null,
  }
}

/**
 * Delete a product image
 */
export async function deleteProductImageFromStorage(
  imageUrl: string
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()

  try {
    const url = new URL(imageUrl)

    const marker = `/storage/v1/object/public/${BUCKET_NAME}/`

    const index = url.pathname.indexOf(marker)

    if (index === -1) {
      return {
        data: null,
        error: "Invalid image URL.",
      }
    }

    const filePath = url.pathname.substring(index + marker.length)

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) {
      return {
        data: null,
        error: error.message,
      }
    }

    return {
      data: true,
      error: null,
    }
  } catch {
    return {
      data: null,
      error: "Invalid image URL.",
    }
  }
}
/**
 * Upload multiple product images
 */
export async function uploadProductImages(
  productId: string,
  files: File[]
): Promise<
  ServiceResult<
    {
      image_url: string
      display_order: number
    }[]
  >
> {
  const uploadedImages: {
    image_url: string
    display_order: number
  }[] = []

  for (let index = 0; index < files.length; index++) {
    const result = await uploadProductImage(productId, files[index])

    if (result.error || !result.data) {
      return {
        data: null,
        error: result.error ?? "Image upload failed.",
      }
    }

    uploadedImages.push({
      image_url: result.data,
      display_order: index + 1,
    })
  }

  return {
    data: uploadedImages,
    error: null,
  }
}
/**
 * Delete multiple product images from storage
 */
export async function deleteProductImagesFromStorage(
  imageUrls: string[]
): Promise<ServiceResult<boolean>> {
  const supabase = createClient()
  
  if (imageUrls.length === 0) {
  return {
    data: true,
    error: null,
  }
}

  try {
    const marker = `/storage/v1/object/public/${BUCKET_NAME}/`

    const filePaths = imageUrls.map((imageUrl) => {
      const url = new URL(imageUrl)

      const index = url.pathname.indexOf(marker)

      if (index === -1) {
        throw new Error("Invalid image URL.")
      }

      return url.pathname.substring(index + marker.length)
    })

    const { error } = await supabase.storage.from(BUCKET_NAME).remove(filePaths)

    if (error) {
      return {
        data: null,
        error: error.message,
      }
    }

    return {
      data: true,
      error: null,
    }
  } catch {
    return {
      data: null,
      error: "Failed to delete product images.",
    }
  }
}
