"use client"

import { useEffect, useState } from "react"

import {
  getColorsByCategory,
  MaterialColor,
} from "../services/color.service"

export function useColors(
  category: string
) {
  const [colors, setColors] =
    useState<MaterialColor[]>([])

  const [loading, setLoading] =
    useState(false)

  async function loadColors() {
    if (
      category !== "Glass" &&
      category !== "Aluminum"
    ) {
      setColors([])
      return
    }

    try {
      setLoading(true)

      const data =
        await getColorsByCategory(
          category
        )

      setColors(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadColors()
  }, [category])

  return {
    colors,
    loading,
    refresh: loadColors,
  }
}