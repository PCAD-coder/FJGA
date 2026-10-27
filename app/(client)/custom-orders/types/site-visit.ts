import type { DeliveryAddressInput } from "@/types/delivery-address"

export type SiteVisitTimeSlot = "morning" | "afternoon"

export interface CreateSiteVisitRequestInput {
  contactNumber: string
  preferredDate: string
  preferredTimeSlot: SiteVisitTimeSlot
  purpose: string
  clientNotes: string
  address: DeliveryAddressInput
}

export interface SiteVisitFeePreview {
  serviceFee: number
  travelFee: number
  totalFee: number
}

export type ClientSiteVisitStatus =
  | "pending"
  | "scheduled"
  | "completed"
  | "declined"
  | "cancelled"

export interface ClientSiteVisit {
  id: string
  visitNumber: string
  contactNumber: string
  status: ClientSiteVisitStatus
  preferredDate: string
  preferredTimeSlot: SiteVisitTimeSlot
  purpose: string
  clientNotes: string | null
  address: DeliveryAddressInput
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
  customRequestId: string | null
  customRequestNumber: string | null
}
