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

import { DashboardCard } from "@/components/dashboard_cards"

import {
  Search,
  ClipboardList,
  Factory,
  Truck,
  CircleCheck,
} from "lucide-react"

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

  const jobsPerPage = 10

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

  const page = Math.min(currentPage, totalPages)

  const paginatedProjects = filteredProjects.slice(
    (page - 1) * jobsPerPage,
    page * jobsPerPage
  )

  const totalProjects = projects.length

  const inProduction = projects.filter(
    (project) => project.stage !== "Ready for Delivery"
  ).length

  const readyForDelivery = projects.filter(
    (project) => project.stage === "Ready for Delivery"
  ).length

  return (
    <div className="mx-auto w-full max-w-[1600px] min-w-0 space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <div className="border-b border-border/70 pb-4">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Production Tracking
        </h1>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Track fabrication progress and manage production workflows.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
        <DashboardCard
          title="Total Projects"
          value={String(totalProjects)}
          description="All production projects"
          icon={ClipboardList}
          color="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard
          title="In Production"
          value={String(inProduction)}
          description="Projects still in progress"
          icon={Factory}
          color="text-primary"
        />
        <DashboardCard
          title="Ready For Delivery"
          value={String(readyForDelivery)}
          description="Projects ready for dispatch"
          icon={Truck}
          color="text-emerald-600 dark:text-emerald-400"
        />
        <DashboardCard
          title="Completed Stages"
          value={String(readyForDelivery)}
          description="Projects at the final stage"
          icon={CircleCheck}
          color="text-amber-600 dark:text-amber-400"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-border/80 bg-card p-4">
        <ToggleGroup
          type="single"
          value={stageFilter}
          onValueChange={(value) => {
            if (value) setStageFilter(value)
          }}
          className="h-auto max-w-full flex-wrap justify-start gap-1"
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
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search project or client..."
            aria-label="Search production projects"
            className="h-9 rounded-lg bg-background/50 pl-9 shadow-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
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

      {!loading && filteredProjects.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            Showing {(page - 1) * jobsPerPage + 1} to{" "}
            {Math.min(page * jobsPerPage, filteredProjects.length)} of{" "}
            {filteredProjects.length} projects
          </p>
          <ProductionPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
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
        onStageChange={async (stage, notes, replacement) => {
          if (!selectedProject) return

          const toastId = toast.loading("Updating production stage...")

          try {
            await changeStage(selectedProject.id, stage, notes, replacement)

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
