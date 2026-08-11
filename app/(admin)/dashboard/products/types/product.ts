import type { ProductPricing } from "../services/product-pricing-core"
export type ProductType = "standard" | "custom"

export interface Product {
  id: string

  product_code: string
  product_name: string

  category: string
  description: string | null

  width: number | null
  height: number | null
  depth: number | null
  dimension_unit: string

  markup_percentage: number

  product_type: ProductType

  is_customizable: boolean
  is_active: boolean
  is_depth_customizable: boolean

  created_at: string
  updated_at: string
}
export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  display_order: number
  created_at: string
}
export interface ProductLabor {
  id: string
  product_id: string
  pricing_service_id: string
  quantity: number
}
export interface ProductMaterial {
  id: string
  product_id: string
  inventory_material_id: string
  quantity: number
  unit: string | null
  is_fixed: boolean
  calculation_method_id: string | null
}
export interface ProductWithDetails extends Product {
  images: ProductImage[]
  materials: ProductMaterial[]
  labor: ProductLabor[]
  pricing: ProductPricing
}

export interface CalculationMethod {
  id: string

  method_code:
    | "fixed"
    | "width"
    | "height"
    | "depth"
    | "perimeter"
    | "area"
    | "volume"

  display_name: string

  description: string | null

  is_active: boolean

  created_at: string
}
export type ProductInsert = Omit<
  Product,
  "id" | "created_at" | "updated_at" | "product_code"
> & {
  product_code?: string
}
export type ProductUpdate = Partial<ProductInsert>

export interface ProductFilters {
  search?: string
  category?: string
  is_active?: boolean
  product_type?: ProductType
}
export type ProductImageInsert = Omit<ProductImage, "id" | "created_at">

export type ProductImageUpdate = Partial<ProductImageInsert>

export type ProductMaterialInsert = Omit<ProductMaterial, "id">

export type ProductMaterialUpdate = Partial<ProductMaterialInsert>

export type ProductLaborInsert = Omit<ProductLabor, "id">

export type ProductLaborUpdate = Partial<ProductLaborInsert>
