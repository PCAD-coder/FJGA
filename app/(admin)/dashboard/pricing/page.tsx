"use client"

import { useMemo, useState } from "react"

import { MaterialPricing, LaborService } from "./types/pricing"

import MaterialPricingTable from "./components/material-pricing-table"
import LaborPricingTable from "./components/labor-pricing-table"
import PricingPagination from "./components/pricing-pagination"

import { Input } from "@/components/ui/input"

import { Card, CardContent } from "@/components/ui/card"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Search } from "lucide-react"
import AddMaterialDialog from "./components/add-material-dialog"
import EditMaterialDialog from "./components/edit-material-dialog"

import AddServiceDialog from "./components/add-service-dialog"
import EditServiceDialog from "./components/edit-service-dialog"

import { Button } from "@/components/ui/button"

import { Plus, Wrench } from "lucide-react"

const initialMaterials: MaterialPricing[] = [
  {
    id: 1,
    category: "Glass",
    material: '1/4" Clear Glass',
    unit: "per sheet",
    baseCost: 1250,
    markupPercentage: 40,
  },
  {
    id: 2,
    category: "Glass",
    material: '1/2" Tempered Glass',
    unit: "per sheet",
    baseCost: 3200,
    markupPercentage: 40,
  },
  {
    id: 3,
    category: "Aluminum",
    material: "798 Series Aluminum",
    unit: "per 20ft",
    baseCost: 850,
    markupPercentage: 35,
  },
  {
    id: 4,
    category: "Hardware",
    material: "Sliding Door Track",
    unit: "per set",
    baseCost: 380,
    markupPercentage: 45,
  },
]

const initialServices: LaborService[] = [
  {
    id: 1,
    serviceType: "Standard Installation",
    unit: "per day",
    rate: 2500,
  },
  {
    id: 2,
    serviceType: "Custom Fabrication",
    unit: "per project",
    rate: 3500,
  },
  {
    id: 3,
    serviceType: "Glass Cutting",
    unit: "per cut",
    rate: 150,
  },
]

export default function PricingPage() {
  const [materials, setMaterials] = useState(initialMaterials)

  const [services, setServices] = useState(initialServices)

  const [search, setSearch] = useState("")

  const [categoryFilter, setCategoryFilter] = useState("all")

  const [currentPage, setCurrentPage] = useState(1)

  const [addMaterialOpen, setAddMaterialOpen] = useState(false)

  const [editMaterialOpen, setEditMaterialOpen] = useState(false)

  const [addServiceOpen, setAddServiceOpen] = useState(false)

  const [editServiceOpen, setEditServiceOpen] = useState(false)

  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialPricing | null>(null)

  const [selectedService, setSelectedService] = useState<LaborService | null>(
    null
  )
  const handleAddMaterial = (material: MaterialPricing) => {
    setMaterials((prev) => [...prev, material])
  }

  const handleEditMaterial = (updated: MaterialPricing) => {
    setMaterials((prev) =>
      prev.map((material) => (material.id === updated.id ? updated : material))
    )

    setEditMaterialOpen(false)
  }

  const handleAddService = (service: LaborService) => {
    setServices((prev) => [...prev, service])
  }

  const handleEditService = (updated: LaborService) => {
    setServices((prev) =>
      prev.map((service) => (service.id === updated.id ? updated : service))
    )

    setEditServiceOpen(false)
  }

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      const matchesSearch = material.material
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesCategory =
        categoryFilter === "all" ? true : material.category === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [materials, search, categoryFilter])

  const perPage = 5

  const totalPages = Math.ceil(filteredMaterials.length / perPage)

  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const averageMarkup = Math.round(
    materials.reduce((sum, material) => sum + material.markupPercentage, 0) /
      materials.length
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pricing Management</h1>

        <p className="text-muted-foreground">
          Manage material and labor pricing.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Materials</p>

            <h2 className="text-3xl font-bold">{materials.length}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Labor Services</p>

            <h2 className="text-3xl font-bold">{services.length}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Avg Markup</p>

            <h2 className="text-3xl font-bold">{averageMarkup}%</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Categories</p>

            <h2 className="text-3xl font-bold">4</h2>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <ToggleGroup
          type="single"
          value={categoryFilter}
          onValueChange={(value) => {
            if (value) setCategoryFilter(value)
          }}
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>

          <ToggleGroupItem value="Glass">Glass</ToggleGroupItem>

          <ToggleGroupItem value="Aluminum">Aluminum</ToggleGroupItem>

          <ToggleGroupItem value="Hardware">Hardware</ToggleGroupItem>
        </ToggleGroup>

        <div className="relative max-w-md">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Labor Pricing</h2>

        <Button onClick={() => setAddMaterialOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Material
        </Button>
      </div>

      <MaterialPricingTable
        materials={paginatedMaterials}
        onEdit={(material) => {
          setSelectedMaterial(material)

          setEditMaterialOpen(true)
        }}
      />

      <PricingPagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={setCurrentPage}
      />

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Labor Pricing</h2>

        <Button onClick={() => setAddServiceOpen(true)}>
          <Wrench className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <LaborPricingTable
        services={services}
        onEdit={(service) => {
          setSelectedService(service)

          setEditServiceOpen(true)
        }}
      />
      <AddMaterialDialog
        open={addMaterialOpen}
        onOpenChange={setAddMaterialOpen}
        onAdd={handleAddMaterial}
      />

      <EditMaterialDialog
        open={editMaterialOpen}
        onOpenChange={setEditMaterialOpen}
        material={selectedMaterial}
        onSave={handleEditMaterial}
      />

      <AddServiceDialog
        open={addServiceOpen}
        onOpenChange={setAddServiceOpen}
        onAdd={handleAddService}
      />

      <EditServiceDialog
        open={editServiceOpen}
        onOpenChange={setEditServiceOpen}
        service={selectedService}
        onSave={handleEditService}
      />
    </div>
  )
}
