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