"use client";

import { useState } from "react";
import { Invoice } from "../types/payment";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  invoice: Invoice;
}

export default function PaymentDialog({ invoice }: Props) {
  const [paymentMethod, setPaymentMethod] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          Pay Now
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Details */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Invoice No.
              </span>

              <span>{invoice.invoiceId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Order ID
              </span>

              <span>{invoice.orderId}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Amount Due
              </span>

              <span className="font-bold">
                ₱{invoice.amountDue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Payment Method</Label>

            <Select onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="gcash">
                  GCash
                </SelectItem>

                <SelectItem value="bank">
                  Bank Transfer
                </SelectItem>

                <SelectItem value="cod">
                  Cash on Delivery
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reference Number */}
          <div className="space-y-2">
            <Label>Reference Number</Label>

            <Input placeholder="Enter reference number" />
          </div>

          {/* Upload */}
          <div className="space-y-2">
            <Label>Upload Proof of Payment</Label>

            <Input type="file" />
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label>Remarks (Optional)</Label>

            <Input placeholder="Additional remarks..." />
          </div>

          <Button className="w-full">
            Submit Payment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}