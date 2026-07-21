"use client"

import { useMemo, useState } from "react"

import { usePricing } from "../hooks/use-pricing"

import { MaterialPricing, LaborPricing } from "../types/pricing"

import PricingKPIs from "./cards/pricing-kpis"
import PricingToolbar from "./pricing-toolbar"

import MaterialPricingTable from "./table/material-pricing-table"
import LaborPricingTable from "./table/labor-pricing-table"
import PricingPagination from "./table/pricing-pagination"

import EditMaterialDialog from "./dialogs/edit-material-dialog"
import ArchiveServiceDialog from "./dialogs/archive-service-dialog"
import AddServiceDialog from "./dialogs/add-service-dialog"
import EditServiceDialog from "./dialogs/edit-service-dialog"

export default function PricingModule() {
  const [archiveOpen, setArchiveOpen] = useState(false)

  const [archiveService, setArchiveService] = useState<LaborPricing | null>(
    null
  )

  const { materials, laborServices, stats, loading, refresh } = usePricing()

  const [activeTab, setActiveTab] = useState<"materials" | "labor">("materials")

  const [search, setSearch] = useState("")

  const [currentPage, setCurrentPage] = useState(1)

  const [addServiceOpen, setAddServiceOpen] = useState(false)

  const [editMaterialOpen, setEditMaterialOpen] = useState(false)

  const [editServiceOpen, setEditServiceOpen] = useState(false)

  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialPricing | null>(null)

  const [selectedService, setSelectedService] = useState<LaborPricing | null>(
    null
  )

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) =>
      material.material_name.toLowerCase().includes(search.toLowerCase())
    )
  }, [materials, search])

  const filteredServices = useMemo(() => {
    return laborServices.filter((service) =>
      service.service_name.toLowerCase().includes(search.toLowerCase())
    )
  }, [laborServices, search])

  const perPage = 5

  const data = activeTab === "materials" ? filteredMaterials : filteredServices

  const totalPages = Math.max(1, Math.ceil(data.length / perPage))

  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pricing Management</h1>

        <p className="text-muted-foreground">
          Manage material and labor pricing.
        </p>
      </div>

      <PricingKPIs
        totalMaterials={stats.totalMaterials}
        totalServices={stats.totalServices}
        averageMaterialMarkup={stats.averageMaterialMarkup}
        averageLaborMarkup={stats.averageLaborMarkup}
      />

      <PricingToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearchChange={setSearch}
        onAddService={() => setAddServiceOpen(true)}
      />

      {activeTab === "materials" ? (
        <MaterialPricingTable
          materials={paginatedMaterials}
          onEdit={(material) => {
            setSelectedMaterial(material)
            setEditMaterialOpen(true)
          }}
        />
      ) : (
        <LaborPricingTable
          services={paginatedServices}
          onEdit={(service) => {
            setSelectedService(service)
            setEditServiceOpen(true)
          }}
          onArchive={(service) => {
            setArchiveService(service)
            setArchiveOpen(true)
          }}
        />
      )}

      <PricingPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <EditMaterialDialog
        open={editMaterialOpen}
        onOpenChange={setEditMaterialOpen}
        material={selectedMaterial}
        refresh={refresh}
      />
      <AddServiceDialog
        open={addServiceOpen}
        onOpenChange={setAddServiceOpen}
        refresh={refresh}
      />

      <ArchiveServiceDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        service={archiveService}
        refresh={refresh}
      />

      <EditServiceDialog
        open={editServiceOpen}
        onOpenChange={setEditServiceOpen}
        service={selectedService}
        refresh={refresh}
      />
    </div>
  )
}
