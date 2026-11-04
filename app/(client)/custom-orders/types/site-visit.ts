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
  | "proposed"
  | "scheduled"
  | "completed"
  | "declined"
  | "cancelled"

export type SiteVisitProposalStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "superseded"

export type SiteVisitProposalRole = "admin" | "client"

export interface ClientSiteVisitProposal {
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
  pendingProposal: ClientSiteVisitProposal | null
  actualWidth: number | null
  actualHeight: number | null
  actualDepth: number | null
  dimensionUnit: string
  measurementNotes: string | null
  declineReason: string | null
  createdAt: string
  customRequestId: string | null
  customRequestNumber: string | null

  paymentStatus: "unpaid" | "paid"
  paymentMethod: string | null
  paidAt: string | null
  paymentReceivedBy: string | null
}
