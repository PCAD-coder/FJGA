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