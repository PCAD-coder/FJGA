import { createClient } from "@/lib/supabase/client"

export type ActivityLogSeverity =
  | "info"
  | "warning"
  | "critical"

interface LogActivityInput {
  action: string
  module: string
  description?: string | null
  severity?: ActivityLogSeverity
}

export async function logActivity({
  action,
  module,
  description = null,
  severity = "info",
}: LogActivityInput): Promise<number | null> {
  const supabase = createClient()

  const { data, error } = await supabase.rpc("log_activity", {
    p_action: action,
    p_module: module,
    p_description: description,
    p_severity: severity,
  })

  if (error) {
    console.error("Error creating activity log:", error)
    return null
  }

  return data
}