"use client"

import { useState } from "react"
import {
  Archive,
  CalendarClock,
  MoreVertical,
  PackagePlus,
  Pencil,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type {
  InventoryMaterial,
  InventoryUpdate,
} from "../../types/inventory"
import type {
  DisposeExpiredBatchInput,
  EnableExpirationTrackingInput,
  InitializeExpirationStockInput,
} from "../../services/inventory.service"

import { ArchiveMaterialDialog } from "../dialogs/archive-material-dialog"
import { DisposeExpiredStockDialog } from "../dialogs/dispose-expired-stock-dialog"
import { EditMaterialDialog } from "../dialogs/edit-material-dialog"
import { EnableExpirationTrackingDialog } from "../dialogs/enable-expiration-tracking-dialog"
import { InitializeExpirationStockDialog } from "../dialogs/initialize-expiration-stock-dialog"
import { RestockMaterialDialog } from "../dialogs/restock-material-dialog"

import { useCategories } from "../../hooks/use-categories"

interface InventoryTableProps {
  materials: InventoryMaterial[]

  onEditMaterial: (
    id: string,
    form: InventoryUpdate
  ) => Promise<void>

  onArchiveMaterial: (
    id: string
  ) => Promise<void>

  onRestock: (input: {
    materialId: string
    quantity: number
    notes?: string
    batchNumber?: string
    receivedAt?: string
    expirationDate?: string
  }) => Promise<unknown>

  onInitializeExpirationStock: (
    input: InitializeExpirationStockInput
  ) => Promise<unknown>

  onEnableExpirationTracking: (
    input: EnableExpirationTrackingInput
  ) => Promise<unknown>

  onDisposeExpiredBatch: (
    input: DisposeExpiredBatchInput
  ) => Promise<unknown>
}

function getStatus(
  stock: number,
  minimumStock: number
) {
  if (stock === 0) {
    return {
      label: "Out of Stock",
      variant: "destructive" as const,
    }
  }

  if (stock <= minimumStock) {
    return {
      label: "Low Stock",
      variant: "secondary" as const,
    }
  }

  return {
    label: "Healthy",
    variant: "default" as const,
  }
}

export function InventoryTable({
  materials,
  onEditMaterial,
  onArchiveMaterial,
  onRestock,
  onInitializeExpirationStock,
  onEnableExpirationTracking,
  onDisposeExpiredBatch,
}: InventoryTableProps) {
  const [initializeMaterial, setInitializeMaterial] =
    useState<InventoryMaterial | null>(null)

  const { categories } = useCategories()

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Series</TableHead>
                <TableHead>Finish / Type</TableHead>
                <TableHead>Thickness</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Minimum Stock</TableHead>
                <TableHead>Status</TableHead>

                <TableHead className="w-[60px] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {materials.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No materials found.
                  </TableCell>
                </TableRow>
              ) : (
                materials.map((material) => {
                  const status = getStatus(
                    material.stock_quantity,
                    material.minimum_stock
                  )

                  const category = categories.find(
                    (item) =>
                      item.category_name === material.category
                  )

                  const categorySupportsExpiration =
                    category?.tracks_expiration_by_default ?? false

                  const canEnableExpirationTracking =
                    !material.tracks_expiration &&
                    material.stock_quantity > 0 &&
                    categorySupportsExpiration

                  const canInitializeExpirationStock =
                    material.tracks_expiration &&
                    material.unbatched_quantity > 0

                  const hasExpiredStock =
                    material.tracks_expiration &&
                    material.expired_quantity > 0

                  const hasExpirationActions =
                    canEnableExpirationTracking ||
                    canInitializeExpirationStock ||
                    hasExpiredStock

                  return (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.material_name}
                      </TableCell>

                      <TableCell>
                        {material.category}
                      </TableCell>

                      <TableCell>
                        {material.series ?? "—"}
                      </TableCell>

                      <TableCell>
                        {material.specification}
                      </TableCell>

                      <TableCell>
                        {material.thickness ?? "—"}
                      </TableCell>

                      <TableCell>
                        {material.size}
                      </TableCell>

                      <TableCell>
                        {material.unit}
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {material.stock_quantity}
                          </div>

                          {material.tracks_expiration && (
                            <div className="space-y-1">
                              {material.expired_quantity > 0 && (
                                <div>
                                  <Badge variant="destructive">
                                    {material.expired_quantity} expired
                                  </Badge>
                                </div>
                              )}

                              {material.expiring_soon_quantity > 0 && (
                                <div>
                                  <Badge variant="secondary">
                                    {material.expiring_soon_quantity}{" "}
                                    expiring soon
                                  </Badge>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        {material.minimum_stock}
                      </TableCell>

                      <TableCell>
                        <Badge variant={status.variant}>
                          {status.label}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              aria-label={`Actions for ${material.material_name}`}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="w-60"
                          >
                            <DropdownMenuLabel>
                              Material Actions
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <RestockMaterialDialog
                              material={material}
                              onRestock={onRestock}
                              trigger={
                                <DropdownMenuItem
                                  onSelect={(event) =>
                                    event.preventDefault()
                                  }
                                >
                                  <PackagePlus className="mr-2 h-4 w-4" />
                                  Restock
                                </DropdownMenuItem>
                              }
                            />

                            <EditMaterialDialog
                              material={material}
                              onSubmit={onEditMaterial}
                              trigger={
                                <DropdownMenuItem
                                  onSelect={(event) =>
                                    event.preventDefault()
                                  }
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Material
                                </DropdownMenuItem>
                              }
                            />

                            {hasExpirationActions && (
                              <DropdownMenuSeparator />
                            )}

                            {canEnableExpirationTracking && (
                              <EnableExpirationTrackingDialog
                                material={material}
                                onSubmit={onEnableExpirationTracking}
                                trigger={
                                  <DropdownMenuItem
                                    onSelect={(event) =>
                                      event.preventDefault()
                                    }
                                  >
                                    <CalendarClock className="mr-2 h-4 w-4" />
                                    Enable Expiration Tracking
                                  </DropdownMenuItem>
                                }
                              />
                            )}

                            {canInitializeExpirationStock && (
                              <DropdownMenuItem
                                onSelect={() => {
                                  setInitializeMaterial(material)
                                }}
                              >
                                <CalendarClock className="mr-2 h-4 w-4" />
                                Initialize Expiration Stock
                              </DropdownMenuItem>
                            )}

                            {hasExpiredStock && (
                              <DisposeExpiredStockDialog
                                material={material}
                                onDispose={onDisposeExpiredBatch}
                                trigger={
                                  <DropdownMenuItem
                                    onSelect={(event) =>
                                      event.preventDefault()
                                    }
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Dispose Expired Stock
                                  </DropdownMenuItem>
                                }
                              />
                            )}

                            <DropdownMenuSeparator />

                            <ArchiveMaterialDialog
                              material={material}
                              onArchive={onArchiveMaterial}
                              trigger={
                                <DropdownMenuItem
                                  onSelect={(event) =>
                                    event.preventDefault()
                                  }
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archive Material
                                </DropdownMenuItem>
                              }
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InitializeExpirationStockDialog
        material={initializeMaterial}
        open={initializeMaterial !== null}
        onOpenChange={(open) => {
          if (!open) {
            setInitializeMaterial(null)
          }
        }}
        onInitialize={onInitializeExpirationStock}
      />
    </>
  )
}