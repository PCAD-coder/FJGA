// app/(client)/client-dashboard/custom-orders/page.tsx

import CustomizationForm from "./components/customization-form";
import PreviewCanvas from "./components/preview-canvas";
import SpecificationSummary from "./components/specification-summary";
import QuoteSummary from "./components/quote-summary";

import {
  mockCustomization,
  products,
  aluminumSeries,
  glassMaterials,
  frameFinishes,
} from "./data/customization-data";

export default function CustomOrdersPage() {
  const selectedProduct =
    products.find(
      (product) => product.id === mockCustomization.productId
    );

  const selectedAluminum =
    aluminumSeries.find(
      (series) =>
        series.id === mockCustomization.aluminumSeriesId
    );

  const selectedGlass =
    glassMaterials.find(
      (glass) =>
        glass.id === mockCustomization.glassMaterialId
    );

  const selectedFinish =
    frameFinishes.find(
      (finish) =>
        finish.id === mockCustomization.frameFinishId
    );

  return (
    <div className="space-y-6">

      {/* Page Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Custom Orders
        </h1>

        <p className="text-muted-foreground">
          Configure your aluminum and glass furniture based on your preferred
          dimensions, materials, and finish.
        </p>

      </div>

      {/* Three-Column Layout */}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr_340px]">

        {/* Left Panel */}

        <CustomizationForm />

        {/* Center Panel */}

        <div className="space-y-6">

          <PreviewCanvas
            image={
              selectedProduct?.image ??
              "/products/placeholder.jpg"
            }
            width={mockCustomization.width}
            height={mockCustomization.height}
          />

          <SpecificationSummary
            product={
              selectedProduct?.name ?? "-"
            }
            width={mockCustomization.width}
            height={mockCustomization.height}
            aluminum={
              selectedAluminum?.name ?? "-"
            }
            glass={
              selectedGlass?.name ?? "-"
            }
            finish={
              selectedFinish?.name ?? "-"
            }
          />

        </div>

        {/* Right Panel */}

        <QuoteSummary
          request={mockCustomization}
        />

      </div>

    </div>
  );
}