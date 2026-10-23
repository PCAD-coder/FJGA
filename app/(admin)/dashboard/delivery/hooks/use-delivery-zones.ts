"use client"

import { useCallback, useEffect, useState } from "react"

import {
  addCityToDeliveryZone,
  createDeliveryZone,
  getDeliveryZones,
  updateDeliveryZone,
} from "../services/delivery-zone-management"

import type {
  CreateDeliveryZoneInput,
  DeliveryZone,
  UpdateDeliveryZoneInput,
} from "../types/delivery-zone"

export function useDeliveryZones() {
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [addingCity, setAddingCity] = useState(false)

  const loadZones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getDeliveryZones()

      setZones(data)
    } catch (error) {
      console.error("Failed to load delivery zones:", error)

      setError(
        error instanceof Error ? error.message : "Failed to load delivery zones"
      )
    } finally {
      setLoading(false)
    }
  }, [])

const addZone = useCallback(
  async (input: CreateDeliveryZoneInput) => {
    try {
      setCreating(true)
      setError(null)

      const zoneId = await createDeliveryZone(input)

      await loadZones()

      return zoneId
    } finally {
      setCreating(false)
    }
  },
  [loadZones]
)

const editZone = useCallback(
  async (
    zoneId: string,
    input: UpdateDeliveryZoneInput
  ) => {
    try {
      setUpdating(true)
      setError(null)

      await updateDeliveryZone(zoneId, input)

      await loadZones()
    } finally {
      setUpdating(false)
    }
  },
  [loadZones]
)
const addCity = useCallback(
  async (
    zoneId: string,
    cityPsgcCode: string
  ) => {
    try {
      setAddingCity(true)
      setError(null)

      const assignmentId =
        await addCityToDeliveryZone(
          zoneId,
          cityPsgcCode
        )

      await loadZones()

      return assignmentId
    } finally {
      setAddingCity(false)
    }
  },
  [loadZones]
)

  useEffect(() => {
    loadZones()
  }, [loadZones])

  return {
  zones,
  loading,
  creating,
  updating,
  addingCity,
  error,
  reloadZones: loadZones,
  addZone,
  editZone,
  addCity,
}
}
