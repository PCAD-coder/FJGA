export const MATERIAL_CATEGORIES = [
  "Glass",
  "Aluminum",
  "Accessories",
] as const

export const MATERIAL_UNITS = [
  "Sheet",
  "Piece",
  "Meter",
  "Box",
] as const

export const MATERIAL_SPECIFICATIONS = {
  Glass: [
    "Clear",
    "Tempered",
    "Tinted",
    "Frosted",
    "Reflective",
    "Laminated",
    "Patterned",
  ],

  Aluminum: [
    "Mill Finish",
    "Anodized",
    "Powder Coated",
    "Wood Grain",
  ],

  Accessories: [
    "Handle",
    "Lock",
    "Hinge",
    "Roller",
    "Weather Strip",
    "Silicone",
    "Screw",
  ],
} as const