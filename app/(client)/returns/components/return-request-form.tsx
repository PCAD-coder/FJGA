"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import OrderSelector from "./order-selector";
import PhotoUpload from "./photo-upload";
import SelectedOrderCard from "./selected-order-card";

import {
  createReturnRequest,
  uploadReturnPhotos,
} from "../services/return-service";

import type { CustomerOrder } from "../types/return";

interface Props {
  orders: CustomerOrder[];
  onSubmitted?: () => void;
}

export default function ReturnRequestForm({
  orders,
  onSubmitted,
}: Props) {
  const [selectedOrder, setSelectedOrder] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [photos, setPhotos] = useState<FileList | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selected = orders.find(
    (order) => order.id === selectedOrder
  );

  async function handleSubmit() {
    setError(null);
    setSuccess(null);

    if (!selectedOrder) {
      setError("Please select an order.");
      return;
    }

    if (!selected?.eligible) {
      setError("The selected order is not eligible for a return.");
      return;
    }

    if (!issueType) {
      setError("Please select an issue type.");
      return;
    }

    if (description.trim().length < 50) {
      setError(
        "Please provide at least 50 characters describing the issue."
      );
      return;
    }if (photos && photos.length > 5) {
  setError("You can upload a maximum of 5 photos.");
  return;
}

if (photos) {
  for (const file of Array.from(photos)) {
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError(
        `"${file.name}" is not a supported image file. Please upload JPG or PNG images.`
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        `"${file.name}" exceeds the 10 MB file size limit.`
      );
      return;
    }
  }
}

    try {
      setSubmitting(true);

      const returnRequest = await createReturnRequest({
        orderId: selectedOrder,
        issueType,
        description,
        contactNumber,
      });
      if (photos && photos.length > 0) {
  await uploadReturnPhotos(
    returnRequest.id,
    photos
  );
}

      setSuccess(
        `Return request ${returnRequest.return_number} has been submitted.`
      );

      setSelectedOrder("");
      setIssueType("");
      setDescription("");
      setContactNumber("");

      onSubmitted?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit return request."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 rounded-xl border bg-card p-6">
      <h2 className="text-xl font-semibold">
        Report an Issue
      </h2>

      <OrderSelector
        orders={orders}
        value={selectedOrder}
        onChange={setSelectedOrder}
      />

      {selected && (
        <SelectedOrderCard order={selected} />
      )}

      <div className="space-y-2">
        <Label>2. Issue Type</Label>

        <Select
          value={issueType}
          onValueChange={setIssueType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select issue type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="Damaged">
              Damaged Product
            </SelectItem>

            <SelectItem value="Wrong Item">
              Wrong Item Delivered
            </SelectItem>

            <SelectItem value="Missing Parts">
              Missing Parts
            </SelectItem>

            <SelectItem value="Wrong Dimensions">
              Wrong Dimensions
            </SelectItem>

            <SelectItem value="Glass Defect">
              Glass Defect
            </SelectItem>

            <SelectItem value="Others">
              Others
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>3. Detailed Description</Label>

        <Textarea
          rows={5}
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Please describe the issue in detail. Include information about when you discovered the problem, what specifically is wrong, and any other relevant details..."
        />

        <p className="text-xs text-muted-foreground">
          Minimum 50 characters. Be as specific as possible.
        </p>
      </div>

      <PhotoUpload
  onChange={setPhotos}
  disabled={submitting}
/>

      <div className="space-y-2">
        <Label>
          5. Contact Number (Optional)
        </Label>

        <Input
          value={contactNumber}
          onChange={(event) =>
            setContactNumber(event.target.value)
          }
          placeholder="0917-XXX-XXXX"
        />

        <p className="text-xs text-muted-foreground">
          For faster resolution, we may need to contact you.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting
          ? "Submitting..."
          : "Submit Return Request"}
      </Button>
    </div>
  );
}