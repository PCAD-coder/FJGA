"use client"

import { useInventory } from "../hooks/use-inventory"

import type { InventoryInsert, InventoryUpdate } from "../types/inventory"

import { InventoryKPIs } from "./cards/inventory-kpis"
import { InventoryTable } from "./table/inventory-table"
import { InventoryToolbar } from "./inventory-toolbar"

export default function InventoryModule() {
  const {
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
    archiveMaterial,
  } = useInventory()

  async function handleAddMaterial(
    form: InventoryInsert
  ) {
    await addMaterial({
      ...form,
      is_active: true,
    })
  }
  async function handleEditMaterial(
  id: string,
  form: InventoryUpdate
) {
  await editMaterial(id, form)
}
async function handleArchiveMaterial(
  id: string
) {
  await archiveMaterial(id)
}

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        Loading inventory...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Inventory Management
        </h1>

        <p className="text-muted-foreground">
          Monitor materials, stock levels, and pricing.
        </p>
      </div>

      <InventoryKPIs
        totalMaterials={totalMaterials}
        lowStockItems={lowStockItems}
        outOfStockItems={outOfStockItems}
      />

      <InventoryToolbar
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        glassCount={
          materials.filter(
            (m) => m.category === "Glass"
          ).length
        }
        aluminumCount={
          materials.filter(
            (m) => m.category === "Aluminum"
          ).length
        }
        lowStockCount={lowStockItems}
        onAddMaterial={handleAddMaterial}
      />

      <InventoryTable
        materials={filteredMaterials}
        onEditMaterial={handleEditMaterial}
        onArchiveMaterial={handleArchiveMaterial}
      />
    </div>
  )
}