"use client"

import { useState } from "react"
import type { DeliveryZone, DeliveryZoneCity } from "../types/delivery-zone"

import EditDeliveryZoneDialog from "./edit-delivery-zone-dialog"
import AddDeliveryZoneDialog from "./add-delivery-zone-dialog"
import RemoveCityFromZoneDialog from "./remove-city-from-zone-dialog"
import ChangeDeliveryZoneStatusDialog from "./change-delivery-zone-status-dialog"
import {
  MapPin,
  PhilippinePeso,
  Plus,
  Pencil,
  MapPinPlus,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

import { useDeliveryZones } from "../hooks/use-delivery-zones"
import AddCityToZoneDialog from "./add-city-to-zone-dialog"
import ManageBarangaysDialog from "./manage-barangays-dialog"

interface ManageDeliveryZonesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ManageDeliveryZonesDialog({
  open,
  onOpenChange,
}: ManageDeliveryZonesDialogProps) {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [addCityOpen, setAddCityOpen] = useState(false)
  const [addCityZone, setAddCityZone] = useState<DeliveryZone | null>(null)
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null)
  const [removeCityOpen, setRemoveCityOpen] = useState(false)
  const [removeCityZone, setRemoveCityZone] = useState<DeliveryZone | null>(
    null
  )
  const [selectedCity, setSelectedCity] = useState<DeliveryZoneCity | null>(
    null
  )
  const [barangayOpen, setBarangayOpen] = useState(false)

  const [barangayCity, setBarangayCity] = useState<DeliveryZoneCity | null>(
    null
  )
  const [statusOpen, setStatusOpen] = useState(false)

  const [statusZone, setStatusZone] = useState<DeliveryZone | null>(null)

  const {
    zones,
    loading,
    creating,
    updating,
    addingCity,
    removingCity,
    changingStatus,
    error,
    addZone,
    editZone,
    addCity,
    removeCity,
    changeZoneStatus,
  } = useDeliveryZones()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <div className="flex flex-col gap-4 pr-8 sm:flex-row sm:items-start sm:justify-between">
          <DialogHeader>
            <DialogTitle>Manage Delivery Zones</DialogTitle>

            <DialogDescription>
              View delivery zones, assigned cities, and delivery fees.
            </DialogDescription>
          </DialogHeader>

          <Button
            type="button"
            size="sm"
            className="shrink-0"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Zone
          </Button>
        </div>

        <Separator />

        {loading && (
          <div className="py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Loading delivery zones...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-destructive/50 p-4">
            <p className="text-sm font-medium text-destructive">
              Failed to load delivery zones
            </p>

            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        )}

        {!loading && !error && zones.length === 0 && (
          <div className="py-10 text-center">
            <MapPin className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-3 font-semibold">No Delivery Zones</h3>

            <p className="mt-1 text-sm text-muted-foreground">
              No delivery zones have been configured yet.
            </p>
          </div>
        )}

        {!loading && !error && zones.length > 0 && (
          <div className="space-y-4">
            {zones.map((zone) => (
              <div key={zone.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{zone.zoneName}</h3>

                      <Badge variant={zone.isActive ? "default" : "secondary"}>
                        {zone.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    {zone.description && (
                      <p className="text-sm text-muted-foreground">
                        {zone.description}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <div className="flex items-center gap-1 text-lg font-semibold">
                      <PhilippinePeso className="h-4 w-4" />

                      {zone.deliveryFee.toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAddCityZone(zone)
                        setAddCityOpen(true)
                      }}
                    >
                      <MapPinPlus className="mr-2 h-4 w-4" />
                      Add City
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedZone(zone)
                        setEditOpen(true)
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant={zone.isActive ? "outline" : "default"}
                      size="sm"
                      onClick={() => {
                        setStatusZone(zone)
                        setStatusOpen(true)
                      }}
                    >
                      {zone.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  {zone.cities.length === 0 ? (
                    <div>
                      <p className="mb-2 text-sm font-medium">
                        Assigned Cities
                      </p>

                      <p className="text-sm text-muted-foreground">
                        No cities assigned to this zone.
                      </p>
                    </div>
                  ) : (
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-1 py-2 text-sm font-medium transition-colors hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
                        <div className="flex items-center gap-2">
                          <span>Assigned Cities</span>

                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                            {zone.cities.length}
                          </span>
                        </div>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </summary>

                      <div className="mt-2 space-y-2">
                        {zone.cities.map((city) => (
                          <div
                            key={city.id}
                            className="flex items-center justify-between gap-3 rounded-md border p-3"
                          >
                            <div className="flex min-w-0 items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                              <div className="min-w-0">
                                <p className="text-sm font-medium">
                                  {city.cityName}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {[city.provinceName, city.regionName]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setBarangayCity(city)
                                  setBarangayOpen(true)
                                }}
                              >
                                Barangays
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                title={`Remove ${city.cityName}`}
                                onClick={() => {
                                  setRemoveCityZone(zone)
                                  setSelectedCity(city)
                                  setRemoveCityOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />

                                <span className="sr-only">
                                  Remove {city.cityName}
                                </span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
      <AddDeliveryZoneDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        creating={creating}
        onCreate={async (input) => {
          await addZone(input)
        }}
      />
      <EditDeliveryZoneDialog
        zone={selectedZone}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open)

          if (!open) {
            setSelectedZone(null)
          }
        }}
        updating={updating}
        onUpdate={async (zoneId, input) => {
          await editZone(zoneId, input)
        }}
      />
      <AddCityToZoneDialog
        zone={addCityZone}
        open={addCityOpen}
        onOpenChange={(open) => {
          setAddCityOpen(open)

          if (!open) {
            setAddCityZone(null)
          }
        }}
        addingCity={addingCity}
        onAddCity={async (zoneId, cityPsgcCode) => {
          await addCity(zoneId, cityPsgcCode)
        }}
      />
      <RemoveCityFromZoneDialog
        zone={removeCityZone}
        city={selectedCity}
        open={removeCityOpen}
        onOpenChange={(open) => {
          setRemoveCityOpen(open)

          if (!open) {
            setRemoveCityZone(null)
            setSelectedCity(null)
          }
        }}
        removingCity={removingCity}
        onRemoveCity={async (zoneId, cityPsgcCode) => {
          await removeCity(zoneId, cityPsgcCode)
        }}
      />
      <ManageBarangaysDialog
        city={barangayCity}
        open={barangayOpen}
        onOpenChange={(open) => {
          setBarangayOpen(open)

          if (!open) {
            setBarangayCity(null)
          }
        }}
      />
      <ChangeDeliveryZoneStatusDialog
        zone={statusZone}
        open={statusOpen}
        onOpenChange={(open) => {
          setStatusOpen(open)

          if (!open) {
            setStatusZone(null)
          }
        }}
        changingStatus={changingStatus}
        onChangeStatus={async (zoneId, isActive) => {
          await changeZoneStatus(zoneId, isActive)
        }}
      />
    </Dialog>
  )
}
