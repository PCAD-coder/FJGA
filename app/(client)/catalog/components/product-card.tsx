"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Ruler } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CatalogProduct } from "../types/catalog"

interface Props {
  product: CatalogProduct
}

export default function ProductCard({ product }: Props) {
  const VAT_RATE = 0.12

  const vatInclusivePrice = product.sellingPrice * (1 + VAT_RATE)
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[3/2] w-full overflow-hidden border-b border-border/60 bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="text-sm leading-snug font-medium tracking-tight wrap-break-word">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {product.description ||
            "Custom glass and aluminum furniture product."}
        </p>

        <div className="mt-auto pt-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Ruler aria-hidden="true" className="size-3.5 shrink-0" />
            <span>
              <span className="sr-only">Dimensions: </span>
              {product.width} × {product.height}
              {product.depth > 0 ? ` × ${product.depth}` : ""} cm
            </span>
          </div>

          <div className="mt-3 border-t border-border/70 pt-3">
            <p className="text-xs text-muted-foreground">
              Starts at (VAT included)
            </p>
            <p className="mt-0.5 text-lg font-semibold tracking-tight tabular-nums">
              ₱
              {vatInclusivePrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="mt-3">
            <Button
              asChild
              className="h-9 w-full min-w-0 rounded-md px-2 text-xs shadow-none"
            >
              <Link href={`/catalog/${product.id}`}>
                Order <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
