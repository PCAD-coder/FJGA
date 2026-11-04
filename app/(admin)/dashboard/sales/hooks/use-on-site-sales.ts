"use client"

import { useCallback, useEffect, useState } from "react"
import { getErrorMessage } from "@/lib/error-message"
import { getOnSiteTransactions } from "../services/on-site-sales-service"
import type { OnSiteTransaction } from "../types/on-site-sales"

export function useOnSiteSales() {
  const [records, setRecords] = useState<OnSiteTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const refresh = useCallback(() => setAttempt((value) => value + 1), [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const result = await getOnSiteTransactions()
        if (cancelled) return
        if (result.error !== null) {
          setError(result.error)
        } else {
          setRecords(result.records)
        }
      } catch (error: unknown) {
        if (!cancelled)
          setError(
            getErrorMessage(
              error,
              "Unable to load on-site service transactions."
            )
          )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [attempt])

  return { records, loading, error, refresh }
}
