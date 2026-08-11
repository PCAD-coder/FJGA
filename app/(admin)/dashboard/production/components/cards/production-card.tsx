"use client"

import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import { Eye, Settings2 } from "lucide-react"

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
  const currentIndex = stages.indexOf(project.stage)

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}

        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{project.projectName}</h3>

            <p className="text-sm text-muted-foreground">
              Client: {project.clientName}
            </p>

            <p className="text-xs text-muted-foreground">
              Order: {project.orderNumber}
            </p>
          </div>

          <Badge>{project.stage}</Badge>
        </div>

        {/* Main Content */}

        <div className="grid gap-5 md:grid-cols-[300px_1fr]">
          {/* Image */}

          <div>
            <div className="relative h-[220px] overflow-hidden rounded-lg border">
              <Image
                src={project.imageUrl ?? "/placeholder.jpg"}
                alt={project.projectName}
                fill
                className="object-cover"
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              Production Reference
            </p>
          </div>

          {/* Details */}

          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">Dimensions</p>

                <p className="font-medium">
                  {project.dimensions ?? "Not specified"}
                </p>
              </div>

              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">Est. Completion</p>

                <p className="font-medium">{project.estimatedCompletion}</p>
              </div>

              <div className="rounded-md bg-muted p-3">
                <p className="text-xs text-muted-foreground">Assigned Staff</p>

                <p className="font-medium">
                  {project.assignedStaff || "Unassigned"}
                </p>
              </div>
            </div>

            {/* Stages */}

            <div>
              <h4 className="mb-3 text-sm font-medium">Production Stages</h4>

              <div className="flex flex-wrap gap-2">
                {stages.map((stage, index) => {
                  const completed = index < currentIndex

                  const active = index === currentIndex

                  return (
                    <Badge
                      key={stage}
                      className={
                        active
                          ? "bg-orange-500 hover:bg-orange-500"
                          : completed
                            ? "bg-green-600 hover:bg-green-600"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {stage}
                    </Badge>
                  )
                })}
              </div>
            </div>

            {/* Progress */}

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress</span>

                <span>{project.progress}%</span>
              </div>

              <Progress value={project.progress} />
            </div>

            {/* Actions */}

            <div className="flex gap-3 pt-2">
              <Button onClick={onUpdateStage}>
                <Settings2 className="mr-2 h-4 w-4" />
                Update Stage
              </Button>

              <Button variant="outline" onClick={onView}>
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
