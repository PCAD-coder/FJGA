"use client"

import { useMemo, useState, useEffect } from "react"
import { useProduction } from "../hooks/use-production"
import type { ProductionProject } from "../types/production"

import ProductionCardSkeleton from "./cards/production-card-skeleton"
import ProductionCard from "./cards/production-card"
import ProductionDetailsDialog from "./dialogs/production-details-dialog"
import UpdateStageDialog from "./dialogs/update-stage-dialog"
import ProductionPagination from "./production-pagination"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { Search } from "lucide-react"

import { toast } from "sonner"

export default function ProductionModule() {
  const { projects, loading, changeStage } = useProduction()

  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState("all")

  const [selectedProject, setSelectedProject] =
    useState<ProductionProject | null>(null)

  const [viewOpen, setViewOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)

  const jobsPerPage = 4

  useEffect(() => {
    setCurrentPage(1)
  }, [search, stageFilter])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.projectName.toLowerCase().includes(search.toLowerCase()) ||
        project.clientName.toLowerCase().includes(search.toLowerCase())

      const matchesStage =
        stageFilter === "all"
          ? true
          : project.stage.toLowerCase().replaceAll(" ", "_") === stageFilter

      return matchesSearch && matchesStage
    })
  }, [projects, search, stageFilter])

  const totalPages = Math.ceil(filteredProjects.length / jobsPerPage) || 1

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  )

  const totalProjects = projects.length

  const inProduction = projects.filter(
    (project) => project.stage !== "Ready for Delivery"
  ).length

  const readyForDelivery = projects.filter(
    (project) => project.stage === "Ready for Delivery"
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Production Tracking</h1>
        <p className="text-muted-foreground">
          Track fabrication progress and manage production workflows.
        </p>
      </div>

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
            <p className="text-sm text-muted-foreground">Completed Stages</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {readyForDelivery}
            </h2>
          </CardContent>
        </Card>
      </div>

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
          <ToggleGroupItem value="pending">Pending</ToggleGroupItem>
          <ToggleGroupItem value="material_prep">Material Prep</ToggleGroupItem>
          <ToggleGroupItem value="glass_cutting">Glass Cutting</ToggleGroupItem>
          <ToggleGroupItem value="frame_fabrication">
            Frame Fabrication
          </ToggleGroupItem>
          <ToggleGroupItem value="assembly">Assembly</ToggleGroupItem>
          <ToggleGroupItem value="finishing">Finishing</ToggleGroupItem>
          <ToggleGroupItem value="quality_check">Quality Check</ToggleGroupItem>
          <ToggleGroupItem value="ready_for_delivery">Ready</ToggleGroupItem>
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

      <div className="space-y-6">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ProductionCardSkeleton key={index} />
            ))
          : paginatedProjects.map((project) => (
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

      {!loading && filteredProjects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold">No Projects Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search.
            </p>
          </CardContent>
        </Card>
      )}

      {filteredProjects.length > jobsPerPage && (
        <ProductionPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <ProductionDetailsDialog
        project={selectedProject}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <UpdateStageDialog
        project={selectedProject}
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        onStageChange={async (stage, notes) => {
          if (!selectedProject) return

          const toastId = toast.loading("Updating production stage...")

          try {
            await changeStage(selectedProject.id, stage, notes)

            toast.success("Stage updated successfully", {
              id: toastId,
              description: `${selectedProject.projectName} moved to ${stage
                .replaceAll("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}.`,
            })

            setUpdateOpen(false)
          } catch (error) {
            console.error(error)

            toast.error("Failed to update stage", {
              id: toastId,
              description:
                "Please try again. If the problem persists, contact an administrator.",
            })
            throw error
          }
        }}
      />
    </div>
  )
}
