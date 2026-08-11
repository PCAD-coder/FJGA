"use client"

import { useEffect, useMemo, useState } from "react"
import {
  PRODUCT_CATEGORIES,
  PRODUCT_TYPES,
} from "../../constants/product-options"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import Image from "next/image"

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

import type {
  ProductInsert,
  ProductType,
  ProductWithDetails,
} from "../../types/product"

import {
  getActiveMaterials,
  type InventoryMaterialOption,
} from "../../services/inventory-lookup-service"

import {
  getActiveServices,
  type LaborServiceOption,
} from "../../services/pricing-lookup-service"

import type { ProductImage } from "../../types/product"
import {
  getAllVariantMaterials,
  ProductVariantMaterialSelections,
  VariantMaterialOption,
} from "../../services/product-variant-material-service"

import { getProductVariantMaterials } from "../../services/product-variant-material-link-service"

import { Checkbox } from "@/components/ui/checkbox"

import {
  getActiveCalculationMethods,
  type CalculationMethodOption,
} from "../../services/calculation-method-service"
import { X } from "lucide-react"
import { toast } from "sonner"

function getMeasurementValue(
  methodKey: string | null,
  width: number | null,
  height: number | null,
  depth: number | null
): number {
  const w = width ?? 0
  const h = height ?? 0
  const d = depth ?? 0

  switch (methodKey) {
    case "width":
      return w
    case "height":
      return h
    case "depth":
      return d
    case "perimeter":
      return 2 * (w + h)
    case "area":
      return w * h
    case "volume":
      return w * h * d
    default:
      return 1
  }
}

interface SelectedMaterial {
  inventory_material_id: string
  quantity: number
  is_fixed: boolean
  calculation_method_id: string | null
}

interface SelectedLabor {
  pricing_service_id: string
  quantity: number
}

interface EditProductDialogProps {
  open: boolean

  onOpenChange: (open: boolean) => void

  saving: boolean

  product: ProductWithDetails | null

  onSave: (data: {
    product: ProductInsert

    images: File[]

    existingImages: ProductImage[]

    materials: {
      inventory_material_id: string
      quantity: number
      is_fixed: boolean
      calculation_method_id: string | null
    }[]

    labor: {
      pricing_service_id: string
      quantity: number
    }[]

    variants: ProductVariantMaterialSelections
  }) => Promise<void>
}

const defaultProduct: ProductInsert = {
  product_code: "",

  product_name: "",

  category: "",

  description: "",

  width: null as number | null,
  height: null as number | null,
  depth: null as number | null,
  dimension_unit: "cm",

  markup_percentage: 0,

  product_type: "standard",

  is_customizable: false,

  is_active: true,

  is_depth_customizable: false,
}

