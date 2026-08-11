"use client"

import { useCallback, useEffect, useState } from "react"

import { createOrder, getOrders } from "../services/orders"
import type { CreateOrderInput, Order } from "../types/order"

import type { OrderStatus } from "../types/order"

import {
  approveOrder,
  denyOrder,
  saveOrderQuotation,
  updateOrderStatus,
} from "../services/orders"

export function useOrders() {
const changeStatus = async (
  orderId: string,
  status: OrderStatus,
  options?: {
    assignedTo?: string
    estimatedCompletionDate?: string
  }
) => {
  await updateOrderStatus(orderId, status, options)
  await loadOrders()
  }

  const approve = async (orderId: string) => {
    await approveOrder(orderId)
    await loadOrders()
  }

  const deny = async (orderId: string, reason: string) => {
    await denyOrder(orderId, reason)
    await loadOrders()
  }

  const saveQuotation = async (
    orderId: string,
    quotation: Record<string, any>
  ) => {
    await saveOrderQuotation(orderId, quotation)
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

      return order
    } catch (err: any) {
      console.error("Create Order Error:", err)
      setError(err.message ?? "Failed to create order")
      throw err
    }
  }

  return {
    orders,
    loading,
    error,

    refresh: loadOrders,

    createOrder: createNewOrder,

    changeStatus,
    approve,
    deny,
    saveQuotation,
  }
}