import CategoryFilter from "./category-filter";

export default function CatalogHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div>

        <h1 className="text-3xl font-bold">
          Product Catalog
        </h1>

        <p className="text-muted-foreground">
          Browse our pre-made glass and aluminum products
        </p>

      </div>

      <CategoryFilter />

    </div>
  );
}