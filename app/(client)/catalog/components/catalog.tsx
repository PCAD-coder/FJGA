import ProductGrid from "./product-grid"
import { getCatalogProducts } from "../services/catalog"
import CatalogHeader from "./catalog-header"

export default async function Catalog() {
  const products = await getCatalogProducts()

  return (
    <div className="space-y-6">
      <div>
        <CatalogHeader />
      </div>
      

      <ProductGrid products={products} />
    </div>
  )
}