import { createClient } from "@/lib/supabase/client"

import type {
  CreateSiteVisitRequestInput,
  SiteVisitFeePreview,
  ClientSiteVisit,
  ClientSiteVisitProposal,
} from "../types/site-visit"

const supabase = createClient()

export const ON_SITE_MEASUREMENT_SERVICE_ID =
  "13af05ab-717c-4977-a2d9-4c46c5ef2247"

export async function getSiteVisitFeePreview(
  cityPsgcCode: string,
  barangayPsgcCode: string
): Promise<SiteVisitFeePreview | null> {
  const trimmedCityPsgcCode = cityPsgcCode.trim()
  const trimmedBarangayPsgcCode = barangayPsgcCode.trim()

  if (!trimmedCityPsgcCode || !trimmedBarangayPsgcCode) {
    return null
  }

  const { data, error } = await supabase.rpc(
    "get_site_visit_fee",
    {
      p_city_psgc_code: trimmedCityPsgcCode,
      p_barangay_psgc_code: trimmedBarangayPsgcCode,
    }
  )

  if (error) {
    throw new Error(error.message)
  }

  const result = Array.isArray(data) ? data[0] : data

  if (!result) {
    return null
  }

  return {
    serviceFee: Number(result.service_fee),
    travelFee: Number(result.travel_fee),
    totalFee: Number(result.total_fee),
  }
}

export async function createSiteVisitRequest(
  input: CreateSiteVisitRequestInput
): Promise<string> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    throw new Error(authError.message)
  }

  if (!user) {
    throw new Error("Authentication required.")
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("auth_user_id", user.id)
    .single()

  if (profileError || !profile) {
    throw new Error(profileError?.message || "Customer profile not found.")
  }

  if (profile.role !== "client") {
    throw new Error("Only clients can request an on-site visit.")
  }

  const { address } = input

  if (!/^09[0-9]{9}$/.test(input.contactNumber)) {
    throw new Error("Contact number must start with 09 and contain exactly 11 digits.")
  }

  if (!input.preferredDate) {
    throw new Error("Preferred visit date is required.")
  }

  if (!address.houseBuildingNumber.trim()) {
    throw new Error("House or building number is required.")
  }

  if (!address.street.trim()) {
    throw new Error("Street is required.")
  }

  if (!address.regionPsgcCode) {
    throw new Error("Region is required.")
  }

  if (!address.cityPsgcCode) {
    throw new Error("City or municipality is required.")
  }

  if (!address.barangayPsgcCode) {
    throw new Error("Barangay is required.")
  }

  const { data: visitId, error: visitError } = await supabase.rpc(
    "create_site_visit_request",
    {
      p_customer_id: profile.id,
      p_contact_number: input.contactNumber.trim(),
      p_labor_service_id: ON_SITE_MEASUREMENT_SERVICE_ID,
      p_preferred_date: input.preferredDate,
      p_preferred_time_slot: input.preferredTimeSlot,
      p_purpose: input.purpose.trim() || "measurement",
      p_client_notes: input.clientNotes.trim() || null,

      p_address: {
        house_building_number: address.houseBuildingNumber.trim(),
        street: address.street.trim(),

        building_subdivision:
          address.buildingSubdivision.trim() || null,

        unit_floor: address.unitFloor.trim() || null,

        region_psgc_code: address.regionPsgcCode,
        region_name: address.regionName,

        province_psgc_code: address.provincePsgcCode,
        province_name: address.provinceName,

        city_psgc_code: address.cityPsgcCode,
        city_name: address.cityName,

        barangay_psgc_code: address.barangayPsgcCode,
        barangay_name: address.barangayName,

        postal_code: address.postalCode.trim() || null,
        landmark: address.landmark.trim() || null,
      },
    }
  )

  if (visitError) {
    throw new Error(visitError.message)
  }

  if (!visitId) {
    throw new Error("Failed to create the on-site visit request.")
  }

  return visitId as string
}

