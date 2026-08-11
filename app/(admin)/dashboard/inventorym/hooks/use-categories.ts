"use client"

import { useEffect, useState } from "react"

import {
  getCategories,
  getColorCategories,
  MaterialCategory,
} from "../services/category.service"

export function useCategories() {
  const [categories, setCategories] =
    useState<MaterialCategory[]>([])
    const [colorCategories, setColorCategories] =
  useState<MaterialCategory[]>([])

  const [loading, setLoading] =
    useState(true)

  async function loadCategories() {
  try {
    setLoading(true)

    const [allCategories, colorEnabled] =
      await Promise.all([
        getCategories(),
        getColorCategories(),
      ])

    setCategories(allCategories)

    setColorCategories(colorEnabled)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    loadCategories()
  }, [])

  return {
    categories,
    colorCategories,
    loading,
    refresh: loadCategories,
    
  }
}