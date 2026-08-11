"use client"

import { useEffect, useState } from "react"

import {
  getInventoryMaterials,
  getLaborServices,
  type InventoryMaterialOption,
  type LaborServiceOption,
} from "../services/quotation-data"

export function useQuotationData() {
  const [materials, setMaterials] = useState<
    InventoryMaterialOption[]
  >([])

  const [laborServices, setLaborServices] =
    useState<LaborServiceOption[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [materialsData, laborData] =
          await Promise.all([
            getInventoryMaterials(),
            getLaborServices(),
          ])

        setMaterials(materialsData)
        setLaborServices(laborData)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return {
    materials,
    laborServices,
    loading,
  }
}