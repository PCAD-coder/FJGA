"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"

import { Plus } from "lucide-react"

export default function AddProductDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">

        <DialogHeader>
          <DialogTitle>
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">

          {/* Product Name */}

          <div className="space-y-2">
            <Label>
              Product Name
            </Label>

            <Input placeholder="Sliding Window" />
          </div>

          {/* Category */}

          <div className="space-y-2">
            <Label>
              Category
            </Label>

            <Select>

              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="windows">
                  Windows
                </SelectItem>

                <SelectItem value="doors">
                  Doors
                </SelectItem>

                <SelectItem value="railings">
                  Railings
                </SelectItem>

                <SelectItem value="partitions">
                  Partitions
                </SelectItem>
              </SelectContent>

            </Select>
          </div>

          {/* Dimensions + Price */}

          <div className="grid md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>
                Dimensions
              </Label>

              <Input placeholder="6ft x 4ft" />
            </div>

            <div className="space-y-2">
              <Label>
                Price
              </Label>

              <Input
                type="number"
                placeholder="12500"
              />
            </div>

          </div>

          {/* Image Upload */}

          <div className="space-y-2">

            <Label>
              Product Image
            </Label>

            <Input
              type="file"
              accept="image/*"
            />

          </div>

          {/* Description */}

          <div className="space-y-2">

            <Label>
              Description
            </Label>

            <Textarea
              rows={4}
              placeholder="Enter product description..."
            />

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-2">

            <Button
              variant="outline"
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </Button>

            <Button>
              Save Product
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  )
}