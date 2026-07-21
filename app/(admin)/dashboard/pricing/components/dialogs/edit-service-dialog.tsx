"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { LaborPricing } from "../../types/pricing";
import { updateLaborPricing } from "../../services/pricing-service";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  service: LaborPricing | null;

  refresh: () => Promise<void>;
}

export default function EditServiceDialog({
  open,
  onOpenChange,
  service,
  refresh,
}: Props) {
  const [serviceName, setServiceName] = useState("");

  const [description, setDescription] = useState("");

  const [unit, setUnit] = useState("");

  const [laborCost, setLaborCost] = useState(0);

  const [markup, setMarkup] = useState(0);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!service) return;

    setServiceName(service.service_name);
    setDescription(service.description ?? "");
    setUnit(service.unit);
    setLaborCost(service.labor_cost);
    setMarkup(service.markup_percentage);
  }, [service]);

    const sellingPrice = useMemo(() => {
    return laborCost * (1 + markup / 100);
  }, [laborCost, markup]);

  if (!service) return null;

  // TypeScript-safe reference
  const selectedService = service;

  async function handleSave() {
    try {
      setSaving(true);

      await updateLaborPricing(selectedService.id, {
        labor_cost: laborCost,
        markup_percentage: markup,
      });

      await refresh();

      onOpenChange(false);
    } catch (error) {
      console.error("Update Labor Pricing:", error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">

        <DialogHeader>
          <DialogTitle>
            Update Labor Pricing
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Service Name
            </label>

            <Input
              value={serviceName}
              disabled
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <Input
              value={description}
              disabled
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Unit
            </label>

            <Input
              value={unit}
              disabled
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Labor Cost
            </label>

            <Input
              type="number"
              value={laborCost}
              onChange={(e) =>
                setLaborCost(Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Markup Percentage
            </label>

            <Input
              type="number"
              value={markup}
              onChange={(e) =>
                setMarkup(Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Selling Price
            </label>

            <Input
              value={`₱${sellingPrice.toFixed(2)}`}
              disabled
            />
          </div>

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}