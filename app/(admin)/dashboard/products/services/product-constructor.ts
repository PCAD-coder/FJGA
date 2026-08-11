import {
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product-service"

import {
  getProductImages,
  addProductImages,
  deleteProductImage,
} from "./image-service"

import {
  getProductMaterials,
  addProductMaterials,
  deleteProductMaterials,
} from "./material-service"

import {
  getProductLabor,
  addProductLaborItems,
  deleteProductLaborItems,
} from "./labor-service"

import {
  uploadProductImages,
  deleteProductImagesFromStorage,
  deleteProductImageFromStorage,
} from "./product-storage"

import type {
  Product,
  ProductImageInsert,
  ProductInsert,
  ProductImage,
  ProductLaborInsert,
  ProductMaterialInsert,
  ProductWithDetails,
} from "../types/product"

import type { ServiceResult } from "./service-result"

import { getProductPricing } from "./product-pricing"

import {
  saveProductVariantMaterials,
  replaceProductVariantMaterials,
} from "./product-variant-material-link-service"

import type { ProductVariantMaterialSelections } from "./product-variant-material-service"

export interface BuildProductInput {
  product: ProductInsert

  images: File[]

  materials: {
    inventory_material_id: string
    quantity: number
    is_fixed: boolean
    calculation_method_id: string | null
  }[]

  labor: {
    pricing_service_id: string
    quantity: number
  }[]

  variants: ProductVariantMaterialSelections
}

export interface RebuildProductInput {
  productId: string

  product: ProductInsert

  newImages: File[]

  existingImages: ProductImage[]

  materials: {
    inventory_material_id: string
    quantity: number
    is_fixed: boolean
    calculation_method_id: string | null
  }[]

  labor: {
    pricing_service_id: string
    quantity: number
  }[]

  variants: ProductVariantMaterialSelections
}

async function buildProductWithDetails(
  product: Product
): Promise<ProductWithDetails> {
  const images = await getProductImages(product.id)

  const materials = await getProductMaterials(product.id)

  const labor = await getProductLabor(product.id)

  const pricing = await getProductPricing(product.id)

  return {
    ...product,

    images: images.data ?? [],

    materials: materials.data ?? [],

    labor: labor.data ?? [],
    pricing: pricing.data ?? {
      width: product.width ?? null,
      height: product.height ?? null,
      depth: product.depth ?? null,

      materialCost: 0,
      laborCost: 0,
      productionCost: 0,
      sellingPrice: 0,
      totalMarkup: 0,

      materialsSnapshot: [],
      laborSnapshot: [],
    },
  }
}
async function uploadAndSaveImages(
  productId: string,
  files: File[]
): Promise<
  ServiceResult<{
    uploadedImageUrls: string[]
  }>
> {
  if (files.length === 0) {
    return {
      data: {
        uploadedImageUrls: [],
      },
      error: null,
    }
  }

  const uploaded = await uploadProductImages(productId, files)

  if (uploaded.error || !uploaded.data) {
    return {
      data: null,
      error: uploaded.error ?? "Failed to upload product images.",
    }
  }

  const imageRecords: ProductImageInsert[] = uploaded.data.map((image) => ({
    product_id: productId,
    image_url: image.image_url,
    display_order: image.display_order,
  }))

  const inserted = await addProductImages(imageRecords)

  if (inserted.error) {
    await deleteProductImagesFromStorage(
      uploaded.data.map((image) => image.image_url)
    )

    return {
      data: null,
      error: inserted.error,
    }
  }

  return {
    data: {
      uploadedImageUrls: uploaded.data.map((image) => image.image_url),
    },
    error: null,
  }
}
async function saveMaterials(
  productId: string,
  materials: {
    inventory_material_id: string
    quantity: number
    is_fixed: boolean
    calculation_method_id: string | null
  }[]
): Promise<ServiceResult<boolean>> {
  if (materials.length === 0) {
    return {
      data: true,
      error: null,
    }
  }

  const materialRecords: ProductMaterialInsert[] = materials.map(
    (material) => ({
      product_id: productId,
      inventory_material_id: material.inventory_material_id,
      quantity: material.quantity,
      unit: null,
      is_fixed: material.is_fixed,
      calculation_method_id: material.calculation_method_id,
    })
  )

  const result = await addProductMaterials(materialRecords)

  if (result.error) {
    return {
      data: null,
      error: result.error,
    }
  }

  return {
    data: true,
    error: null,
  }
}
async function saveLabor(
  productId: string,
  labor: {
    pricing_service_id: string
    quantity: number
  }[]
): Promise<ServiceResult<boolean>> {
  if (labor.length === 0) {
    return {
      data: true,
      error: null,
    }
  }

  const laborRecords: ProductLaborInsert[] = labor.map((item) => ({
    product_id: productId,
    pricing_service_id: item.pricing_service_id,
    quantity: item.quantity,
  }))

  const result = await addProductLaborItems(laborRecords)

  if (result.error) {
    return {
      data: null,
      error: result.error,
    }
  }

  return {
    data: true,
    error: null,
  }
}
async function syncImages(
  productId: string,
  existingImages: ProductImage[],
  newImages: File[]
): Promise<ServiceResult<boolean>> {
  const currentImages = await getProductImages(productId)

  if (currentImages.error || !currentImages.data) {
    return {
      data: null,
      error: currentImages.error ?? "Failed to load product images.",
    }
  }

  const imagesToDelete = currentImages.data.filter(
    (image) => !existingImages.some((existing) => existing.id === image.id)
  )

  if (imagesToDelete.length > 0) {
    const storageResult = await deleteProductImagesFromStorage(
      imagesToDelete.map((image) => image.image_url)
    )

    if (storageResult.error) {
      return {
        data: null,
        error: storageResult.error,
      }
    }

    for (const image of imagesToDelete) {
      const result = await deleteProductImage(image.id)

      if (result.error) {
        return {
          data: null,
          error: result.error,
        }
      }
    }
  }
  for (const image of imagesToDelete) {
    const result = await deleteProductImage(image.id)

    if (result.error) {
      return {
        data: null,
        error: result.error,
      }
    }
  }

  if (newImages.length > 0) {
    const uploaded = await uploadAndSaveImages(productId, newImages)

    if (uploaded.error) {
      return {
        data: null,
        error: uploaded.error,
      }
    }
  }

  return {
    data: true,
    error: null,
  }
}
async function rollbackBuild(
  productId: string,
  uploadedImageUrls: string[]
): Promise<void> {
  // Delete uploaded files from Supabase Storage
  if (uploadedImageUrls.length > 0) {
    await deleteProductImagesFromStorage(uploadedImageUrls)
  }

  // Delete the product
  // Related tables are cleaned up by ON DELETE CASCADE
  await deleteProduct(productId)
}

export async function buildProduct(
  input: BuildProductInput
): Promise<ServiceResult<ProductWithDetails>> {
  // Step 1: Create product
  const createdProduct = await createProduct(input.product)

  if (createdProduct.error || !createdProduct.data) {
    return {
      data: null,
      error: createdProduct.error ?? "Failed to create product.",
    }
  }

  const product = createdProduct.data

  // Step 2: Upload images
  const imageResult = await uploadAndSaveImages(product.id, input.images)

  if (imageResult.error) {
    await rollbackBuild(product.id, [])

    return {
      data: null,
      error: imageResult.error,
    }
  }

  // Step 3: Save materials
  const materialResult = await saveMaterials(product.id, input.materials)

  if (materialResult.error) {
    await rollbackBuild(product.id, imageResult.data?.uploadedImageUrls ?? [])

    return {
      data: null,
      error: materialResult.error,
    }
  }

  // Step 4: Save labor
  const laborResult = await saveLabor(product.id, input.labor)

  if (laborResult.error) {
    await rollbackBuild(product.id, imageResult.data?.uploadedImageUrls ?? [])

    return {
      data: null,
      error: laborResult.error,
    }
  }
  const variantsResult = await saveProductVariantMaterials(
    product.id,
    input.variants
  )

  if (variantsResult.error) {
    await rollbackBuild(product.id, imageResult.data?.uploadedImageUrls ?? [])

    return {
      data: null,
      error: variantsResult.error,
    }
  }
  // Step 5: Return complete product
  const completedProduct = await buildProductWithDetails(product)

  return {
    data: completedProduct,
    error: null,
  }
}

export async function rebuildProduct(
  input: RebuildProductInput
): Promise<ServiceResult<ProductWithDetails>> {
  // Step 1: Update product
  const updated = await updateProduct(input.productId, input.product)

  if (updated.error || !updated.data) {
    return {
      data: null,
      error: updated.error ?? "Failed to update product.",
    }
  }

  const product = updated.data

  // Step 2: Replace materials
  const deletedMaterials = await deleteProductMaterials(product.id)

  if (deletedMaterials.error) {
    return {
      data: null,
      error: deletedMaterials.error,
    }
  }

  const materialResult = await saveMaterials(product.id, input.materials)

  if (materialResult.error) {
    return {
      data: null,
      error: materialResult.error,
    }
  }

  // Step 3: Replace labor
  const deletedLabor = await deleteProductLaborItems(product.id)

  if (deletedLabor.error) {
    return {
      data: null,
      error: deletedLabor.error,
    }
  }

  const laborResult = await saveLabor(product.id, input.labor)

  if (laborResult.error) {
    return {
      data: null,
      error: laborResult.error,
    }
  }
  const variantsResult = await replaceProductVariantMaterials(
    input.productId,
    input.variants
  )

  if (variantsResult.error) {
    return {
      data: null,
      error: variantsResult.error,
    }
  }

  // Step 4: Upload new images (if any)
  if (input.newImages.length > 0) {
    const imageResult = await syncImages(
      product.id,
      input.existingImages,
      input.newImages
    )

    if (imageResult.error) {
      return {
        data: null,
        error: imageResult.error,
      }
    }
  }

  // Step 5: Return updated product
  return {
    data: await buildProductWithDetails(product),
    error: null,
  }
}
