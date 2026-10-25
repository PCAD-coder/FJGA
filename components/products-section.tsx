
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getCatalogProducts } from "@/app/(client)/catalog/services/catalog"

export default async function ProductsSection() {
  const products = await getCatalogProducts()

  const featuredProducts = products.slice(0, 4)

  return (
    <section
      id="products"
      className="scroll-mt-20 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section heading */}
        <div className="flex flex-col gap-6 border-b pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.28em] text-muted-foreground uppercase">
              Our Products
            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight font-medium tracking-tight sm:text-5xl">
              Products Built for Your Space
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
              Explore our selection of glass and aluminum products designed
              for residential, office, and commercial spaces.
            </p>
          </div>

          <Button
            asChild
            variant="ghost"
            className="group w-fit px-0 hover:bg-transparent"
          >
            <Link href="/catalog">
              View All Products
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Products */}
        {featuredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-muted-foreground">
              No products are currently available.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <article
                key={product.id}
                className="group"
              >
                {/* Product image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                {/* Product details */}
                <div className="pt-5">
                  <h3 className="text-base font-semibold">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {product.description}
                    </p>
                  )}

                  {product.sellingPrice > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-xs text-muted-foreground">
                        Starts at
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        ₱
                        {product.sellingPrice.toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
