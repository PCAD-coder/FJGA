import { createClient } from "@/lib/supabase/client"

import type { SiteVisit } from "../types/site-visit"
import { formatCustomerName } from "../utils/format-customer-name"

const supabase = createClient()

export async function getSiteVisits(): Promise<SiteVisit[]> {
  const { data, error } = await supabase
    .from("site_visit_requests")
    .select(`
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
    `)
    .order("created_at", { ascending: false })

  if (error) throw error

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
  notes?: string
) {
  const { error } = await supabase.rpc("complete_site_visit", {
    p_visit_id: visitId,
    p_actual_width: width,
    p_actual_height: height,
    p_actual_depth: depth,
    p_measurement_notes: notes?.trim() || null,
  })

  if (error) throw error
}
