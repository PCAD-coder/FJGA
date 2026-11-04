"use server"

import { requireAdmin } from "@/lib/auth/require-admin"
import { createClient } from "@/lib/supabase/server"
import { getErrorMessage } from "@/lib/error-message"
import type {
  OnSiteTransaction,
  OnSiteTransactionRow,
} from "../types/on-site-sales"
import { mapOnSiteTransaction } from "../utils/on-site-sales"

type Result =
  | { records: OnSiteTransaction[]; error: null }
  | { records: null; error: string }

export async function getOnSiteTransactions(): Promise<Result> {
  // Authorize every request, including direct calls to this server action.
  await requireAdmin()
  const supabase = await createClient()

  try {
    const records: OnSiteTransaction[] = []
    const batchSize = 1000
    // Fetch every page so summary cards do not stop at Supabase's default row cap.
    for (let offset = 0; ; offset += batchSize) {
      const { data, error } = await supabase
        .from("site_visit_requests")
        .select(
          `
          id, visit_number, service_name_snapshot, service_fee, travel_fee,
          total_fee, payment_status, payment_method, paid_at,
          payment_received_by, created_at,
          customer:profiles!customer_id (first_name, last_name, full_name)
        `
        )
        .order("created_at", { ascending: false, nullsFirst: false })
        .order("id", { ascending: false })
        .range(offset, offset + batchSize - 1)
        .returns<OnSiteTransactionRow[]>()

      if (error) throw error
      const rows = data ?? []
      records.push(...rows.map(mapOnSiteTransaction))
      if (rows.length < batchSize) break
    }
    return { records, error: null }
  } catch (error: unknown) {
    console.error("Load on-site sales:", error)
    return {
      records: null,
      error: getErrorMessage(
        error,
        "Unable to load on-site service transactions."
      ),
    }
  }
}
