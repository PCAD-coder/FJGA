"use client"

import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import { ProductionProject } from "../types/production"

interface Props {
  project: ProductionProject | null

  open: boolean

  onOpenChange: (
    open: boolean
  ) => void
}

export default function ProductionDetailsDialog({
  project,
  open,
  onOpenChange,
}: Props) {
  if (!project) return null

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-5xl">

        <DialogHeader>
          <DialogTitle>
            {project.projectName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">

          {/* IMAGE */}

          <div>

            <div className="relative h-[350px] overflow-hidden rounded-lg border">

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

          </div>

          {/* DETAILS */}

          <div className="space-y-4">

            <div>

              <h4 className="font-medium">
                Client
              </h4>

              <p>
                {project.clientName}
              </p>

            </div>

            <div>

              <h4 className="font-medium">
                Dimensions
              </h4>

              <p>
                {project.dimensions}
              </p>

            </div>

            <div>

              <h4 className="font-medium">
                Assigned Staff
              </h4>

              <p>
                {project.assignedStaff ??
                  "Not Assigned"}
              </p>

            </div>

            <div>

              <h4 className="font-medium">
                Start Date
              </h4>

              <p>
                {project.startDate}
              </p>

            </div>

            <div>

              <h4 className="font-medium">
                Estimated Completion
              </h4>

              <p>
                {
                  project.estimatedCompletion
                }
              </p>

            </div>

            <div>

              <h4 className="font-medium">
                Current Status
              </h4>

              <Badge>
                {
                  project.currentStage
                }
              </Badge>

            </div>

            <div>

              <h4 className="font-medium mb-2">
                Progress
              </h4>

              <Progress
                value={
                  project.progress
                }
              />

              <p className="text-sm mt-2">
                {
                  project.progress
                }
                % Complete
              </p>

            </div>

            {project.notes && (
              <div>

                <h4 className="font-medium">
                  Notes
                </h4>

                <p>
                  {project.notes}
                </p>

              </div>
            )}

          </div>

        </div>

      </DialogContent>
    </Dialog>
  )
}