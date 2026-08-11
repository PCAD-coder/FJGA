import { createClient } from "@/lib/supabase/client"
import type { ServiceResult } from "./service-result"

export interface CalculationMethodOption {
  id: string
  method_code:
    | "fixed"
    | "width"
    | "height"
    | "depth"
    | "perimeter"
    | "area"
    | "volume"
  display_name: string
  description: string | null
}

export async function getActiveCalculationMethods(): Promise<
  ServiceResult<CalculationMethodOption[]>> {
    
  const supabase = createClient()

  const { data, error } = await supabase
    .from("calculation_methods")
    .select("id, method_code, display_name, description")
    .eq("is_active", true)
    .order("display_name")

  return {
    data: data ?? [],
    error: error?.message ?? null,
  }
}
