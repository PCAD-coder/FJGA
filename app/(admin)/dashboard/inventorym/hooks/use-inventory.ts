"use client"

import { useEffect, useMemo, useState } from "react"

import {
  createMaterial,
  getMaterials,
  updateMaterial,
  archiveMaterial,
} from "../services/inventory.service"

import {
  InventoryInsert,
  InventoryMaterial,
  InventoryUpdate,
} from "../types/inventory"


export function useInventory() {
  const [materials, setMaterials] =
    useState<InventoryMaterial[]>([])

  const [loading, setLoading] =
    useState(true)

  const [search, setSearch] =
    useState("")

  const [categoryFilter, setCategoryFilter] =
    useState("all")

  async function loadMaterials() {
    try {
      setLoading(true)

      const data =
        await getMaterials()

      setMaterials(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMaterials()
  }, [])

  async function addMaterial(
    material: InventoryInsert
  ) {
    await createMaterial(material)

    await loadMaterials()
  }

  async function editMaterial(
  id: string,
  material: InventoryUpdate
) {
  await updateMaterial(id, material)

  await loadMaterials()
}
async function archiveInventoryMaterial(
  id: string
) {
  await archiveMaterial(id)

  await loadMaterials()
}

  const filteredMaterials =
    useMemo(() => {
      return materials.filter(
        (material) => {
          const matchesSearch =
            material.material_name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              )

          const matchesCategory =
            categoryFilter === "all"
              ? true
              : categoryFilter ===
                "low-stock"
              ? material.stock_quantity <=
                material.minimum_stock
              : material.category ===
                categoryFilter

          return (
            matchesSearch &&
            matchesCategory
          )
        }
      )
    }, [
      materials,
      search,
      categoryFilter,
    ])

const totalMaterials =
  materials.length

  const lowStockItems =
    materials.filter(
      (material) =>
        material.stock_quantity <=
          material.minimum_stock &&
        material.stock_quantity > 0
    ).length

const outOfStockItems =
  materials.filter(
    (material) =>
      material.stock_quantity === 0
  ).length

  return {
    loading,

    materials,

    filteredMaterials,

    search,

    setSearch,

    categoryFilter,

    setCategoryFilter,

    totalMaterials,

    lowStockItems,

    outOfStockItems,

    addMaterial,
    editMaterial,
    archiveMaterial: archiveInventoryMaterial,

    refresh: loadMaterials,
  }
}