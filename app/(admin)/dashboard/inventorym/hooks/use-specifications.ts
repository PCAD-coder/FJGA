"use client"

import { useEffect, useState } from "react"

import {
  getSpecificationsByCategory,
  MaterialSpecification,
} from "../services/specification.service"

export function useSpecifications(
  category: string
) {
  const [specifications, setSpecifications] =
    useState<MaterialSpecification[]>([])

  const [loading, setLoading] =
    useState(false)

  async function loadSpecifications() {
    if (!category) {
      setSpecifications([])
      return
    }

    try {
      setLoading(true)

      const data =
        await getSpecificationsByCategory(
          category
        )

      setSpecifications(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSpecifications()
  }, [category])

  return {
    specifications,
    loading,
    refresh: loadSpecifications,
  }
}