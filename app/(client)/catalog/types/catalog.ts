export type ProductCategory =
  | "Furniture"
  | "Windows"
  | "Doors"
  | "Partitions"
  | "Bathroom"
  | "Railings";

export type StockStatus =
  | "In Stock"
  | "Made to Order"
  | "Out of Stock";

export interface CatalogProduct {
  id: string;

  name: string;

  category: ProductCategory;

  image: string;

  width: number;

  height: number;

  aluminumSeries: string;

  glassType: string;

  basePrice: number;

  productionDays: number;

  stockStatus: StockStatus;

  customizable: boolean;
}