import ProductCard from "./product-card"
import type { CatalogProduct } from "../types/catalog"

interface Props {
  products: CatalogProduct[]
}

export default function ProductGrid({ products }: Props) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,210px),1fr))] gap-x-4 gap-y-7">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
