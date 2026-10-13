"use client"

import { useCallback, useEffect, useState } from "react"

import { getQuotations } from "../services/quotations"
import type { QuotationListItem } from "../types/custom-order"

export function useQuotations() {
  const [quotations, setQuotations] = useState<
    QuotationListItem[]
  >([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(
    null
  )

  const loadQuotations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getQuotations()

      setQuotations(data)
    } catch (error) {
      console.error(
        "Failed to load quotations:",
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load quotations."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadQuotations()
  }, [loadQuotations])

  return {
    quotations,
    loading,
    error,
    refresh: loadQuotations,
  }
}