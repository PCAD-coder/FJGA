"use client"

import { getErrorMessage } from "@/lib/error-message"

import { toast } from "sonner"

import { useCallback, useEffect, useState } from "react"

import { createOrder, getOrders } from "../services/orders"
import type { CreateOrderInput, Order } from "../types/order"

import type { OrderStatus } from "../types/order"

import {
  approveOrder,
  denyOrder,
  saveOrderQuotation,
  updateOrderStatus,
  startOrderProduction,
} from "../services/orders"

async function notifyOrderAction<T>(
  action: () => Promise<T>,
  message: string
): Promise<T> {
  try {
    const result = await action()
    toast.success(message)
    return result
  } catch (error) {
    toast.error(
      getErrorMessage(error, "Unable to complete the order action.")
    )
    throw error
  }
}

export function useOrders() {
  const changeStatus = async (
    orderId: string,
    status: OrderStatus,
    options?: {
      assignedTo?: string
      estimatedCompletionDate?: string
    }
  ) => {
    await notifyOrderAction(
      () => updateOrderStatus(orderId, status, options),
      "Order status updated successfully."
    )
    await loadOrders()
  }

  const startProduction = async (
    orderId: string,
    options: {
      assignedTo: string
      estimatedCompletionDate: string
    }
  ) => {
    await notifyOrderAction(
      () =>
        startOrderProduction(
          orderId,
          options.assignedTo,
          options.estimatedCompletionDate
        ),
      "Production started successfully."
    )

    await loadOrders()
  }

  const approve = async (orderId: string) => {
    await notifyOrderAction(
      () => approveOrder(orderId),
      "Order approved successfully."
    )
    await loadOrders()
  }

  const deny = async (orderId: string, reason: string) => {
    await notifyOrderAction(() => denyOrder(orderId, reason), "Order denied.")
    await loadOrders()
  }

  const saveQuotation = async (
    orderId: string,
    quotation: Record<string, any>
  ) => {
    await notifyOrderAction(
      () => saveOrderQuotation(orderId, quotation),
      "Quotation saved successfully."
    )
    await loadOrders()
  }
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getOrders()

      setOrders(data ?? [])
    } catch (err: any) {
      console.error("Load Orders Error:", err)
      setError(err.message ?? "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const createNewOrder = async (input: CreateOrderInput) => {
    try {
      setError(null)

      const order = await createOrder(input)

      await loadOrders()

      toast.success("Order created successfully.")
      return order
    } catch (err: any) {
      toast.error(
        getErrorMessage(err, "Failed to create order.")
      )
      console.error("Create Order Error:", err)
      setError(err.message ?? "Failed to create order")
      throw err
    }
  }

  return {
    orders,
    loading,
    error,
    startProduction,

    refresh: loadOrders,

    createOrder: createNewOrder,

    changeStatus,
    approve,
    deny,
    saveQuotation,
  }
}
