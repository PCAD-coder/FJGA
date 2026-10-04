import { createClient } from "@/lib/supabase/client"

import type { ActivityLog } from "../types/activity-log"

interface ActivityLogRow {
  id: number
  user_id: string | null
  action: string
  module: string
  description: string | null
  severity: "info" | "warning" | "critical"
  created_at: string
  profiles:
    | {
        first_name: string | null
        last_name: string | null
        role: string
      }
    | null
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("activity_logs")
    .select(`
      id,
      user_id,
      action,
      module,
      description,
      severity,
      created_at,
      profiles (
        first_name,
        last_name,
        role
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching activity logs:", error)
    throw new Error(error.message)
  }

  return (data ?? []).map((log) => {
    const profile = Array.isArray(log.profiles)
      ? log.profiles[0]
      : log.profiles

    const fullName = profile
      ? [profile.first_name, profile.last_name]
          .filter(Boolean)
          .join(" ")
      : "Unknown User"

    return {
      id: log.id,
      userId: log.user_id,
      userName: fullName || "Unknown User",
      role: profile?.role ?? "Unknown",
      action: log.action,
      module: log.module,
      description: log.description,
      timestamp: log.created_at,
      severity: log.severity,
    }
  })
}
