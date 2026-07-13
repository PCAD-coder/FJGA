"use client"

import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import ImageUpload from "./image-upload"

import { Product } from "../types/product"

interface Props {
  product: Product | null
  open: boolean
  onOpenChange: (
    open: boolean
  ) => void
}

export default function EditProductDialog({
  product,
  open,
  onOpenChange,
}: Props) {
  const [name, setName] =
    useState("")

  const [category, setCategory] =
    useState("")

  const [dimensions, setDimensions] =
    useState("")

  const [price, setPrice] =
    useState("")

  const [description, setDescription] =
    useState("")

  useEffect(() => {
    if (!product) return

    setName(product.name)
    setCategory(product.category)
    setDimensions(product.dimensions)
    setPrice(String(product.price))
    setDescription(product.description)
  }, [product])

  if (!product) return null

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            Edit Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <ImageUpload
            defaultImage={
              product.image
            }
          />

          <div>
            <Label>
              Product Name
            </Label>

            <Input
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />
          </div>

          <div>
            <Label>
              Category
            </Label>

            <Select
              value={category}
              onValueChange={
                setCategory
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Windows">
                  Windows
                </SelectItem>

                <SelectItem value="Doors">
                  Doors
                </SelectItem>

                <SelectItem value="Railings">
                  Railings
                </SelectItem>

                <SelectItem value="Partitions">
                  Partitions
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <Label>
                Dimensions
              </Label>

              <Input
                value={
                  dimensions
                }
                onChange={(e) =>
                  setDimensions(
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <Label>
                Price
              </Label>

              <Input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(
                    e.target.value
                  )
                }
              />
            </div>

          </div>

          <div>
            <Label>
              Description
            </Label>

            <Textarea
              rows={4}
              value={
                description
              }
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />
          </div>

          <div className="flex justify-end gap-2">

            <Button
              variant="outline"
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button>
              Save Changes
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  )
}