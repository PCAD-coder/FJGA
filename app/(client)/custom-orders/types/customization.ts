// custom-orders/types/customization.ts

export interface ProductOption {
  id: string;
  name: string;
  image: string;
}

export interface AluminumSeries {
  id: string;
  name: string;
}

export interface GlassMaterial {
  id: string;
  name: string;
}

export interface FrameFinish {
  id: string;
  name: string;
  color: string;
}

export interface QuoteBreakdown {
  materials: number;
  fabrication: number;
  accessories: number;
  installation: number;
  delivery: number;
}

export interface CustomizationRequest {
  productId: string;

  width: number;
  height: number;

  aluminumSeriesId: string;
  glassMaterialId: string;
  frameFinishId: string;

  preferredDate: string;

  referenceImages: string[];

  estimatedProductionDays: number;

  estimatedQuote: number;

  breakdown: QuoteBreakdown;
}