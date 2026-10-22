"use client"

import { useEffect, useMemo, useState } from "react"

import {
  createMaterial,
  getMaterials,
  updateMaterial,
  archiveMaterial,
  restockMaterial,
  initializeExpirationStock,
  enableExpirationTracking,
  disposeExpiredBatch,
  type InitializeExpirationStockInput,
  type EnableExpirationTrackingInput,
  type DisposeExpiredBatchInput,
} from "../services/inventory.service"

import {
  InventoryInsert,
  InventoryMaterial,
  InventoryUpdate,
} from "../types/inventory"
import { toast } from "sonner"

export function useInventory() {
  const [materials, setMaterials] = useState<InventoryMaterial[]>([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")

  const [categoryFilter, setCategoryFilter] = useState("all")

  async function loadMaterials() {
    try {
      setLoading(true)

      const data = await getMaterials()

      setMaterials(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMaterials()
  }, [])

  async function addMaterial(material: InventoryInsert) {
    await createMaterial(material)

    await loadMaterials()
  }

  async function editMaterial(id: string, material: InventoryUpdate) {
    await updateMaterial(id, material)

    await loadMaterials()
  }
  async function archiveInventoryMaterial(id: string) {
    await archiveMaterial(id)

    await loadMaterials()
  }
  async function restockInventoryMaterial(input: {
  materialId: string
  quantity: number
  notes?: string
  batchNumber?: string
  receivedAt?: string
  expirationDate?: string
}) {
  try {
    setLoading(true)

    const result = await restockMaterial(input)

    await loadMaterials()

    return result
  } finally {
    setLoading(false)
  }
}

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch = material.material_name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory =
        categoryFilter === "all"
          ? true
          : categoryFilter === "low-stock"
            ? material.stock_quantity <= material.minimum_stock
            : material.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [materials, search, categoryFilter])

  const totalMaterials = materials.length

  const lowStockItems = materials.filter(
    (material) =>
      material.stock_quantity <= material.minimum_stock &&
      material.stock_quantity > 0
  ).length

  const outOfStockItems = materials.filter(
    (material) => material.stock_quantity === 0
  ).length

  const expiringSoonItems = materials.filter(
  (material) =>
    material.tracks_expiration &&
    material.expiring_soon_quantity > 0
).length

  const initializeMaterialExpirationStock = async (
  input: InitializeExpirationStockInput
) => {
  try {
    const result = await initializeExpirationStock(input)

    await loadMaterials()

    toast.success(
      `${result.initialized_quantity} existing units were initialized for expiration tracking.`
    )

    return result
  } catch (error) {
    console.error("Failed to initialize expiration stock:", error)

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to initialize expiration stock."
    )

    throw error
  }
}

const enableMaterialExpirationTracking = async (
  input: EnableExpirationTrackingInput
) => {
  try {
    setLoading(true)

    const result = await enableExpirationTracking(input)

    await loadMaterials()

    if (result.initialized_quantity > 0) {
      toast.success(
        `Expiration tracking enabled. ${result.initialized_quantity} existing units were initialized into an expiration batch.`
      )
    } else {
      toast.success("Expiration tracking enabled.")
    }

    return result
  } catch (error) {
    console.error("Failed to enable expiration tracking:", error)

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to enable expiration tracking."
    )

    throw error
  } finally {
    setLoading(false)
  }
}
const disposeExpiredInventoryBatch = async (
  input: DisposeExpiredBatchInput
) => {
  try {
    setLoading(true)

    const result = await disposeExpiredBatch(input)

    await loadMaterials()

    toast.success(
      `${result.quantity_disposed} expired units were disposed. Stock changed from ${result.stock_before} to ${result.stock_after}.`
    )

    return result
  } catch (error) {
    console.error("Failed to dispose expired inventory:", error)

    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to dispose expired inventory."
    )

    throw error
  } finally {
    setLoading(false)
  }
}

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
    restockInventoryMaterial,
    initializeMaterialExpirationStock,
    enableMaterialExpirationTracking,
    disposeExpiredInventoryBatch,
    expiringSoonItems,
  }
}
