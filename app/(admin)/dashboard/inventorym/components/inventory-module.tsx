"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import InventorySkeleton from "./inventory-skeleton"

import { useInventory } from "../hooks/use-inventory"

import type { InventoryInsert, InventoryUpdate } from "../types/inventory"

import { InventoryKPIs } from "./cards/inventory-kpis"
import { InventoryTable } from "./table/inventory-table"
import { InventoryToolbar } from "./inventory-toolbar"

const PAGE_SIZE = 10

export default function InventoryModule() {
  const [page, setPage] = useState(1)
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
    restockInventoryMaterial,
    initializeMaterialExpirationStock,
    enableMaterialExpirationTracking,
    disposeExpiredInventoryBatch,
    expiringSoonItems,
    stockStatusFilter,
    setStockStatusFilter,
    expirationStatusFilter,
    setExpirationStatusFilter,
  } = useInventory()

  async function handleAddMaterial(form: InventoryInsert) {
    await addMaterial({
      ...form,
      is_active: true,
    })
  }
  async function handleEditMaterial(id: string, form: InventoryUpdate) {
    await editMaterial(id, form)
  }
  async function handleArchiveMaterial(id: string) {
    await archiveMaterial(id)
  }

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMaterials.length / PAGE_SIZE)
  )
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paginatedMaterials = filteredMaterials.slice(
    startIndex,
    startIndex + PAGE_SIZE
  )

  if (loading) {
    return <InventorySkeleton />
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <div className="border-b border-border/70 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Inventory Management
        </h1>

        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Monitor materials, stock levels, and pricing.
        </p>
      </div>

      <InventoryKPIs
        totalMaterials={totalMaterials}
        lowStockItems={lowStockItems}
        outOfStockItems={outOfStockItems}
        expiringSoonItems={expiringSoonItems}
      />

      <InventoryToolbar
        search={search}
        setSearch={(value) => {
          setSearch(value)
          setPage(1)
        }}
        categoryFilter={categoryFilter}
        setCategoryFilter={(value) => {
          setCategoryFilter(value)
          setPage(1)
        }}
        stockStatusFilter={stockStatusFilter}
        setStockStatusFilter={(value) => {
          setStockStatusFilter(value)
          setPage(1)
        }}
        expirationStatusFilter={expirationStatusFilter}
        setExpirationStatusFilter={(value) => {
          setExpirationStatusFilter(value)
          setPage(1)
        }}
        materials={filteredMaterials}
        glassCount={materials.filter((m) => m.category === "Glass").length}
        aluminumCount={
          materials.filter((m) => m.category === "Aluminum").length
        }
        lowStockCount={lowStockItems}
        onAddMaterial={handleAddMaterial}
      />

      <InventoryTable
        materials={paginatedMaterials}
        onEditMaterial={editMaterial}
        onArchiveMaterial={archiveMaterial}
        onRestock={restockInventoryMaterial}
        onInitializeExpirationStock={initializeMaterialExpirationStock}
        onEnableExpirationTracking={enableMaterialExpirationTracking}
        onDisposeExpiredBatch={disposeExpiredInventoryBatch}
      />
      {filteredMaterials.length > 0 && (
        <nav
          aria-label="Inventory pagination"
          className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + PAGE_SIZE, filteredMaterials.length)} of{" "}
            {filteredMaterials.length} materials
          </p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </nav>
      )}
    </div>
  )
}
