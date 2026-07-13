"use client"

import { useMemo, useState, useEffect } from "react"

import { ProductionProject, ProductionStage } from "./types/production"

import ProductionCard from "./components/production-card"
import ProductionDetailsDialog from "./components/production-details-dialog"
import UpdateStageDialog from "./components/update-stage-dialog"
import ProductionPagination from "./components/production-pagination"

import { Input } from "@/components/ui/input"

import { Card, CardContent } from "@/components/ui/card"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Search } from "lucide-react"

const initialProjects: ProductionProject[] = [
  {
    id: 1,
    projectName: "Custom Glass Partition",
    clientName: "Maria Santos",
    image: "/products/partition.jpg",
    dimensions: "12ft x 8ft",
    startDate: "Apr 15, 2026",
    estimatedCompletion: "Apr 25, 2026",
    currentStage: "assembly",
    progress: 50,
    assignedStaff: "Production Team A",
    notes: "Use frosted tempered glass.",
  },

  {
    id: 2,
    projectName: "Sliding Window",
    clientName: "Juan Cruz",
    image: "/products/window.jpg",
    dimensions: "8ft x 5ft",
    startDate: "Apr 10, 2026",
    estimatedCompletion: "Apr 20, 2026",
    currentStage: "glass-cutting",
    progress: 25,
    assignedStaff: "Production Team B",
  },

  {
    id: 3,
    projectName: "Storefront Door",
    clientName: "Ana Reyes",
    image: "/products/door.jpg",
    dimensions: "4ft x 8ft",
    startDate: "Apr 12, 2026",
    estimatedCompletion: "Apr 22, 2026",
    currentStage: "ready-for-delivery",
    progress: 100,
    assignedStaff: "Production Team C",
  },
]

export default function ProductionPage() {
  const [projects, setProjects] = useState(initialProjects)

  const [search, setSearch] = useState("")

  const [stageFilter, setStageFilter] = useState("all")

  const [selectedProject, setSelectedProject] =
    useState<ProductionProject | null>(null)

  const [viewOpen, setViewOpen] = useState(false)

  const [updateOpen, setUpdateOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const projectsPerPage = 4
  useEffect(() => {
    setCurrentPage(1)
  }, [search, stageFilter])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.projectName.toLowerCase().includes(search.toLowerCase()) ||
        project.clientName.toLowerCase().includes(search.toLowerCase())

      const matchesStage =
        stageFilter === "all" ? true : project.currentStage === stageFilter

      return matchesSearch && matchesStage
    })
  }, [projects, search, stageFilter])

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage) || 1

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  )

  const getProgress = (stage: ProductionStage) => {
    switch (stage) {
      case "pending-fabrication":
        return 10

      case "glass-cutting":
        return 25

      case "assembly":
        return 50

      case "quality-check":
        return 75

      case "ready-for-delivery":
        return 100

      case "on-hold":
        return 0

      default:
        return 0
    }
  }

  const handleUpdateStage = (stage: ProductionStage) => {
    if (!selectedProject) return

    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              currentStage: stage,
              progress: getProgress(stage),
            }
          : project
      )
    )

    /**
     * FUTURE DATABASE LOGIC
     *
     * Update production stage
     *
     * If stage === ready-for-delivery
     * create delivery record
     */

    setUpdateOpen(false)
  }

  const totalProjects = projects.length

  const inProduction = projects.filter(
    (project) =>
      project.currentStage !== "ready-for-delivery" &&
      project.currentStage !== "on-hold"
  ).length

  const readyForDelivery = projects.filter(
    (project) => project.currentStage === "ready-for-delivery"
  ).length

  const onHoldProjects = projects.filter(
    (project) => project.currentStage === "on-hold"
  ).length

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">Production Tracking</h1>

        <p className="text-muted-foreground">
          Track fabrication progress and manage production workflows.
        </p>
      </div>

      {/* KPI CARDS */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Projects</p>

            <h2 className="text-3xl font-bold">{totalProjects}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">In Production</p>

            <h2 className="text-3xl font-bold">{inProduction}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Ready For Delivery</p>

            <h2 className="text-3xl font-bold text-green-600">
              {readyForDelivery}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">On Hold</p>

            <h2 className="text-3xl font-bold text-red-600">
              {onHoldProjects}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* FILTERS */}

      <div className="space-y-4">
        <ToggleGroup
          type="single"
          value={stageFilter}
          onValueChange={(value) => {
            if (value) setStageFilter(value)
          }}
          className="flex-wrap justify-start"
        >
          <ToggleGroupItem value="all">All</ToggleGroupItem>

          <ToggleGroupItem value="pending-fabrication">Pending</ToggleGroupItem>

          <ToggleGroupItem value="glass-cutting">Glass Cutting</ToggleGroupItem>

          <ToggleGroupItem value="assembly">Assembly</ToggleGroupItem>

          <ToggleGroupItem value="quality-check">Quality Check</ToggleGroupItem>

          <ToggleGroupItem value="ready-for-delivery">Ready</ToggleGroupItem>

          <ToggleGroupItem value="on-hold">On Hold</ToggleGroupItem>
        </ToggleGroup>

        <div className="relative max-w-md">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search project or client..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* PROJECTS */}

      <div className="space-y-6">
        {paginatedProjects.map((project) => (
          <ProductionCard
            key={project.id}
            project={project}
            onView={() => {
              setSelectedProject(project)
              setViewOpen(true)
            }}
            onUpdateStage={() => {
              setSelectedProject(project)
              setUpdateOpen(true)
            }}
          />
        ))}
      </div>

      {/* EMPTY STATE */}

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold">No Projects Found</h3>

            <p className="text-muted-foreground">
              Try adjusting your filters or search.
            </p>
          </CardContent>
        </Card>
      )}

      {/* PAGINATION */}

      {filteredProjects.length > projectsPerPage && (
        <ProductionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* DIALOGS */}

      <ProductionDetailsDialog
        project={selectedProject}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <UpdateStageDialog
        project={selectedProject}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        onSave={handleUpdateStage}
      />
    </div>
  )
}
