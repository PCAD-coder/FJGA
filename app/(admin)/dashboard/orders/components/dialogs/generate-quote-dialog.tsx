"use client"

import { useEffect, useMemo, useState } from "react"

import { useQuotationData } from "../../hooks/use-quotation-data"

import { getProducts } from "../../../products/services/product-service"
import { getProductPricingForDimensions } from "../../../products/services/product-pricing"
import type { Product } from "../../../products/types/product"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Plus, Trash2 } from "lucide-react"

interface MaterialItem {
  id: number
  materialId: string
  material: string
  quantity: number
  unitPrice: number
}
interface LaborItem {
  id: number
  serviceId: string
  service: string
  quantity: number
  laborCost: number
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (quotation: {
    materials: MaterialItem[]
    laborCost: number
    deliveryFee: number
    totalCost: number
  }) => void
}

export default function GenerateQuoteDialog({
  open,
  onOpenChange,
  onSave,
}: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState("")

  const [width, setWidth] = useState<number | null>(null)
  const [height, setHeight] = useState<number | null>(null)
  const [depth, setDepth] = useState<number | null>(null)

  const [productPricing, setProductPricing] = useState<
    Awaited<ReturnType<typeof getProductPricingForDimensions>>["data"] | null
  >(null)

  const [setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    async function loadProducts() {
      const result = await getProducts()

      if (result.data) {
        setProducts(result.data)
      }
    }

    loadProducts()
  }, [])
  useEffect(() => {
    async function loadPricing() {
      if (!selectedProductId) {
        setProductPricing(null)
        return
      }

      const product = products.find((p) => p.id === selectedProductId) ?? null

      const pricing = await getProductPricingForDimensions(selectedProductId, {
        width,
        height,
        depth,
      })

      setProductPricing(pricing.data ?? null)
    }

    loadPricing()
  }, [selectedProductId, width, height, depth, products])

  useEffect(() => {
    if (!productPricing) {
      setMaterials([
        {
          id: 1,
          materialId: "",
          material: "",
          quantity: 1,
          unitPrice: 0,
        },
      ])

      setLaborItems([
        {
          id: 1,
          serviceId: "",
          service: "",
          quantity: 1,
          laborCost: 0,
        },
      ])

      return
    }

    setMaterials(
      productPricing.materialsSnapshot.map((m, index) => ({
        id: index + 1,
        materialId: m.material_id,
        material: m.material_name,
        quantity: m.quantity,
        unitPrice: m.subtotal / m.quantity,
      }))
    )

    setLaborItems(
      productPricing.laborSnapshot.map((l, index) => ({
        id: index + 1,
        serviceId: l.service_id,
        service: l.service_name,
        quantity: l.quantity,
        laborCost: l.subtotal / l.quantity,
      }))
    )
  }, [productPricing])
  const {
    materials: inventoryMaterials,
    laborServices,
    loading,
  } = useQuotationData()

  const [materials, setMaterials] = useState<MaterialItem[]>([
    {
      id: 1,
      materialId: "",
      material: "",
      quantity: 1,
      unitPrice: 0,
    },
  ])

  const [laborItems, setLaborItems] = useState<LaborItem[]>([
    {
      id: 1,
      serviceId: "",
      service: "",
      quantity: 1,
      laborCost: 0,
    },
  ])
  const [deliveryFee, setDeliveryFee] = useState(0)

  const materialTotal = productPricing?.materialCost ?? 0
  const laborTotal = productPricing?.laborCost ?? 0
  const productionCost = productPricing?.productionCost ?? 0
  const sellingPrice = productPricing?.sellingPrice ?? 0

  const total = sellingPrice + deliveryFee

  const addMaterial = () => {
    setMaterials([
      ...materials,
      {
        id: Date.now(),
        materialId: "",
        material: "",
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  const removeMaterial = (id: number) => {
    setMaterials(materials.filter((m) => m.id !== id))
  }
  const addLabor = () => {
    setLaborItems([
      ...laborItems,
      {
        id: Date.now(),
        serviceId: "",
        service: "",
        quantity: 1,
        laborCost: 0,
      },
    ])
  }

  const removeLabor = (id: number) => {
    setLaborItems(laborItems.filter((l) => l.id !== id))
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Quote</DialogTitle>
          </DialogHeader>

          <div className="py-8 text-center text-muted-foreground">
            Loading quotation data...
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-6xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Generate Quote</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <h3 className="font-medium">Product</h3>

          <Select
            value={selectedProductId}
            onValueChange={setSelectedProductId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>

            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.product_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-3 gap-3">
            <Input
              type="number"
              placeholder="Width"
              value={width ?? ""}
              onChange={(e) =>
                setWidth(e.target.value === "" ? null : Number(e.target.value))
              }
            />

            <Input
              type="number"
              placeholder="Height"
              value={height ?? ""}
              onChange={(e) =>
                setHeight(e.target.value === "" ? null : Number(e.target.value))
              }
            />

            <Input
              type="number"
              placeholder="Depth"
              value={depth ?? ""}
              onChange={(e) =>
                setDepth(e.target.value === "" ? null : Number(e.target.value))
              }
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto pr-2">
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">Materials</h3>
              <div className="grid grid-cols-12 gap-2 px-1 text-sm font-medium text-muted-foreground">
                <div className="col-span-6">Material</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-3">Unit Price</div>
                <div className="col-span-1"></div>
              </div>

              {materials.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 items-center gap-2"
                >
                  <Select
                    value={item.materialId}
                    onValueChange={(value) => {
                      const selected = inventoryMaterials.find(
                        (m) => m.id === value
                      )

                      if (!selected) return

                      const copy = [...materials]

                      const markedUpPrice =
                        selected.unit_cost +
                        selected.unit_cost * (selected.markup_percentage / 100)

                      copy[index] = {
                        ...copy[index],
                        materialId: selected.id,
                        material: selected.material_name,
                        unitPrice: markedUpPrice,
                      }

                      setMaterials(copy)
                    }}
                  >
                    <SelectTrigger className="col-span-6 w-full">
                      <SelectValue
                        placeholder="Select material"
                        className="truncate"
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {inventoryMaterials.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.material_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    className="col-span-2"
                    placeholder="Qty"
                    value={item.quantity}
                    min={1}
                    onChange={(e) => {
                      const copy = [...materials]

                      copy[index].quantity = Number(e.target.value) || 1

                      setMaterials(copy)
                    }}
                  />

                  <Input
                    type="number"
                    className="col-span-3"
                    value={item.unitPrice}
                    readOnly
                  />

                  <Button
                    size="icon"
                    variant="destructive"
                    disabled={materials.length === 1}
                    onClick={() => removeMaterial(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button variant="outline" onClick={addMaterial}>
                <Plus className="mr-2 h-4 w-4" />
                Add Material
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Labor Services</h3>

              <div className="grid grid-cols-12 gap-2 px-1 text-sm font-medium text-muted-foreground">
                <div className="col-span-6">Service</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-3">Labor Cost</div>
                <div className="col-span-1"></div>
              </div>

              {laborItems.map((item, index) => (
                <div
                  key={item.id}
                  className="gap-grid grid grid-cols-12 items-center gap-2"
                >
                  <Select
                    value={item.serviceId}
                    onValueChange={(value) => {
                      const selected = laborServices.find((s) => s.id === value)

                      if (!selected) return

                      // Apply markup percentage to labor cost
                      const markedUpLabor =
                        selected.labor_cost +
                        selected.labor_cost *
                          ((selected.markup_percentage ?? 0) / 100)

                      const copy = [...laborItems]

                      copy[index] = {
                        ...copy[index],
                        serviceId: selected.id,
                        service: selected.service_name,
                        laborCost: markedUpLabor,
                      }

                      setLaborItems(copy)
                    }}
                  >
                    <SelectTrigger className="col-span-6 w-full">
                      <SelectValue
                        placeholder="Select labor Service"
                        className="truncate"
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {laborServices.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.service_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    className="col-span-2"
                    value={item.quantity}
                    min={1}
                    onChange={(e) => {
                      const copy = [...laborItems]

                      copy[index].quantity = Number(e.target.value) || 1

                      setLaborItems(copy)
                    }}
                  />

                  <Input
                    type="number"
                    className="col-span-3"
                    value={item.laborCost}
                    readOnly
                  />

                  <Button
                    size="icon"
                    variant="destructive"
                    disabled={laborItems.length === 1}
                    onClick={() => removeLabor(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button variant="outline" onClick={addLabor}>
                <Plus className="mr-2 h-4 w-4" />
                Add Labor Service
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Delivery</h3>

              <Input
                type="number"
                placeholder="Delivery Fee"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex justify-between">
                <span>Material Cost</span>
                <span>
                  ₱
                  {materialTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Labor Cost</span>
                <span>
                  ₱
                  {laborTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Production Cost</span>
                <span>
                  ₱
                  {productionCost.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Selling Price</span>
                <span>
                  ₱
                  {sellingPrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span>
                  ₱
                  {deliveryFee.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span>
                  ₱
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t pt-4">
            <Button
              className="w-full"
              onClick={() =>
                onSave({
                  materials,
                  laborCost: laborTotal,
                  deliveryFee,
                  totalCost: total,
                })
              }
            >
              Save Quote
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
