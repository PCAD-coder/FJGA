"use client"

import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import { Eye, Settings2, RotateCcw } from "lucide-react"

import { ProductionProject, ProductionStage } from "../../types/production"

interface Props {
  project: ProductionProject

  onView: () => void

  onUpdateStage: () => void
}

const stages: ProductionStage[] = [
  "Pending",
  "Material Prep",
  "Glass Cutting",
  "Frame Fabrication",
  "Assembly",
  "Finishing",
  "Quality Check",
  "Ready for Delivery",
]

export default function ProductionCard({
  project,
  onView,
  onUpdateStage,
}: Props) {

const availableStages =
  project.applicableStages?.length
    ? project.applicableStages
    : stages

const currentIndex = availableStages.indexOf(project.stage)

  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight wrap-break-word">
              {project.projectName}
            </h3>
            <p className="text-sm text-muted-foreground">
              Client: {project.clientName}
            </p>
            <p className="text-xs text-muted-foreground">
              Order: {project.orderNumber}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 [&_[data-slot=badge]]:rounded-full [&_[data-slot=badge]]:text-[10px]">
            {project.projectType === "return" && (
              <Badge variant="outline">
                <RotateCcw className="mr-1 h-3 w-3" />
                Return
              </Badge>
            )}
            <Badge>{project.stage}</Badge>
          </div>
        </div>
        <div className="grid min-w-0 gap-4 lg:grid-cols-[180px_minmax(0,1fr)]">
          <div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted lg:h-[150px]">
              <Image
                src={project.imageUrl ?? "/placeholder.jpg"}
                alt={project.projectName}
                fill
                sizes="(max-width: 1024px) 100vw, 180px"
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Production Reference
            </p>
          </div>
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,140px),1fr))] gap-3">
              <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Dimensions</p>
                <p className="mt-1 text-sm font-medium wrap-break-word">
                  {project.dimensions ?? "Not specified"}
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Est. Completion</p>
                <p className="mt-1 text-sm font-medium wrap-break-word">
                  {project.estimatedCompletion}
                </p>
              </div>
              <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Assigned Staff</p>
                <p className="mt-1 text-sm font-medium wrap-break-word">
                  {project.assignedStaff || "Unassigned"}
                </p>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-medium">Production Stages</h4>
              <div className="flex flex-wrap gap-1.5 [&_[data-slot=badge]]:rounded-full [&_[data-slot=badge]]:px-2 [&_[data-slot=badge]]:text-[10px]">
                {availableStages.map((stage, index) => {
                  const completed = index < currentIndex
                  const active = index === currentIndex
                  return (
                    <Badge
                      key={stage}
                      className={
                        active
                          ? "bg-primary text-primary-foreground hover:bg-primary"
                          : completed
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {stage}
                    </Badge>
                  )
                })}
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-border/60 pt-3">
              <Button
                onClick={onUpdateStage}
                className="h-9 rounded-lg text-xs shadow-none"
              >
                <Settings2 className="mr-2 h-4 w-4" />
                Update Stage
              </Button>
              <Button
                variant="outline"
                onClick={onView}
                className="h-9 rounded-lg text-xs shadow-none"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
