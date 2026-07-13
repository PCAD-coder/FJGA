export type ProductionStage =
  | "pending-fabrication"
  | "glass-cutting"
  | "assembly"
  | "quality-check"
  | "ready-for-delivery"
  | "on-hold"

export interface ProductionProject {
  id: number

  projectName: string

  clientName: string

  image?: string

  dimensions: string

  startDate: string

  estimatedCompletion: string

  currentStage: ProductionStage

  progress: number

  assignedStaff?: string

  notes?: string
}