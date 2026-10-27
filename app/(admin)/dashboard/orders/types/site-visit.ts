export type SiteVisitStatus =
  | "pending"
  | "scheduled"
  | "completed"
  | "declined"
  | "cancelled"

export type SiteVisitTimeSlot = "morning" | "afternoon"

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
  declineReason: string | null
  createdAt: string
}
