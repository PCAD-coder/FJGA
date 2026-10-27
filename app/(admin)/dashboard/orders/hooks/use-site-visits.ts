"use client"

import { useCallback, useEffect, useState } from "react"

import {
  completeSiteVisit,
  declineSiteVisit,
  getSiteVisits,
  scheduleSiteVisit,
} from "../services/site-visits"
import type { SiteVisit } from "../types/site-visit"

export function useSiteVisits() {
  const [visits, setVisits] = useState<SiteVisit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadVisits = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setVisits(await getSiteVisits())
    } catch (err: any) {
      console.error("Load Site Visits Error:", err)
      setError(err.message ?? "Failed to load on-site visits")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadVisits()
  }, [loadVisits])

  const schedule = async (id: string, scheduledAt: string, staff?: string) => {
    await scheduleSiteVisit(id, scheduledAt, staff)
    await loadVisits()
  }

  const decline = async (id: string, reason: string) => {
    await declineSiteVisit(id, reason)
    await loadVisits()
  }

  const complete = async (
    id: string,
    width: number,
    height: number,
    depth: number | null,
    notes?: string
  ) => {
    await completeSiteVisit(id, width, height, depth, notes)
    await loadVisits()
  }

  return { visits, loading, error, refresh: loadVisits, schedule, decline, complete }
}
