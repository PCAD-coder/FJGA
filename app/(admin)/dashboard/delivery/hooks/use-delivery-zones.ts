"use client"

import { toast } from "sonner"

import { useCallback, useEffect, useState } from "react"

import {
  addCityToDeliveryZone,
  createDeliveryZone,
  getDeliveryZones,
  updateDeliveryZone,
  removeCityFromDeliveryZone,
  setDeliveryZoneActive,
} from "../services/delivery-zone-management"

import type {
  CreateDeliveryZoneInput,
  DeliveryZone,
  UpdateDeliveryZoneInput,
} from "../types/delivery-zone"

async function notifyZoneAction<T>(
  action: () => Promise<T>,
  message: string
): Promise<T> {
  try {
    const result = await action()
    toast.success(message)
    return result
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to save delivery zone changes."
    )
    throw error
  }
}

export function useDeliveryZones() {
  const [zones, setZones] = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [addingCity, setAddingCity] = useState(false)
  const [removingCity, setRemovingCity] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)

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

        const zoneId = await notifyZoneAction(
          () => createDeliveryZone(input),
          "Delivery zone created."
        )

        await loadZones()

        return zoneId
      } finally {
        setCreating(false)
      }
    },
    [loadZones]
  )

  const editZone = useCallback(
    async (zoneId: string, input: UpdateDeliveryZoneInput) => {
      try {
        setUpdating(true)
        setError(null)

        await notifyZoneAction(
          () => updateDeliveryZone(zoneId, input),
          "Delivery zone updated."
        )

        await loadZones()
      } finally {
        setUpdating(false)
      }
    },
    [loadZones]
  )
  const addCity = useCallback(
    async (zoneId: string, cityPsgcCode: string) => {
      try {
        setAddingCity(true)
        setError(null)

        const assignmentId = await notifyZoneAction(
          () => addCityToDeliveryZone(zoneId, cityPsgcCode),
          "City added to delivery zone."
        )

        await loadZones()

        return assignmentId
      } finally {
        setAddingCity(false)
      }
    },
    [loadZones]
  )

  const removeCity = useCallback(
    async (zoneId: string, cityPsgcCode: string) => {
      try {
        setRemovingCity(true)
        setError(null)

        await notifyZoneAction(
          () => removeCityFromDeliveryZone(zoneId, cityPsgcCode),
          "City removed from delivery zone."
        )

        await loadZones()
      } finally {
        setRemovingCity(false)
      }
    },
    [loadZones]
  )

  const changeZoneStatus = useCallback(
    async (zoneId: string, isActive: boolean) => {
      try {
        setChangingStatus(true)
        setError(null)

        await notifyZoneAction(
          () => setDeliveryZoneActive(zoneId, isActive),
          "Delivery zone status updated."
        )

        await loadZones()
      } finally {
        setChangingStatus(false)
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
    removingCity,
    changingStatus,
    error,
    reloadZones: loadZones,
    addZone,
    editZone,
    addCity,
    removeCity,
    changeZoneStatus,
  }
}
