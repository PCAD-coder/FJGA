import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function CatalogHeader() {
  return (
    <header className="border-b border-border/70 pb-8 sm:pb-10">
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight aria-hidden="true" className="size-3" />
        <span aria-current="page" className="text-foreground">
          Catalog
        </span>
      </nav>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end md:gap-12">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
            The collection
          </p>
          <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Made for your space.
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-7 text-muted-foreground md:pb-1">
          Explore glass and aluminum furniture and fixtures. Find the right
          piece to bring your space together.
        </p>
      </div>
    </header>
  )
}
