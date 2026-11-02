"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import InventorySkeleton from "./inventory-skeleton"

import { useInventory } from "../hooks/use-inventory"

import type {
  InventoryInsert,
  InventoryMaterial,
} from "../types/inventory"

import { InventoryKPIs } from "./cards/inventory-kpis"
import { InventoryTable } from "./table/inventory-table"
import { InventoryToolbar } from "./inventory-toolbar"
import { RestoreMaterialDialog } from "./dialogs/restore-material-dialog"

const PAGE_SIZE = 10

export default function InventoryModule() {
  const [page, setPage] = useState(1)

  const [restoreMaterialTarget, setRestoreMaterialTarget] =
    useState<InventoryMaterial | null>(null)

  const [restoreSaving, setRestoreSaving] = useState(false)
  const {
    loading,
    materials,
    filteredMaterials,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    materialStatusFilter,
    setMaterialStatusFilter,
    totalMaterials,
    lowStockItems,
    outOfStockItems,
    addMaterial,
    editMaterial,
    archiveMaterial,
    restoreMaterial,
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
        materialStatusFilter={materialStatusFilter}
        setMaterialStatusFilter={(value) => {
          setMaterialStatusFilter(value)
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
        glassCount={
          materials.filter(
            (material) =>
              material.category === "Glass" &&
              (materialStatusFilter === "active"
                ? material.is_active
                : !material.is_active)
          ).length
        }
        aluminumCount={
          materials.filter(
            (material) =>
              material.category === "Aluminum" &&
              (materialStatusFilter === "active"
                ? material.is_active
                : !material.is_active)
          ).length
        }
        lowStockCount={
          materials.filter(
            (material) =>
              (materialStatusFilter === "active"
                ? material.is_active
                : !material.is_active) &&
              material.stock_quantity <= material.minimum_stock
          ).length
        }
        onAddMaterial={handleAddMaterial}
      />

      <InventoryTable
        materials={paginatedMaterials}
        onEditMaterial={editMaterial}
        onArchiveMaterial={archiveMaterial}
        onRestoreMaterial={(material) => {
          setRestoreMaterialTarget(material)
        }}
        onRestock={restockInventoryMaterial}
        onInitializeExpirationStock={initializeMaterialExpirationStock}
        onEnableExpirationTracking={enableMaterialExpirationTracking}
        onDisposeExpiredBatch={disposeExpiredInventoryBatch}
      />
      {restoreMaterialTarget && (
        <RestoreMaterialDialog
          open={Boolean(restoreMaterialTarget)}
          onOpenChange={(open) => {
            if (!open && !restoreSaving) {
              setRestoreMaterialTarget(null)
            }
          }}
          materialName={restoreMaterialTarget.material_name}
          saving={restoreSaving}
          onConfirm={async () => {
            try {
              setRestoreSaving(true)

              await restoreMaterial(restoreMaterialTarget.id)

              setRestoreMaterialTarget(null)
            } finally {
              setRestoreSaving(false)
            }
          }}
        />
      )}
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