export default function EditProductDialog({
  open,
  onOpenChange,
  saving,
  product,
  onSave,
}: EditProductDialogProps) {
  const [form, setForm] = useState<ProductInsert>(defaultProduct)

  const [images, setImages] = useState<File[]>([])

  const [materials, setMaterials] = useState<SelectedMaterial[]>([
    {
      inventory_material_id: "",
      quantity: 1,
      is_fixed: true,
      calculation_method_id: null,
    },
  ])

  const [labor, setLabor] = useState<SelectedLabor[]>([
    {
      pricing_service_id: "",
      quantity: 1,
    },
  ])

  const [inventoryMaterials, setInventoryMaterials] = useState<
    InventoryMaterialOption[]
  >([])

  const [laborServices, setLaborServices] = useState<LaborServiceOption[]>([])

  const [loadingOptions, setLoadingOptions] = useState(true)

  const [existingImages, setExistingImages] = useState<ProductImage[]>([])

  const [variantMaterials, setVariantMaterials] = useState({
    frameMaterials: [] as VariantMaterialOption[],
    glassMaterials: [] as VariantMaterialOption[],
  })

  const [variantSelections, setVariantSelections] =
    useState<ProductVariantMaterialSelections>({
      frameMaterials: [],
      glassMaterials: [],
    })

  const [calculationMethods, setCalculationMethods] = useState<
    CalculationMethodOption[]
  >([])

  useEffect(() => {
    async function loadOptions() {
      setLoadingOptions(true)

      const [materialsResult, laborResult, calculationMethodsResult] =
        await Promise.all([
          getActiveMaterials(),
          getActiveServices(),
          getActiveCalculationMethods(),
        ])

      if (calculationMethodsResult.data) {
        setCalculationMethods(calculationMethodsResult.data)
      }

      if (materialsResult.data) {
        setInventoryMaterials(materialsResult.data)
      }

      if (laborResult.data) {
        setLaborServices(laborResult.data)
      }

      setLoadingOptions(false)
    }

    loadOptions()
  }, [])
  useEffect(() => {
    if (!product) return

    async function loadVariants() {
      if (!product) return

      const options = await getAllVariantMaterials()
      setVariantMaterials(options)

      const selected = await getProductVariantMaterials(product.id)

      if (selected.data) {
        setVariantSelections({
          frameMaterials: selected.data
            .filter((v) => v.variant_group === "frame_material")
            .map((v) => v.inventory_material_id),

          glassMaterials: selected.data
            .filter((v) => v.variant_group === "glass_material")
            .map((v) => v.inventory_material_id),
        })
      }
    }

    setForm({
      product_code: product.product_code,
      product_name: product.product_name,
      category: product.category,
      description: product.description ?? "",
      width: product.width,
      height: product.height,
      depth: product.depth,
      dimension_unit: product.dimension_unit,
      markup_percentage: product.markup_percentage,
      product_type: product.product_type,
      is_customizable: product.is_customizable,
      is_active: product.is_active,
      is_depth_customizable: product.is_depth_customizable,
    })

    setMaterials(
      product.materials.map((item) => ({
        inventory_material_id: item.inventory_material_id,
        quantity: item.quantity,
        is_fixed: item.is_fixed,
        calculation_method_id: item.calculation_method_id,
      }))
    )

    setLabor(
      product.labor.map((item) => ({
        pricing_service_id: item.pricing_service_id,
        quantity: item.quantity,
      }))
    )

    // Existing images are already stored.
    // New uploads will be added separately.
    setExistingImages(product.images)
    setImages([])
    loadVariants()
  }, [product])

  function updateProduct<K extends keyof ProductInsert>(
    key: K,
    value: ProductInsert[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }
  function resetForm() {
    setForm(defaultProduct)

    setImages([])

    setExistingImages([])

    setMaterials([
      {
        inventory_material_id: "",
        quantity: 1,
        is_fixed: true,
        calculation_method_id: null,
      },
    ])

    setLabor([
      {
        pricing_service_id: "",
        quantity: 1,
      },
    ])
    setVariantSelections({
      frameMaterials: [],
      glassMaterials: [],
    })
  }
  const formIsValid = useMemo(() => {
    if (!form.product_name.trim()) return false

    if (
      materials.some(
        (m) =>
          !m.inventory_material_id || (!m.is_fixed && !m.calculation_method_id)
      )
    ) {
      return false
    }

    if (labor.some((l) => !l.pricing_service_id)) return false

    return true
  }, [form, materials, labor])
  const pricingPreview = useMemo(() => {
    let materialCost = 0
    let materialSelling = 0

    for (const item of materials) {
      const material = inventoryMaterials.find(
        (m) => m.id === item.inventory_material_id
      )

      if (!material) continue

      const method = calculationMethods.find(
        (m) => m.id === item.calculation_method_id
      )

      const effectiveQuantity = item.is_fixed
        ? Number(item.quantity)
        : Number(item.quantity) *
          getMeasurementValue(
            method?.method_code ?? null,
            form.width,
            form.height,
            form.depth
          )

      const cost = Number(material.unit_cost ?? 0) * effectiveQuantity

      materialCost += cost

      materialSelling +=
        cost * (1 + Number(material.markup_percentage ?? 0) / 100)
    }

    let laborCost = 0
    let laborSelling = 0

    for (const item of labor) {
      const service = laborServices.find(
        (s) => s.id === item.pricing_service_id
      )

      if (!service) continue

      const cost = Number(service.labor_cost ?? 0) * Number(item.quantity)

      laborCost += cost

      laborSelling += cost * (1 + Number(service.markup_percentage ?? 0) / 100)
    }

    const productionCost = materialCost + laborCost

    const baseSelling = materialSelling + laborSelling

    const sellingPrice =
      baseSelling * (1 + Number(form.markup_percentage ?? 0) / 100)

    return {
      materialCost,
      laborCost,
      productionCost,
      sellingPrice,
    }
  }, [
    materials,
    labor,
    inventoryMaterials,
    laborServices,
    calculationMethods,
    form.width,
    form.height,
    form.depth,
    form.markup_percentage,
  ])

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return

    setImages(Array.from(event.target.files))
  }

  function addMaterial() {
    setMaterials((prev) => [
      ...prev,
      {
        inventory_material_id: "",
        quantity: 1,
        is_fixed: true,
        calculation_method_id: null,
      },
    ])
  }

  function addLabor() {
    setLabor((prev) => [
      ...prev,
      {
        pricing_service_id: "",
        quantity: 1,
      },
    ])
  }

  function removeMaterial(index: number) {
    setMaterials((prev) => prev.filter((_, i) => i !== index))
  }

  function removeLabor(index: number) {
    setLabor((prev) => prev.filter((_, i) => i !== index))
  }
  async function handleSave() {
  if (!product) return

  try {
    // Basic validation
    if (!formIsValid) {
      toast.error("Missing required information", {
        description: "Please complete all required fields before saving.",
      })
      return
    }

    await onSave({
      product: {
        ...form,
        product_code: product.product_code,
      },
      images,
      existingImages,
      materials,
      labor,
      variants: variantSelections,
    })

    // Parent handles loading/success/error toasts.
    // Only reset local state after a successful save.
    
  } catch (error) {
    // Parent toast.promise already shows the error toast.
    // Keep this only for debugging.
    console.error("Failed to save product:", error)
  }
}

  function toggleVariantMaterial(
    group: keyof ProductVariantMaterialSelections,
    id: string
  ) {
    setVariantSelections((prev) => {
      const exists = prev[group].includes(id)

      return {
        ...prev,
        [group]: exists
          ? prev[group].filter((value) => value !== id)
          : [...prev[group], id],
      }
    })
  }
 const previewImage = useMemo(() => {
  if (existingImages.length > 0) return existingImages[0].image_url

  if (images.length > 0) {
    return URL.createObjectURL(images[0])
  }

  return null
}, [existingImages, images])

useEffect(() => {
  return () => {
    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage)
    }
  }
}, [previewImage])
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm()
        }
        onOpenChange(isOpen)
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex h-[88vh] max-h-[88vh] !w-[1100px] !max-w-[95vw] overflow-hidden p-0"
      >
        <div className="flex h-full w-full">
          {/* LEFT PANEL */}
          <div className="w-[360px] overflow-hidden border-r bg-muted/20 p-6">
            <div className="flex h-full flex-col">
              {/* Main image preview */}
              <div className="relative h-[280px] overflow-hidden rounded-xl border bg-background">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt="Product preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No image selected
                  </div>
                )}
              </div>

              {/* Upload + thumbnails */}
              <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />

                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {existingImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative aspect-square overflow-hidden rounded-lg border"
                      >
                        <Image
                          src={image.image_url}
                          alt="Product image"
                          fill
                          className="object-cover"
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() =>
                            setExistingImages((prev) =>
                              prev.filter((img) => img.id !== image.id)
                            )
                          }
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Newly selected images */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square overflow-hidden rounded-lg border"
                      >
                        <Image
                          src={URL.createObjectURL(image)}
                          alt={`New image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="sticky top-0 z-10 border-b p-4">
              <div className="flex items-start justify-between gap-4">
                <DialogHeader className="space-y-2 text-left">
                  <DialogTitle className="text-2xl font-bold">
                    Edit product
                  </DialogTitle>

                  <p className="text-sm text-muted-foreground">
                    Update the product information, materials, labor, and
                    variants.
                  </p>
                </DialogHeader>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    resetForm()
                    onOpenChange(false)
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-8 p-6">
                <section className="space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Product Information
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      Enter the basic information for this product.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Product Name */}

                    <div className="space-y-2">
                      <Label>Product Name</Label>

                      <Input
                        value={form.product_name}
                        onChange={(e) =>
                          updateProduct("product_name", e.target.value)
                        }
                        placeholder="Sliding Window"
                      />
                    </div>

                    {/* Category */}

                    <div className="space-y-2">
                      <Label>Category</Label>

                      <Select
                        value={form.category}
                        onValueChange={(value) =>
                          updateProduct("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>

                        <SelectContent>
                          {PRODUCT_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Product Type */}

                    <div className="space-y-2">
                      <Label>Product Type</Label>

                      <Select
                        value={form.product_type}
                        onValueChange={(value) =>
                          updateProduct("product_type", value as ProductType)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {PRODUCT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Customizable */}

                    <div className="space-y-2">
                      <Label>Customizable</Label>

                      <Select
                        value={form.is_customizable ? "yes" : "no"}
                        onValueChange={(value) =>
                          updateProduct("is_customizable", value === "yes")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>

                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/*dimenstions*/}
                  <div className="space-y-2">
                    <Label>Dimensions (cm)</Label>

                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        type="number"
                        placeholder="Width"
                        value={form.width ?? ""}
                        onChange={(e) =>
                          updateProduct(
                            "width",
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />

                      <Input
                        type="number"
                        placeholder="Height"
                        value={form.height ?? ""}
                        onChange={(e) =>
                          updateProduct(
                            "height",
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />

                      <Input
                        type="number"
                        placeholder="Depth"
                        value={form.depth ?? ""}
                        onChange={(e) =>
                          updateProduct(
                            "depth",
                            e.target.value === ""
                              ? null
                              : Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                  {/* is depth customizable? */}
                  <div className="space-y-2">
                    <Label>Depth Customizable</Label>

                    <Select
                      value={form.is_depth_customizable ? "yes" : "no"}
                      onValueChange={(value) =>
                        updateProduct("is_depth_customizable", value === "yes")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>

                    <p className="text-xs text-muted-foreground">
                      If disabled, customer quotations will use the product's
                      default depth.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Product Markup (%)</Label>

                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.markup_percentage}
                      onChange={(e) =>
                        updateProduct(
                          "markup_percentage",
                          Number(e.target.value)
                        )
                      }
                    />

                    <p className="text-xs text-muted-foreground">
                      Applied after material and labor markups.
                    </p>
                  </div>

                  {/* Description */}

                  <div className="space-y-2">
                    <Label>Description</Label>

                    <Textarea
                      rows={4}
                      value={form.description ?? ""}
                      onChange={(e) =>
                        updateProduct("description", e.target.value)
                      }
                      placeholder="Enter a product description..."
                    />
                  </div>
                </section>

                <div className="space-y-3">
                  <Label>Allowed Frame Materials</Label>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {variantMaterials.frameMaterials.map((material) => (
                      <label
                        key={material.id}
                        className="flex cursor-pointer items-center gap-2 rounded-md border p-3 hover:bg-muted"
                      >
                        <Checkbox
                          checked={variantSelections.frameMaterials.includes(
                            material.id
                          )}
                          onCheckedChange={() =>
                            toggleVariantMaterial("frameMaterials", material.id)
                          }
                        />

                        <div className="text-sm">
                          <div className="font-medium">
                            {material.material_name}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {[
                              material.series,
                              material.specification,
                              material.color,
                              material.thickness,
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Allowed Glass Materials</Label>

                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {variantMaterials.glassMaterials.map((material) => (
                      <label
                        key={material.id}
                        className="flex cursor-pointer items-center gap-2 rounded-md border p-3 hover:bg-muted"
                      >
                        <Checkbox
                          checked={variantSelections.glassMaterials.includes(
                            material.id
                          )}
                          onCheckedChange={() =>
                            toggleVariantMaterial("glassMaterials", material.id)
                          }
                        />

                        <div className="text-sm">
                          <div className="font-medium">
                            {material.material_name}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {[
                              material.series,
                              material.specification,
                              material.color,
                              material.thickness,
                            ]
                              .filter(Boolean)
                              .join(" • ")}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ====================================================== */}
                {/* Product Images */}
                {/* ====================================================== */}

                {/* ====================================================== */}
                {/* Materials */}
                {/* ====================================================== */}
                <section className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Materials</h3>

                      <p className="text-sm text-muted-foreground">
                        Select the inventory materials required to build this
                        product.
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addMaterial}
                    >
                      Add Material
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {materials.map((material, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 items-end gap-3"
                      >
                        {/* Material */}

                        <div className="col-span-4 space-y-2">
                          <Label>Material</Label>

                          <Select
                            value={material.inventory_material_id}
                            onValueChange={(value) => {
                              const updated = [...materials]
                              updated[index].inventory_material_id = value
                              setMaterials(updated)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  loadingOptions
                                    ? "Loading materials..."
                                    : "Select material"
                                }
                              />
                            </SelectTrigger>

                            <SelectContent>
                              {inventoryMaterials.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.material_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Quantity */}

                        <div className="col-span-2 space-y-2">
                          <Label>Qty</Label>

                          <Input
                            type="number"
                            min={1}
                            value={material.quantity}
                            onChange={(e) => {
                              const updated = [...materials]

                              updated[index].quantity = Number(e.target.value)

                              setMaterials(updated)
                            }}
                          />
                        </div>

                        {/* Rule */}
                        <div className="col-span-2 space-y-2">
                          <Label>Rule</Label>

                          <Select
                            value={material.is_fixed ? "fixed" : "calculated"}
                            onValueChange={(value) => {
                              const updated = [...materials]

                              updated[index].is_fixed = value === "fixed"

                              if (value === "fixed") {
                                ;((updated[index].is_fixed = true),
                                  (updated[index].calculation_method_id = null),
                                  (updated[index].quantity = 1))
                              } else {
                                updated[index].is_fixed = false
                              }

                              setMaterials(updated)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="fixed">Fixed</SelectItem>
                              <SelectItem value="calculated">
                                Calculated
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {!material.is_fixed && (
                          <div className="col-span-3 space-y-2">
                            <Label>Calculation Method</Label>

                            <Select
                              value={
                                material.calculation_method_id ?? undefined
                              }
                              onValueChange={(value) => {
                                const updated = [...materials]

                                updated[index].calculation_method_id = value

                                setMaterials(updated)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select calculation method" />
                              </SelectTrigger>

                              <SelectContent>
                                {calculationMethods.map((method) => (
                                  <SelectItem key={method.id} value={method.id}>
                                    {method.display_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Remove */}

                        <div className="col-span-1">
                          {materials.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeMaterial(index)}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ====================================================== */}
                {/* Labor Services */}
                {/* ====================================================== */}

                <section className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Labor Services</h3>

                      <p className="text-sm text-muted-foreground">
                        Select the labor services needed for this product.
                      </p>
                    </div>

                    <Button type="button" variant="outline" onClick={addLabor}>
                      Add Labor
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {labor.map((service, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 items-end gap-3"
                      >
                        {/* Service */}

                        <div className="col-span-8 space-y-2">
                          <Label>Service</Label>

                          <Select
                            value={service.pricing_service_id}
                            onValueChange={(value) => {
                              const updated = [...labor]

                              updated[index].pricing_service_id = value

                              setLabor(updated)
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  loadingOptions
                                    ? "Loading services..."
                                    : "Select service"
                                }
                              />
                            </SelectTrigger>

                            <SelectContent>
                              {laborServices.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.service_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Quantity */}

                        <div className="col-span-3 space-y-2">
                          <Label>Qty</Label>

                          <Input
                            type="number"
                            min={1}
                            value={service.quantity}
                            onChange={(e) => {
                              const updated = [...labor]

                              updated[index].quantity = Number(e.target.value)

                              setLabor(updated)
                            }}
                          />
                        </div>

                        {/* Remove */}

                        <div className="col-span-1">
                          {labor.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeLabor(index)}
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <div>
                  <h3 className="text-lg font-semibold">Estimated Pricing</h3>

                  <p className="text-sm text-muted-foreground">
                    Based on the product's default dimensions and current
                    material/labor selections.
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Material Cost</span>
                    <span>
                      ₱
                      {(pricingPreview.materialCost ?? 0).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Labor Cost</span>
                    <span>
                      ₱
                      {(pricingPreview.laborCost ?? 0).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Production Cost</span>
                    <span>
                      ₱
                      {(pricingPreview.productionCost ?? 0).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Product Markup</span>
                    <span>
                      {Number(form.markup_percentage ?? 0).toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Estimated Selling Price</span>
                    <span>
                      ₱
                      {(pricingPreview.sellingPrice ?? 0).toLocaleString(
                        undefined,
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 border-t bg-background p-2">
                <div className="flex justify-end gap-2 border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm()
                      onOpenChange(false)
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    disabled={saving || !formIsValid}
                    onClick={handleSave}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
