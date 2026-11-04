export type SiteVisitStatus =
  | "pending"
  | "proposed"
  | "scheduled"
  | "completed"
  | "declined"
  | "cancelled"

export type SiteVisitTimeSlot = "morning" | "afternoon"

export type SiteVisitProposalStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "superseded"

export type SiteVisitProposalRole = "admin" | "client"

export interface SiteVisitScheduleProposal {
  id: string
  siteVisitRequestId: string
  proposedBy: string
  proposedByRole: SiteVisitProposalRole
  proposedDate: string
  proposedTimeSlot: SiteVisitTimeSlot
  proposedScheduledAt: string | null
  assignedStaff: string | null
  status: SiteVisitProposalStatus
  proposedAt: string
  respondedAt: string | null
  responseNotes: string | null
}

export interface SiteVisit {
  id: string
  visitNumber: string
  customerId: string
  clientName: string
  contactNumber: string
  status: SiteVisitStatus
  preferredDate: string
  preferredTimeSlot: SiteVisitTimeSlot
  purpose: string
  clientNotes: string | null
  houseBuildingNumber: string
  street: string
  buildingSubdivision: string | null
  unitFloor: string | null
  regionName: string
  provinceName: string | null
  cityName: string
  barangayName: string
  postalCode: string | null
  landmark: string | null
  serviceName: string
  serviceFee: number
  travelFee: number
  totalFee: number
  scheduledAt: string | null
  assignedStaff: string | null
  actualWidth: number | null
  actualHeight: number | null
  actualDepth: number | null
  dimensionUnit: string
  measurementNotes: string | null
  pendingProposal?: SiteVisitScheduleProposal | null
  declineReason: string | null
  createdAt: string
}
