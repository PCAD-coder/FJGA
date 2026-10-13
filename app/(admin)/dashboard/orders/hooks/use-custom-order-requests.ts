"use client"

import {
  useCallback,
  useEffect,
  useState,
} from "react"

import {
  denyCustomOrderRequest,
  getCustomOrderRequests,
} from "../services/custom-order-requests"

import type { CustomOrder } from "../types/custom-order"

export function useCustomOrderRequests() {
  const [requests, setRequests] =
    useState<CustomOrder[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const loadRequests =
    useCallback(async () => {
      try {
        setLoading(true)
        setError(null)

        const data =
          await getCustomOrderRequests()

        setRequests(data)
      } catch (err: any) {
        console.error(
          "Load Custom Order Requests Error:",
          err
        )

        setError(
          err.message ??
            "Failed to load custom order requests"
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  const deny = async (
    requestId: string,
    reason: string
  ) => {
    await denyCustomOrderRequest(
      requestId,
      reason
    )

    await loadRequests()
  }

  return {
    requests,
    loading,
    error,

    refresh: loadRequests,
    deny,
  }
}