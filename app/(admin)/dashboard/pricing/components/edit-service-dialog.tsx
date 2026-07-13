"use client"

import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { LaborService } from "../types/pricing"

interface Props {
  open: boolean

  onOpenChange: (
    open: boolean
  ) => void

  service:
    | LaborService
    | null

  onSave: (
    service: LaborService
  ) => void
}

export default function EditServiceDialog({
  open,
  onOpenChange,
  service,
  onSave,
}: Props) {
  const [formData,
    setFormData] =
    useState<LaborService | null>(
      null
    )

  useEffect(() => {
    setFormData(service)
  }, [service])

  if (!formData)
    return null

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Edit Service
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <Input
            value={
              formData.serviceType
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                serviceType:
                  e.target.value,
              })
            }
          />

          <Input
            value={
              formData.unit
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                unit:
                  e.target.value,
              })
            }
          />

          <Input
            type="number"
            value={
              formData.rate
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                rate: Number(
                  e.target.value
                ),
              })
            }
          />

        </div>

        <DialogFooter>

          <Button
            onClick={() =>
              onSave(formData)
            }
          >
            Save Changes
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}