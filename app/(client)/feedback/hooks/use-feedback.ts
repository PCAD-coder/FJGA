"use client"

import { useCallback, useEffect, useState } from "react"

import {
  getCustomerFeedbacks,
  getOrdersAwaitingFeedback,
} from "../services/feedback-service"

import type {
  Feedback,
  FeedbackOrder,
} from "../types/feedback"

export function useFeedback() {
  const [feedbacks, setFeedbacks] =
    useState<Feedback[]>([])

  const [orders, setOrders] =
    useState<FeedbackOrder[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const loadFeedback = useCallback(
    async () => {
      try {
        setLoading(true)
        setError(null)

        const [
          feedbackData,
          orderData,
        ] = await Promise.all([
          getCustomerFeedbacks(),
          getOrdersAwaitingFeedback(),
        ])

        setFeedbacks(feedbackData)
        setOrders(orderData)
      } catch (err) {
        console.error(
          "Failed to load feedback:",
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load feedback."
        )
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    loadFeedback()
  }, [loadFeedback])

  return {
    feedbacks,
    orders,
    loading,
    error,
    reload: loadFeedback,
  }
}