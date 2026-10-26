"use client"

import { toast } from "sonner"

import { useEffect, useMemo, useState } from "react"
import { FileText, Loader2, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  getDeliveryFeeForAddress,
  type DeliveryZoneResult,
} from "@/app/services/delivery/delivery-zone-service"

import type { CustomOrder } from "../../types/custom-order"
import type {
  QuotationLaborOption,
  QuotationMaterialOption,
  SelectedQuotationLabor,
  SelectedQuotationMaterial,
} from "../../types/quotation"

import {
  calculateCustomQuotationPricing,
  getQuotationLaborOptions,
  getQuotationMaterialOptions,
  sendCustomRequestQuotation,
} from "../../services/quotation-builder"

interface Props {
  order: CustomOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSent?: (
    quotationNumber: string,
    totalAmount: number
  ) => void | Promise<void>
}

function formatMoney(value: number) {
  return value.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function createEmptyMaterial(): SelectedQuotationMaterial {
  return {
    materialId: "",
    quantity: 1,
  }
}

function createEmptyLabor(): SelectedQuotationLabor {
  return {
    serviceId: "",
    quantity: 1,
  }
}

export default function CreateQuotationDialog({
  order,
  open,
  onOpenChange,
  onSent,
}: Props) {
  const [materialOptions, setMaterialOptions] = useState<
    QuotationMaterialOption[]
  >([])

  const [laborOptions, setLaborOptions] = useState<QuotationLaborOption[]>([])

  const [materials, setMaterials] = useState<SelectedQuotationMaterial[]>([
    createEmptyMaterial(),
  ])

  const [labor, setLabor] = useState<SelectedQuotationLabor[]>([
    createEmptyLabor(),
  ])

  const [deliveryZone, setDeliveryZone] = useState<DeliveryZoneResult | null>(
    null
  )

  const [loadingDelivery, setLoadingDelivery] = useState(false)

  const [deliveryError, setDeliveryError] = useState<string | null>(null)

  const [loadingOptions, setLoadingOptions] = useState(false)

  const [loadError, setLoadError] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    let cancelled = false

    async function loadOptions() {
      try {
        setLoadingOptions(true)
        setLoadError(null)

        const [materialData, laborData] = await Promise.all([
          getQuotationMaterialOptions(),
          getQuotationLaborOptions(),
        ])

        if (cancelled) return

        setMaterialOptions(materialData)
        setLaborOptions(laborData)
      } catch (error) {
        if (cancelled) return

        setLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load quotation options."
        )
      } finally {
        if (!cancelled) {
          setLoadingOptions(false)
        }
      }
    }

    void loadOptions()

    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!open || !order) return

    let cancelled = false

    async function loadDeliveryFee() {
      const cityPsgcCode = order?.deliveryAddress?.cityPsgcCode
      const barangayPsgcCode = order?.deliveryAddress?.barangayPsgcCode

      if (!cityPsgcCode || !barangayPsgcCode) {
        setDeliveryZone(null)
        setDeliveryError(
          "This request does not have a valid delivery city and barangay."
        )
        return
      }

      try {
        setLoadingDelivery(true)
        setDeliveryError(null)

        const result = await getDeliveryFeeForAddress(
          cityPsgcCode,
          barangayPsgcCode
        )

        if (cancelled) return

        if (!result) {
          setDeliveryZone(null)
          setDeliveryError(
            "Delivery is not currently available for this barangay."
          )
          return
        }

        setDeliveryZone(result)
      } catch (error) {
        if (cancelled) return

        setDeliveryZone(null)
        setDeliveryError(
          error instanceof Error
            ? error.message
            : "Failed to load delivery information."
        )
      } finally {
        if (!cancelled) {
          setLoadingDelivery(false)
        }
      }
    }

    void loadDeliveryFee()

    return () => {
      cancelled = true
    }
  }, [open, order])

  useEffect(() => {
    if (!open) {
      setMaterials([createEmptyMaterial()])
      setLabor([createEmptyLabor()])
      setDeliveryZone(null)
      setDeliveryError(null)
      setLoadingDelivery(false)
      setNotes("")
      setLoadError(null)
      setSendError(null)
      setSending(false)
    }
  }, [open])

  const validMaterials = useMemo(
    () =>
      materials.filter(
        (item) =>
          item.materialId && Number.isFinite(item.quantity) && item.quantity > 0
      ),
    [materials]
  )

  const validLabor = useMemo(
    () =>
      labor.filter(
        (item) =>
          item.serviceId && Number.isFinite(item.quantity) && item.quantity > 0
      ),
    [labor]
  )

  const pricing = useMemo(() => {
    if (!order) return null

    try {
      return calculateCustomQuotationPricing(
        validMaterials,
        validLabor,
        materialOptions,
        laborOptions,
        order.quantity
      )
    } catch {
      return null
    }
  }, [order, validMaterials, validLabor, materialOptions, laborOptions])

  const subtotal = pricing?.lineTotal ?? 0

  const vatRate = 12

  const vatAmount =
    Math.round((subtotal * (vatRate / 100) + Number.EPSILON) * 100) / 100

  const deliveryFee = deliveryZone?.deliveryFee ?? 0

  const totalAmount =
    Math.round((subtotal + vatAmount + deliveryFee + Number.EPSILON) * 100) /
    100

  function updateMaterial(
    index: number,
    changes: Partial<SelectedQuotationMaterial>
  ) {
    setMaterials((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...changes } : item
      )
    )
  }

  function updateLabor(
    index: number,
    changes: Partial<SelectedQuotationLabor>
  ) {
    setLabor((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...changes } : item
      )
    )
  }
  async function handleSendQuotation() {
    if (!order || !pricing) return

    if (validMaterials.length === 0 || validLabor.length === 0) {
      setSendError("At least one material and one labor service are required.")
      return
    }

    try {
      setSending(true)
      setSendError(null)

      const result = await sendCustomRequestQuotation({
        requestId: order.id,
        materials: validMaterials,
        labor: validLabor,
        deliveryFee: 0,
        notes,
      })

      toast.success("Quotation sent successfully.")
      await onSent?.(result.quotationNumber, result.totalAmount)

      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send quotation."
      )
      setSendError(
        error instanceof Error ? error.message : "Failed to send quotation."
      )
    } finally {
      setSending(false)
    }
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] !max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Quotation</DialogTitle>

          <DialogDescription>
            Prepare an official quotation for{" "}
            {order.requestNumber ?? order.projectName}. Material and labor
            quantities below represent the requirements for one unit.
          </DialogDescription>
        </DialogHeader>

        {loadingOptions ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />

            <span className="text-sm text-muted-foreground">
              Loading pricing data...
            </span>
          </div>
        ) : loadError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {loadError}
          </div>
        ) : (
          <div className="space-y-6">
            <section className="grid gap-4 rounded-lg border p-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Request</p>
                <p className="font-medium">
                  {order.requestNumber ?? "Custom Request"}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Project</p>
                <p className="font-medium">{order.projectName}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Client</p>
                <p className="font-medium">{order.clientName}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Quantity</p>
                <p className="font-medium">{order.quantity}</p>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Materials</h3>

                  <p className="text-sm text-muted-foreground">
                    Select the actual materials FJGA will use for one unit.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setMaterials((current) => [
                      ...current,
                      createEmptyMaterial(),
                    ])
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Material
                </Button>
              </div>

              <div className="space-y-3">
                {materials.map((item, index) => {
                  const selected = materialOptions.find(
                    (option) => option.id === item.materialId
                  )

                  return (
                    <div
                      key={index}
                      className="grid gap-3 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_140px_160px_44px]"
                    >
                      <div className="space-y-2">
                        <Label>Material</Label>

                        <Select
                          value={item.materialId}
                          onValueChange={(value) =>
                            updateMaterial(index, {
                              materialId: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>

                          <SelectContent>
                            {materialOptions.map((material) => (
                              <SelectItem key={material.id} value={material.id}>
                                {material.materialName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selected && (
                          <p className="text-xs text-muted-foreground">
                            {selected.unit} · Stock: {selected.stockQuantity}{" "}
                            · {formatMoney(selected.unitCost)} cost ·{" "}
                            {selected.markupPercentage}% markup
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Quantity</Label>

                        <Input
                          type="number"
                          min="0.0001"
                          step="0.0001"
                          value={item.quantity}
                          onChange={(event) =>
                            updateMaterial(index, {
                              quantity:
                                event.target.value === ""
                                  ? 0
                                  : Number(event.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Selling Amount</Label>

                        <div className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm font-medium">
                          {selected
                            ? formatMoney(
                                selected.unitCost *
                                  item.quantity *
                                  (1 + selected.markupPercentage / 100)
                              )
                            : "—"}
                        </div>
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={materials.length === 1}
                          onClick={() =>
                            setMaterials((current) =>
                              current.filter(
                                (_, itemIndex) => itemIndex !== index
                              )
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Labor</h3>

                  <p className="text-sm text-muted-foreground">
                    Select the labor services required for one unit.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setLabor((current) => [...current, createEmptyLabor()])
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Labor
                </Button>
              </div>

              <div className="space-y-3">
                {labor.map((item, index) => {
                  const selected = laborOptions.find(
                    (option) => option.id === item.serviceId
                  )

                  return (
                    <div
                      key={index}
                      className="grid gap-3 rounded-lg border p-4 lg:grid-cols-[minmax(0,1fr)_140px_160px_44px]"
                    >
                      <div className="space-y-2">
                        <Label>Labor Service</Label>

                        <Select
                          value={item.serviceId}
                          onValueChange={(value) =>
                            updateLabor(index, {
                              serviceId: value,
                            })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select labor service" />
                          </SelectTrigger>

                          <SelectContent>
                            {laborOptions.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.serviceName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {selected && (
                          <p className="text-xs text-muted-foreground">
                            {selected.unit} · {formatMoney(selected.laborCost)}{" "}
                            cost · {selected.markupPercentage}% markup
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Quantity</Label>

                        <Input
                          type="number"
                          min="0.0001"
                          step="0.0001"
                          value={item.quantity}
                          onChange={(event) =>
                            updateLabor(index, {
                              quantity:
                                event.target.value === ""
                                  ? 0
                                  : Number(event.target.value),
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Selling Amount</Label>

                        <div className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm font-medium">
                          {selected
                            ? formatMoney(
                                selected.laborCost *
                                  item.quantity *
                                  (1 + selected.markupPercentage / 100)
                              )
                            : "—"}
                        </div>
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={labor.length === 1}
                          onClick={() =>
                            setLabor((current) =>
                              current.filter(
                                (_, itemIndex) => itemIndex !== index
                              )
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <Separator />

            <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Delivery</Label>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    {loadingDelivery ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading delivery information...
                      </div>
                    ) : deliveryError ? (
                      <p className="text-sm text-destructive">
                        {deliveryError}
                      </p>
                    ) : deliveryZone ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-muted-foreground">
                            Delivery Zone
                          </span>

                          <span className="text-sm font-medium">
                            {deliveryZone.zoneName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm text-muted-foreground">
                            Delivery Fee
                          </span>

                          <span className="font-semibold">
                            {formatMoney(deliveryZone.deliveryFee)}
                          </span>
                        </div>

                        <p className="pt-2 text-xs text-muted-foreground">
                          The official delivery fee is verified again by the
                          system when the quotation is sent.
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No delivery information available.
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quotation-notes">Quotation Notes</Label>

                  <Textarea
                    id="quotation-notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Optional notes for this quotation..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-lg border p-4">
                <h3 className="font-semibold">Quotation Summary</h3>

                <SummaryRow
                  label="Materials / unit"
                  value={formatMoney(pricing?.materialSubtotal ?? 0)}
                />

                <SummaryRow
                  label="Labor / unit"
                  value={formatMoney(pricing?.laborSubtotal ?? 0)}
                />

                <SummaryRow
                  label="Unit Price"
                  value={formatMoney(pricing?.unitPrice ?? 0)}
                />

                <SummaryRow label={`Quantity`} value={String(order.quantity)} />

                <Separator />

                <SummaryRow label="Subtotal" value={formatMoney(subtotal)} />

                <SummaryRow
                  label={`VAT (${vatRate}%)`}
                  value={formatMoney(vatAmount)}
                />

                <SummaryRow
                  label="Delivery Fee"
                  value={
                    loadingDelivery
                      ? "Loading..."
                      : deliveryZone
                        ? formatMoney(deliveryFee)
                        : "—"
                  }
                />

                <Separator />

                <Separator />

                <div className="flex items-center justify-between gap-4 text-lg font-bold">
                  <span>Total</span>
                  <span>{formatMoney(totalAmount)}</span>
                </div>
              </div>
            </section>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={
              sending ||
              loadingOptions ||
              loadingDelivery ||
              Boolean(loadError) ||
              Boolean(deliveryError) ||
              !deliveryZone ||
              validMaterials.length === 0 ||
              validLabor.length === 0 ||
              !pricing
            }
            onClick={handleSendQuotation}
          >
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Send Quotation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SummaryRowProps {
  label: string
  value: string
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>

      <span className="font-medium">{value}</span>
    </div>
  )
}
