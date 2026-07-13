import CatalogHeader from "./components/catalog-header";
import ProductGrid from "./components/product-grid";

import { CatalogProduct } from "./types/catalog";

export default function CatalogPage() {

  const products: CatalogProduct[] = [
  {
    id: "1",
    name: "Glass Dining Table",
    category: "Furniture",
    image: "/products/table.jpg",
    width: 180,
    height: 90,
    aluminumSeries: "N/A",
    glassType: "10mm Tempered Glass",
    basePrice: 25000,
    productionDays: 7,
    stockStatus: "Made to Order",
    customizable: true,
  },

  {
    id: "2",
    name: "Aluminum Sliding Window",
    category: "Windows",
    image: "/products/window.jpg",
    width: 150,
    height: 120,
    aluminumSeries: "798 Series",
    glassType: "6mm Clear Glass",
    basePrice: 18500,
    productionDays: 5,
    stockStatus: "Made to Order",
    customizable: true,
  },

  {
    id: "3",
    name: "Glass Office Partition",
    category: "Partitions",
    image: "/products/partition.jpg",
    width: 300,
    height: 240,
    aluminumSeries: "798 Series",
    glassType: "10mm Tempered Glass",
    basePrice: 48000,
    productionDays: 10,
    stockStatus: "Made to Order",
    customizable: true,
  },

  {
    id: "4",
    name: "Frameless Shower Enclosure",
    category: "Bathroom",
    image: "/products/shower.jpg",
    width: 120,
    height: 210,
    aluminumSeries: "N/A",
    glassType: "10mm Tempered Glass",
    basePrice: 32000,
    productionDays: 7,
    stockStatus: "Made to Order",
    customizable: true,
  },

  {
    id: "5",
    name: "Aluminum Swing Door",
    category: "Doors",
    image: "/products/door.jpg",
    width: 90,
    height: 210,
    aluminumSeries: "900 Series",
    glassType: "8mm Frosted Glass",
    basePrice: 22000,
    productionDays: 6,
    stockStatus: "Made to Order",
    customizable: true,
  },

  {
    id: "6",
    name: "Glass Stair Railing",
    category: "Railings",
    image: "/products/railing.jpg",
    width: 400,
    height: 100,
    aluminumSeries: "Heavy Duty",
    glassType: "12mm Tempered Glass",
    basePrice: 65000,
    productionDays: 12,
    stockStatus: "Made to Order",
    customizable: true,
  },

  {
    id: "7",
    name: "Coffee Table",
    category: "Furniture",
    image: "/products/coffee-table.jpg",
    width: 100,
    height: 50,
    aluminumSeries: "N/A",
    glassType: "8mm Tempered Glass",
    basePrice: 12000,
    productionDays: 5,
    stockStatus: "Made to Order",
    customizable: true,
  },

  {
    id: "8",
    name: "Display Cabinet",
    category: "Furniture",
    image: "/products/cabinet.jpg",
    width: 120,
    height: 200,
    aluminumSeries: "6063 Series",
    glassType: "8mm Clear Glass",
    basePrice: 28500,
    productionDays: 8,
    stockStatus: "Made to Order",
    customizable: true,
  },
];

  return (
    <div className="space-y-8">

      <CatalogHeader />

      <ProductGrid
        products={products}
      />

    </div>
  );
}