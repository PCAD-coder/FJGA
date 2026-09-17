export type ProductionStage =
  | "Pending"
  | "Material Prep"
  | "Glass Cutting"
  | "Frame Fabrication"
  | "Assembly"
  | "Finishing"
  | "Quality Check"
  | "Ready for Delivery"

export interface ProductionProject {
  id: string

  orderNumber: string

  projectName: string
  clientName: string

  contactNumber: string | null
  paymentMethod: "cash_on_delivery" | "card" | "gcash" | null

  orderItemId:string

  deliveryAddress?: ProductionDeliveryAddress | null
  stage: ProductionStage
  assignedStaff: string

  progress: number

  estimatedCompletion: string

  imageUrl?: string
  dimensions?: string
}

export interface ProductionStageHistory {
  id: string

  stage: ProductionStage

  changedAt: string
  changedBy: string

  notes?: string
}
export interface ProductionDeliveryAddress {
  house_building_number: string
  street: string
  building_subdivision: string | null
  unit_floor: string | null

  region_name: string
  province_name: string | null
  city_name: string
  barangay_name: string

  postal_code: string | null
  landmark: string | null
}