export async function getClientSiteVisits(): Promise<ClientSiteVisit[]> {
  const { data: visits, error: visitsError } = await supabase
    .from("site_visit_requests")
    .select("*")
    .order("created_at", { ascending: false })

  if (visitsError) {
    throw new Error(visitsError.message)
  }

  if (!visits || visits.length === 0) {
    return []
  }

  const visitIds = visits.map((visit) => visit.id)

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
  .in("site_visit_request_id", visitIds)
  .eq("status", "pending")

if (proposalError) {
  throw new Error(proposalError.message)
}

const pendingProposals = new Map<string, ClientSiteVisitProposal>()

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
    status: row.status as ClientSiteVisitProposal["status"],
    proposedAt: row.proposed_at,
    respondedAt: row.responded_at ?? null,
    responseNotes: row.response_notes ?? null,
  })
}

  const { data: linkedRequests, error: linkedError } = await supabase
    .from("custom_order_requests")
    .select("id, request_number, site_visit_request_id")
    .in("site_visit_request_id", visitIds)

  if (linkedError) {
    throw new Error(linkedError.message)
  }

  const requestByVisitId = new Map(
    (linkedRequests ?? []).map((request) => [
      request.site_visit_request_id as string,
      request,
    ])
  )

  return visits.map((visit) => {
    const linkedRequest = requestByVisitId.get(visit.id)

    return {
      id: visit.id,
      visitNumber: visit.visit_number,
      contactNumber: visit.contact_number,
      status: visit.status,
      preferredDate: visit.preferred_date,
      preferredTimeSlot: visit.preferred_time_slot,
      purpose: visit.purpose,
      clientNotes: visit.client_notes,
      address: {
        houseBuildingNumber: visit.house_building_number,
        street: visit.street,
        buildingSubdivision: visit.building_subdivision ?? "",
        unitFloor: visit.unit_floor ?? "",
        regionPsgcCode: visit.region_psgc_code,
        regionName: visit.region_name,
        provincePsgcCode: visit.province_psgc_code,
        provinceName: visit.province_name,
        cityPsgcCode: visit.city_psgc_code,
        cityName: visit.city_name,
        barangayPsgcCode: visit.barangay_psgc_code,
        barangayName: visit.barangay_name,
        postalCode: visit.postal_code ?? "",
        landmark: visit.landmark ?? "",
      },
      serviceName: visit.service_name_snapshot,
      serviceFee: Number(visit.service_fee),
      travelFee: Number(visit.travel_fee),
      totalFee: Number(visit.total_fee),
      paymentStatus: visit.payment_status as "unpaid" | "paid",
paymentMethod: visit.payment_method ?? null,
paidAt: visit.paid_at ?? null,
paymentReceivedBy: visit.payment_received_by ?? null,
      scheduledAt: visit.scheduled_at,
      assignedStaff: visit.assigned_staff,
      pendingProposal: pendingProposals.get(visit.id) ?? null,
      actualWidth:
        visit.actual_width == null ? null : Number(visit.actual_width),
      actualHeight:
        visit.actual_height == null ? null : Number(visit.actual_height),
      actualDepth:
        visit.actual_depth == null ? null : Number(visit.actual_depth),
      dimensionUnit: visit.dimension_unit ?? "cm",
      measurementNotes: visit.measurement_notes,
      declineReason: visit.decline_reason,
      createdAt: visit.created_at,
      customRequestId: linkedRequest?.id ?? null,
      customRequestNumber: linkedRequest?.request_number ?? null,
    } satisfies ClientSiteVisit
  })
}
export async function acceptSiteVisitScheduleProposal(
  proposalId: string
): Promise<void> {
  if (!proposalId.trim()) {
    throw new Error("Schedule proposal ID is required.")
  }

  const { error } = await supabase.rpc(
    "accept_site_visit_proposal",
    {
      p_proposal_id: proposalId,
    }
  )

  if (error) {
    throw new Error(error.message)
  }
}
export async function requestSiteVisitReschedule(
  proposalId: string,
  preferredDate: string,
  preferredTimeSlot: "morning" | "afternoon",
  notes?: string
): Promise<void> {
  if (!proposalId.trim()) {
    throw new Error("Schedule proposal ID is required.")
  }

  if (!preferredDate) {
    throw new Error("Please select your preferred date.")
  }

  if (
    preferredTimeSlot !== "morning" &&
    preferredTimeSlot !== "afternoon"
  ) {
    throw new Error("Please select a valid time slot.")
  }

  const { error } = await supabase.rpc(
    "request_site_visit_reschedule",
    {
      p_proposal_id: proposalId,
      p_preferred_date: preferredDate,
      p_preferred_time_slot: preferredTimeSlot,
      p_notes: notes?.trim() || null,
    }
  )

  if (error) {
    throw new Error(error.message)
  }
}
