import "server-only"

import { adminSupabase } from "@/lib/supabase/admin"

export interface MaterialVariant {
  id: string
  material_name: string
  category: string
  specification: string | null
  color: string | null
  series: string | null
  thickness: string | null
  unit_cost: number
}

export interface ProductVariants {
  aluminum: MaterialVariant[]
  glass: MaterialVariant[]
  handles: MaterialVariant[]
  locks: MaterialVariant[]
  hinges: MaterialVariant[]
  rollers: MaterialVariant[]
}

interface VariantMaterialRow {
  id: string
  material_name: string
  category: string
  specification: string | null
  color: string | null
  series: string | null
  thickness: string | null
  unit_cost: number | string | null
  is_active: boolean
}

function toMaterialVariant(
  material: VariantMaterialRow
): MaterialVariant {
  return {
    id: material.id,
    material_name: material.material_name,
    category: material.category,
    specification: material.specification,
    color: material.color,
    series: material.series,
    thickness: material.thickness,
    unit_cost: Number(material.unit_cost ?? 0),
  }
}

export async function getProductMaterialVariants(
  productId: string
): Promise<ProductVariants> {
  const { data, error } = await adminSupabase
    .from("product_variant_materials")
    .select(
      `
      variant_group,
      inventory_materials (
        id,
        material_name,
        category,
        specification,
        color,
        series,
        thickness,
        unit_cost,
        is_active
      )
    `
    )
    .eq("product_id", productId)

  if (error || !data) {
    return {
      aluminum: [],
      glass: [],
      handles: [],
      locks: [],
      hinges: [],
      rollers: [],
    }
  }

  const materials = data
    .map((row) => {
      const material = Array.isArray(row.inventory_materials)
        ? row.inventory_materials[0]
        : row.inventory_materials

      if (!material || !material.is_active) {
        return null
      }

      return {
        variantGroup: row.variant_group,
        material: material as VariantMaterialRow,
      }
    })
    .filter(
      (
        item
      ): item is {
        variantGroup: string
        material: VariantMaterialRow
      } => item !== null
    )

  return {
    aluminum: materials
      .filter(
        (item) =>
          item.variantGroup === "frame_material" &&
          item.material.category === "Aluminum"
      )
      .map((item) => toMaterialVariant(item.material)),

    glass: materials
      .filter(
        (item) =>
          item.variantGroup === "glass_material" &&
          item.material.category === "Glass"
      )
      .map((item) => toMaterialVariant(item.material)),

    handles: materials
      .filter(
        (item) =>
          item.variantGroup === "handle" &&
          item.material.category === "Accessories" &&
          item.material.specification === "Handle"
      )
      .map((item) => toMaterialVariant(item.material)),

    locks: materials
      .filter(
        (item) =>
          item.variantGroup === "lock" &&
          item.material.category === "Accessories" &&
          item.material.specification === "Lock"
      )
      .map((item) => toMaterialVariant(item.material)),

    hinges: materials
      .filter(
        (item) =>
          item.variantGroup === "hinge" &&
          item.material.category === "Accessories" &&
          item.material.specification === "Hinge"
      )
      .map((item) => toMaterialVariant(item.material)),

    rollers: materials
      .filter(
        (item) =>
          item.variantGroup === "roller" &&
          item.material.category === "Accessories" &&
          item.material.specification === "Roller"
      )
      .map((item) => toMaterialVariant(item.material)),
  }
}