import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import ProductSelector from "./product-selector";
import DimensionInput from "./dimension-input";
import AluminumSelector from "./aluminum-selector";
import GlassSelector from "./glass-selector";
import FinishSelector from "./finish-selector";
import ColorSelector from "./color-selector";
import ReferenceUpload from "./reference-upload";
import TimelinePicker from "./timeline-picker";

import {
  products,
  aluminumSeries,
  glassMaterials,
  frameFinishes,
  mockCustomization,
} from "../data/customization-data";

export default function CustomizationForm() {
  return (
    <Card>

      <CardHeader>

        <CardTitle>

          Product Configuration

        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-6">

        {/* Product Specifications */}

        <div className="space-y-5">

          <div>

            <h3 className="text-sm font-semibold">
              Specifications
            </h3>

            <p className="text-xs text-muted-foreground">
              Configure the dimensions and materials of your product.
            </p>

          </div>

          <Separator />

          <ProductSelector
            products={products}
            value={mockCustomization.productId}
          />

          <div className="grid grid-cols-2 gap-4">

            <DimensionInput
              label="Width"
              value={mockCustomization.width}
            />

            <DimensionInput
              label="Height"
              value={mockCustomization.height}
            />

          </div>

          <AluminumSelector
            series={aluminumSeries}
            value={mockCustomization.aluminumSeriesId}
          />

          <GlassSelector
            materials={glassMaterials}
            value={mockCustomization.glassMaterialId}
          />

          <FinishSelector
            finishes={frameFinishes}
            value={mockCustomization.frameFinishId}
          />

          <ColorSelector
            finishes={frameFinishes}
          />

        </div>

        <Separator />

        {/* Additional Details */}

        <div className="space-y-5">

          <div>

            <h3 className="text-sm font-semibold">
              Additional Details
            </h3>

            <p className="text-xs text-muted-foreground">
              Upload a reference image and choose your preferred completion date.
            </p>

          </div>

          <ReferenceUpload />

          <TimelinePicker />

        </div>

        <Separator />

        <Button
          className="w-full"
          size="lg"
        >
          Submit Custom Request
        </Button>

      </CardContent>

    </Card>
  );
}