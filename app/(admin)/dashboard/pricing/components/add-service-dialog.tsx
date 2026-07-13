"use client"

import { useState } from "react"

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

  onAdd: (
    service: LaborService
  ) => void
}

export default function AddServiceDialog({
  open,
  onOpenChange,
  onAdd,
}: Props) {
  const [serviceType,
    setServiceType] =
    useState("")

  const [unit, setUnit] =
    useState("")

  const [rate, setRate] =
    useState(0)

  const handleSave = () => {
    onAdd({
      id: Date.now(),
      serviceType,
      unit,
      rate,
    })

    onOpenChange(false)
  }

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
            Add Service
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <Input
            placeholder="Service Type"
            value={serviceType}
            onChange={(e) =>
              setServiceType(
                e.target.value
              )
            }
          />

          <Input
            placeholder="Unit"
            value={unit}
            onChange={(e) =>
              setUnit(
                e.target.value
              )
            }
          />

          <Input
            type="number"
            placeholder="Rate"
            value={rate}
            onChange={(e) =>
              setRate(
                Number(
                  e.target.value
                )
              )
            }
          />

        </div>

        <DialogFooter>

          <Button
            onClick={
              handleSave
            }
          >
            Save
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}