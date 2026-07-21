"use client";

import { Card, CardContent } from "@/components/ui/card";

interface PricingKPIsProps {
  totalMaterials: number;
  totalServices: number;
  averageMaterialMarkup: number;
  averageLaborMarkup: number;
}

export default function PricingKPIs({
  totalMaterials,
  totalServices,
  averageMaterialMarkup,
  averageLaborMarkup,
}: PricingKPIsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Materials
          </p>

          <h2 className="text-3xl font-bold">
            {totalMaterials}
          </h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Labor Services
          </p>

          <h2 className="text-3xl font-bold">
            {totalServices}
          </h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Avg Material Markup
          </p>

          <h2 className="text-3xl font-bold">
            {averageMaterialMarkup.toFixed(1)}%
          </h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Avg Labor Markup
          </p>

          <h2 className="text-3xl font-bold">
            {averageLaborMarkup.toFixed(1)}%
          </h2>
        </CardContent>
      </Card>
    </div>
  );
}