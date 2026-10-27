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