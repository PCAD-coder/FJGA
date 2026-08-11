import { createClient } from "@/lib/supabase/client"

import type { ServiceResult } from "./service-result"

export interface LaborServiceOption {
  id: string
  service_name: string
  unit: string
  labor_cost: number
  markup_percentage: number | null
}

export async function getActiveServices(): Promise<
  ServiceResult<LaborServiceOption[]>
> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("labor_services")
    .select(`
      id,
      service_name,
      unit,
      labor_cost,
      markup_percentage
    `)
    .eq("is_active", true)
    .order("service_name")

  return {
    data: data ?? [],
    error: error?.message ?? null,
  }
}