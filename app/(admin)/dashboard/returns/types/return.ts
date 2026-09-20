export interface ReturnRequest {
  id: string

  orderNumber: string

  title: string

  clientName: string

  productType: string

  image: string

  issueDescription: string

  originalAmount: number

  reportedDate: string


  status:
    | "under-review"
    | "inspection-scheduled"
    | "approved"
    | "declined"
    | "resolved"

  declineReason?: string

  archived?: boolean
    
  inspectionId?: string | null
  inspection?: ReturnInspectionDetails | null
resolution?: ReturnResolutionDetails | null
}
export type ReturnResolutionType =
  | "repair"
  | "replacement"
  | "no_action"

export type ReturnResolutionStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled"

export interface ReturnResolution {
  id: string
  returnRequestId: string
  inspectionId: string
  resolutionType: ReturnResolutionType
  resolutionStatus: ReturnResolutionStatus
  resolutionNotes: string
  createdBy: string
  createdAt: string
  updatedAt: string
  completedAt?: string | null
}
export interface ReturnInspectionDetails {
  id: string
  status: "scheduled" | "completed" | "cancelled"
  inspectionDate: string | null
  inspectionTime: string | null
  assignedStaff: string | null
  inspectionNotes: string | null
  inspectionResult:
    | "damage_confirmed"
    | "no_issue"
    | "not_covered"
    | null
  damageConfirmed: boolean | null
  damageDescription: string | null
  resolutionType: "repair" | "replacement" | "no_action" | null
  resolutionNotes: string | null
  completedAt: string | null
}

export interface ReturnResolutionItem {
  id: string
  itemType: "material" | "labor"
  inventoryMaterialId: string | null
  laborServiceId: string | null
  materialName: string | null
  laborServiceName: string | null
  quantity: number
  width: number | null
  height: number | null
  depth: number | null
  dimensionUnit: string | null
  notes: string | null
}

export interface ReturnResolutionDetails {
  id: string
  resolutionType: "repair" | "replacement" | "no_action"
  resolutionStatus:
    | "pending"
    | "in_progress"
    | "completed"
    | "cancelled"
  resolutionNotes: string | null
  createdAt: string
  completedAt: string | null
  items: ReturnResolutionItem[]
}