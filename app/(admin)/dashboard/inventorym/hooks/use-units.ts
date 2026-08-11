"use client"

import { useEffect, useState } from "react"

import {
  getUnits,
  MaterialUnit,
} from "../services/unit.service"

export function useUnits() {
  const [units, setUnits] =
    useState<MaterialUnit[]>([])

  const [loading, setLoading] =
    useState(true)

  async function loadUnits() {
    try {
      setLoading(true)

      const data = await getUnits()

      setUnits(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUnits()
  }, [])

  return {
    units,
    loading,
    refresh: loadUnits,
  }
}