export const PRODUCT_CATEGORIES = [
  "Windows",
  "Doors",
  "Railings",
  "Partitions",
  "Cabinets",
  "Mirrors",
  "Furniture",
  "Shower Enclosures",
  "Storefronts",
  "Others",
] as const

export const HARDWARE_REQUIRED_CATEGORIES = [
  "Windows",
  "Doors",
  "Cabinets",
  "Shower Enclosures",
  "Storefronts",
] as const

export function categoryRequiresHardware(
  category: string
): boolean {
  return (
    HARDWARE_REQUIRED_CATEGORIES as readonly string[]
  ).includes(category)
}

export const GLASS_AND_ALUMINUM_REQUIRED_CATEGORIES = [
  "Windows",
  "Doors",
  "Cabinets",
  "Shower Enclosures",
  "Storefronts",
  "Furniture",
  "Railings",
  "Partitions",
] as const

export function categoryRequiresGlassAndAluminum(
  category: string
): boolean {
  return (
    GLASS_AND_ALUMINUM_REQUIRED_CATEGORIES as readonly string[]
  ).includes(category)
}

export function categoryRequiresGlass(
  category: string
): boolean {
  return category === "Mirrors"
}

export const PRODUCT_TYPES = [
  {
    value: "standard",
    label: "Standard Product",
  },
  {
    value: "custom",
    label: "Custom Product",
  },
] as const

export type ProductTypeValue =
  (typeof PRODUCT_TYPES)[number]["value"]
