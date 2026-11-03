"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export function useExporterName() {
  const [name, setName] = useState<string | null>(null)
  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user)
        throw new Error("Unable to identify the exporting account.")
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, full_name")
        .eq("auth_user_id", user.id)
        .single()
      if (error) throw error
      const metadata = user.user_metadata
      const exporter =
        [profile?.first_name?.trim(), profile?.last_name?.trim()]
          .filter(Boolean)
          .join(" ") ||
        profile?.full_name?.trim() ||
        metadata?.full_name ||
        metadata?.name ||
        user.email
      if (!exporter)
        throw new Error("The exporting account has no name or email.")
      if (!cancelled) setName(exporter)
    }
    load().catch(() => {
      if (!cancelled)
        toast.error(
          "Unable to load the exporting account. Reload the page to try again."
        )
    })
    return () => {
      cancelled = true
    }
  }, [])
  return name
}
