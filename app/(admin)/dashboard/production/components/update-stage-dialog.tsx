"use client"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useState } from "react"

import {
  ProductionProject,
  ProductionStage,
} from "../types/production"

interface Props {
  project: ProductionProject | null

  open: boolean

  onOpenChange: (
    open: boolean
  ) => void

  onSave: (
    stage: ProductionStage
  ) => void
}

export default function UpdateStageDialog({
  project,
  open,
  onOpenChange,
  onSave,
}: Props) {
  const [stage, setStage] =
    useState<ProductionStage>(
      "pending-fabrication"
    )

  if (!project) return null

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Update Production Stage
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-4">

          <div>

            <p className="text-sm text-muted-foreground mb-2">
              Current Stage
            </p>

            <p className="font-medium">
              {
                project.currentStage
              }
            </p>

          </div>

          <div>

            <p className="text-sm text-muted-foreground mb-2">
              New Stage
            </p>

            <Select
              value={stage}
              onValueChange={(
                value
              ) =>
                setStage(
                  value as ProductionStage
                )
              }
            >

              <SelectTrigger>

                <SelectValue />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="pending-fabrication">
                  Pending
                  Fabrication
                </SelectItem>

                <SelectItem value="glass-cutting">
                  Glass Cutting
                </SelectItem>

                <SelectItem value="assembly">
                  Assembly
                </SelectItem>

                <SelectItem value="quality-check">
                  Quality Check
                </SelectItem>

                <SelectItem value="ready-for-delivery">
                  Ready For Delivery
                </SelectItem>

                <SelectItem value="on-hold">
                  On Hold
                </SelectItem>

              </SelectContent>

            </Select>

          </div>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            onClick={() =>
              onSave(stage)
            }
          >
            Save Changes
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}