"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { archiveLaborService } from "../../services/pricing-service";

import { LaborPricing } from "../../types/pricing";

interface Props {
  open: boolean;

  onOpenChange: (open: boolean) => void;

  service: LaborPricing | null;

  refresh: () => Promise<void>;
}

export default function ArchiveServiceDialog({
  open,
  onOpenChange,
  service,
  refresh,
}: Props) {
  if (!service) return null;
  const selectedService = service;

  async function handleArchive() {
    try {
      await archiveLaborService(selectedService.id);

      await refresh();

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Archive Labor Service
          </DialogTitle>

        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to archive
          <strong> {service.service_name}</strong>?
        </p>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleArchive}
          >
            Archive
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}