"use client"

import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import {
  Eye,
  Settings2,
} from "lucide-react"

import {
  ProductionProject,
  ProductionStage,
} from "../types/production"

interface Props {
  project: ProductionProject

  onView: () => void

  onUpdateStage: () => void
}

const stages: ProductionStage[] = [
  "pending-fabrication",
  "glass-cutting",
  "assembly",
  "quality-check",
  "ready-for-delivery",
  "on-hold",
]

const stageLabels: Record<
  ProductionStage,
  string
> = {
  "pending-fabrication":
    "Pending Fabrication",

  "glass-cutting":
    "Glass Cutting",

  assembly: "Assembly",

  "quality-check":
    "Quality Check",

  "ready-for-delivery":
    "Ready for Delivery",

  "on-hold": "On Hold",
}

export default function ProductionCard({
  project,
  onView,
  onUpdateStage,
}: Props) {
  const currentIndex =
    stages.indexOf(
      project.currentStage
    )

  return (
    <Card>

      <CardContent className="p-5">

        {/* HEADER */}

        <div className="flex items-start justify-between mb-5">

          <div>

            <h3 className="font-semibold text-lg">
              {project.projectName}
            </h3>

            <p className="text-sm text-muted-foreground">
              Client:{" "}
              {project.clientName}
            </p>

          </div>

          <Badge>
            {
              stageLabels[
                project
                  .currentStage
              ]
            }
          </Badge>

        </div>

        {/* MAIN CONTENT */}

        <div className="grid md:grid-cols-[300px_1fr] gap-5">

          {/* IMAGE */}

          <div>

            <div className="relative h-[220px] rounded-lg overflow-hidden border">

              <Image
                src={
                  project.image ??
                  "/placeholder.jpg"
                }
                alt={
                  project.projectName
                }
                fill
                className="object-cover"
              />

            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Production Reference
            </p>

          </div>

          {/* DETAILS */}

          <div className="space-y-4">

            <div className="grid md:grid-cols-4 gap-3">

              <div className="rounded-md bg-muted p-3">

                <p className="text-xs text-muted-foreground">
                  Dimensions
                </p>

                <p className="font-medium">
                  {
                    project.dimensions
                  }
                </p>

              </div>

              <div className="rounded-md bg-muted p-3">

                <p className="text-xs text-muted-foreground">
                  Start Date
                </p>

                <p className="font-medium">
                  {
                    project.startDate
                  }
                </p>

              </div>

              <div className="rounded-md bg-muted p-3">

                <p className="text-xs text-muted-foreground">
                  Est. Completion
                </p>

                <p className="font-medium">
                  {
                    project.estimatedCompletion
                  }
                </p>

              </div>

              <div className="rounded-md bg-muted p-3">

                <p className="text-xs text-muted-foreground">
                  Assigned Staff
                </p>

                <p className="font-medium">
                  {project.assignedStaff ??
                    "Unassigned"}
                </p>

              </div>

            </div>

            {/* STAGES */}

            <div>

              <h4 className="text-sm font-medium mb-3">
                Production Stages
              </h4>

              <div className="flex flex-wrap gap-2">

                {stages.map(
                  (
                    stage,
                    index
                  ) => {
                    const completed =
                      index <
                      currentIndex

                    const active =
                      index ===
                      currentIndex

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
                        {
                          stageLabels[
                            stage
                          ]
                        }
                      </Badge>
                    )
                  }
                )}

              </div>

            </div>

            {/* PROGRESS */}

            <div>

              <div className="flex justify-between text-sm mb-2">

                <span>
                  Progress
                </span>

                <span>
                  {
                    project.progress
                  }
                  %
                </span>

              </div>

              <Progress
                value={
                  project.progress
                }
              />

            </div>

            {/* ACTIONS */}

            <div className="flex gap-3 pt-2">

              <Button
                onClick={onUpdateStage}
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Update Stage
              </Button>

              <Button
                variant="outline"
                onClick={onView}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>

            </div>

          </div>

        </div>

      </CardContent>

    </Card>
  )
}