import { createClient } from "@/lib/supabase/client"

import type { SiteVisit, SiteVisitScheduleProposal } from "../types/site-visit"
import { formatCustomerName } from "../utils/format-customer-name"

const supabase = createClient()

export async function getSiteVisits(): Promise<SiteVisit[]> {
  const { data, error } = await supabase
    .from("site_visit_requests")
    .select(
      `
      id,
      visit_number,
      customer_id,
      contact_number,
      status,
      preferred_date,
      preferred_time_slot,
      purpose,
      client_notes,
      house_building_number,
      street,
      building_subdivision,
      unit_floor,
      region_name,
      province_name,
      city_name,
      barangay_name,
      postal_code,
      landmark,
      service_name_snapshot,
      service_fee,
      travel_fee,
      total_fee,
      scheduled_at,
      assigned_staff,
      actual_width,
      actual_height,
      actual_depth,
      dimension_unit,
      measurement_notes,
      decline_reason,
      created_at,
      profiles (
        first_name,
        last_name,
        full_name
      )
    `
    )
    .order("created_at", { ascending: false })

  if (error) throw error
const { data: proposalRows, error: proposalError } = await supabase
  .from("site_visit_schedule_proposals")
  .select(`
    id,
    site_visit_request_id,
    proposed_by,
    proposed_by_role,
    proposed_date,
    proposed_time_slot,
    proposed_scheduled_at,
    assigned_staff,
    status,
    proposed_at,
    responded_at,
    response_notes
  `)
  .eq("status", "pending")

  if (proposalError) throw proposalError

  const pendingProposals = new Map<string, SiteVisitScheduleProposal>()

for (const row of proposalRows ?? []) {
  if (
    row.proposed_by_role !== "admin" &&
    row.proposed_by_role !== "client"
  ) {
    throw new Error("Invalid site visit proposal owner role.")
  }

  pendingProposals.set(row.site_visit_request_id, {
    id: row.id,
    siteVisitRequestId: row.site_visit_request_id,
    proposedBy: row.proposed_by,
    proposedByRole: row.proposed_by_role,
      proposedDate: row.proposed_date,
      proposedTimeSlot: row.proposed_time_slot,
      proposedScheduledAt: row.proposed_scheduled_at ?? null,
      assignedStaff: row.assigned_staff ?? null,
      status: row.status as SiteVisitScheduleProposal["status"],
      proposedAt: row.proposed_at,
      respondedAt: row.responded_at ?? null,
      responseNotes: row.response_notes ?? null,
    })
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    visitNumber: row.visit_number,
    customerId: row.customer_id,
    clientName: formatCustomerName(row.profiles),
    contactNumber: row.contact_number,
    status: row.status,
    preferredDate: row.preferred_date,
    preferredTimeSlot: row.preferred_time_slot,
    purpose: row.purpose,
    clientNotes: row.client_notes ?? null,
    houseBuildingNumber: row.house_building_number,
    street: row.street,
    buildingSubdivision: row.building_subdivision ?? null,
    unitFloor: row.unit_floor ?? null,
    regionName: row.region_name,
    provinceName: row.province_name ?? null,
    cityName: row.city_name,
    barangayName: row.barangay_name,
    postalCode: row.postal_code ?? null,
    landmark: row.landmark ?? null,
    serviceName: row.service_name_snapshot,
    serviceFee: Number(row.service_fee ?? 0),
    travelFee: Number(row.travel_fee ?? 0),
    totalFee: Number(row.total_fee ?? 0),
    scheduledAt: row.scheduled_at ?? null,
    assignedStaff: row.assigned_staff ?? null,
    actualWidth: row.actual_width == null ? null : Number(row.actual_width),
    actualHeight: row.actual_height == null ? null : Number(row.actual_height),
    actualDepth: row.actual_depth == null ? null : Number(row.actual_depth),
    dimensionUnit: row.dimension_unit ?? "cm",
measurementNotes: row.measurement_notes ?? null,
declineReason: row.decline_reason ?? null,
createdAt: row.created_at,
pendingProposal: pendingProposals.get(row.id) ?? null,
  }))
}

export async function scheduleSiteVisit(
  visitId: string,
  scheduledAt: string,
  assignedStaff?: string
) {
  const { error } = await supabase.rpc("schedule_site_visit", {
    p_visit_id: visitId,
    p_scheduled_at: scheduledAt,
    p_assigned_staff: assignedStaff?.trim() || null,
  })

  if (error) throw error
}

export async function proposeSiteVisitSchedule(
  visitId: string,
  scheduledAt: string,
  assignedStaff: string
): Promise<void> {
  const trimmedStaff = assignedStaff.trim()

  if (!trimmedStaff) {
    throw new Error("Please select an assigned staff member.")
  }

  const { error } = await supabase.rpc("propose_site_visit_schedule", {
    p_visit_id: visitId,
    p_scheduled_at: scheduledAt,
    p_assigned_staff: trimmedStaff,
  })

  if (error) throw error
}

export async function acceptClientSiteVisitProposal(
  proposalId: string,
  scheduledAt: string,
  assignedStaff: string
): Promise<void> {
  const trimmedStaff = assignedStaff.trim()

  if (!trimmedStaff) {
    throw new Error("Please select an assigned staff member.")
  }

  const { error } = await supabase.rpc(
    "accept_client_site_visit_proposal",
    {
      p_proposal_id: proposalId,
      p_scheduled_at: scheduledAt,
      p_assigned_staff: trimmedStaff,
    }
  )

  if (error) throw error
}

export async function declineSiteVisit(visitId: string, reason: string) {
  const trimmedReason = reason.trim()
  if (!trimmedReason) throw new Error("A decline reason is required.")

  const { error } = await supabase.rpc("decline_site_visit", {
    p_visit_id: visitId,
    p_decline_reason: trimmedReason,
  })

  if (error) throw error
}

export async function completeSiteVisit(
  visitId: string,
  width: number,
  height: number,
  depth: number | null,
  notes: string,
  confirmCashPayment: boolean
): Promise<void> {
  const { error } = await supabase.rpc("complete_site_visit", {
    p_visit_id: visitId,
    p_actual_width: width,
    p_actual_height: height,
    p_actual_depth: depth,
    p_measurement_notes: notes.trim() || null,
    p_confirm_cash_payment: confirmCashPayment,
  })

  if (error) throw error
}
