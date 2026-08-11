"use client"

import { useEffect, useState } from "react"

import {
  getThicknessesByCategory,
  MaterialThickness,
} from "../services/thickness.service"

export function useThicknesses(
  category: string
) {
  const [thicknesses, setThicknesses] =
    useState<MaterialThickness[]>([])

  async function loadThicknesses() {
    if (!category) {
      setThicknesses([])
      return
    }

    const data =
      await getThicknessesByCategory(
        category
      )

    setThicknesses(data)
  }

  useEffect(() => {
    loadThicknesses()
  }, [category])

  return {
    thicknesses,
    refresh: loadThicknesses,
  }
}