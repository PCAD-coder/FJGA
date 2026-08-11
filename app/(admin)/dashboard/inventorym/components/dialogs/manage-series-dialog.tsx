"use client"

import { useState } from "react"
import { Layers3, Archive } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useSeries } from "../../hooks/use-series"
import { createSeries, archiveSeries } from "../../services/series.service"

interface ManageSeriesDialogProps {
  trigger?: React.ReactNode
}

export function ManageSeriesDialog( {
  trigger,
}: ManageSeriesDialogProps) {
  const [open, setOpen] = useState(false)
  const [newSeries, setNewSeries] = useState("")
  const [saving, setSaving] = useState(false)

  const { series, refresh } = useSeries()

  async function handleAddSeries() {
    if (!newSeries.trim()) return

    try {
      setSaving(true)

      await createSeries(newSeries.trim())

      setNewSeries("")

      await refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id: string) {
    try {
      await archiveSeries(id)

      await refresh()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild> 
        {trigger ?? (
        <Button variant="outline">   
          <Layers3 className="mr-2 h-4 w-4" />
          Manage Series
        </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Aluminum Series</DialogTitle>

          <DialogDescription>
            Add or archive aluminum series options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>New Series</Label>

            <div className="flex gap-2">
              <Input
                placeholder="e.g. 798 Series"
                value={newSeries}
                onChange={(e) => setNewSeries(e.target.value)}
              />

              <Button onClick={handleAddSeries} disabled={saving}>
                Add
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Existing Series</Label>

            <div className="max-h-72 space-y-2 overflow-y-auto rounded-md border p-3">
              {series.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <span>{item.series_name}</span>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleArchive(item.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {series.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No aluminum series available.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
