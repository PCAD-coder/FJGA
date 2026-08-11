import ProductCard from "./product-card"
import type { CatalogProduct } from "../types/catalog"

interface Props {
  products: CatalogProduct[]
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}