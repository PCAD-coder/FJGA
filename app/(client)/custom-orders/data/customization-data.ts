// custom-orders/data/customization-data.ts

import {
  ProductOption,
  AluminumSeries,
  GlassMaterial,
  FrameFinish,
  CustomizationRequest,
} from "../types/customization";

export const products: ProductOption[] = [
  {
    id: "window-sliding",
    name: "Sliding Window",
    image: "/products/sliding-window.jpg",
  },
  {
    id: "window-casement",
    name: "Casement Window",
    image: "/products/casement-window.jpg",
  },
  {
    id: "door-sliding",
    name: "Sliding Door",
    image: "/products/sliding-door.jpg",
  },
  {
    id: "door-swing",
    name: "Swing Door",
    image: "/products/swing-door.jpg",
  },
  {
    id: "office-partition",
    name: "Office Partition",
    image: "/products/office-partition.jpg",
  },
  {
    id: "shower-enclosure",
    name: "Shower Enclosure",
    image: "/products/shower-enclosure.jpg",
  },
];

export const aluminumSeries: AluminumSeries[] = [
  {
    id: "6063",
    name: "6063-T5",
  },
  {
    id: "798",
    name: "798 Series",
  },
  {
    id: "900",
    name: "900 Series",
  },
];

export const glassMaterials: GlassMaterial[] = [
  {
    id: "clear6",
    name: "6mm Clear Glass",
  },
  {
    id: "temp8",
    name: "8mm Tempered Glass",
  },
  {
    id: "temp10",
    name: "10mm Tempered Glass",
  },
  {
    id: "frost12",
    name: "12mm Frosted Glass",
  },
];

export const frameFinishes: FrameFinish[] = [
  {
    id: "white",
    name: "Powder Coated White",
    color: "#FFFFFF",
  },
  {
    id: "black",
    name: "Matte Black",
    color: "#111111",
  },
  {
    id: "silver",
    name: "Silver",
    color: "#C0C0C0",
  },
  {
    id: "bronze",
    name: "Bronze",
    color: "#8C6239",
  },
  {
    id: "champagne",
    name: "Champagne",
    color: "#C7A56B",
  },
];

export const mockCustomization: CustomizationRequest = {
  productId: "window-sliding",

  width: 150,

  height: 120,

  aluminumSeriesId: "6063",

  glassMaterialId: "temp10",

  frameFinishId: "black",

  preferredDate: "",

  referenceImages: [],

  estimatedProductionDays: 7,

  estimatedQuote: 37200,

  breakdown: {
    materials: 18000,
    fabrication: 9000,
    accessories: 5200,
    installation: 3000,
    delivery: 2000,
  },
};