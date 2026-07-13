import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Clock3,
  Hammer,
  Package,
  Truck,
  Wrench,
  Calculator,
} from "lucide-react";

import { CustomizationRequest } from "../types/customization";

interface Props {
  request: CustomizationRequest;
}

export default function QuoteSummary({
  request,
}: Props) {
  return (
    <Card className="sticky top-6">

      <CardHeader>

        <CardTitle>

          Estimated Quotation

        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-6">

        {/* Total */}

        <div className="rounded-xl bg-primary/5 p-5 text-center">

          <p className="text-sm text-muted-foreground">
            Estimated Total
          </p>

          <h2 className="mt-2 text-3xl font-bold text-primary">
            ₱{request.estimatedQuote.toLocaleString()}
          </h2>

          <Badge className="mt-3">
            Subject to Final Verification
          </Badge>

        </div>

        <Separator />

        {/* Breakdown */}

        <div className="space-y-4">

          <h3 className="font-semibold">

            Cost Breakdown

          </h3>

          <div className="flex justify-between">

            <div className="flex items-center gap-2">

              <Package className="h-4 w-4"/>

              Materials

            </div>

            <span>
              ₱{request.breakdown.materials.toLocaleString()}
            </span>

          </div>

          <div className="flex justify-between">

            <div className="flex items-center gap-2">

              <Hammer className="h-4 w-4"/>

              Fabrication

            </div>

            <span>
              ₱{request.breakdown.fabrication.toLocaleString()}
            </span>

          </div>

          <div className="flex justify-between">

            <div className="flex items-center gap-2">

              <Wrench className="h-4 w-4"/>

              Accessories

            </div>

            <span>
              ₱{request.breakdown.accessories.toLocaleString()}
            </span>

          </div>

          <div className="flex justify-between">

            <div className="flex items-center gap-2">

              <Calculator className="h-4 w-4"/>

              Installation

            </div>

            <span>
              ₱{request.breakdown.installation.toLocaleString()}
            </span>

          </div>

          <div className="flex justify-between">

            <div className="flex items-center gap-2">

              <Truck className="h-4 w-4"/>

              Delivery

            </div>

            <span>
              ₱{request.breakdown.delivery.toLocaleString()}
            </span>

          </div>

        </div>

        <Separator />

        {/* Production */}

        <div className="space-y-3">

          <h3 className="font-semibold">

            Production

          </h3>

          <div className="flex items-center gap-2">

            <Clock3 className="h-4 w-4"/>

            <span>

              Estimated Production Time:

            </span>

          </div>

          <Badge variant="secondary">

            {request.estimatedProductionDays} Working Days

          </Badge>

        </div>

        <Separator />

        {/* Notes */}

        <div className="rounded-lg border bg-muted/40 p-4">

          <p className="text-xs leading-relaxed text-muted-foreground">

            This quotation is automatically generated based on your selected
            dimensions and materials. Final pricing may change after
            measurement verification and project assessment by FJ Glass &
            Aluminum.

          </p>

        </div>

        <Button
          className="w-full"
          size="lg"
        >
          Request Official Quotation
        </Button>

      </CardContent>

    </Card>
  );
}