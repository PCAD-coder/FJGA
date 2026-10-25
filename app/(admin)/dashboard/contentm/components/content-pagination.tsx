import { Button } from "@/components/ui/button"

export default function ContentPagination({
  total,
  page,
  onPageChange,
  label,
}: {
  total: number
  page: number
  onPageChange: (page: number) => void
  label: string
}) {
  if (total === 0) return null
  const totalPages = Math.max(1, Math.ceil(total / 10))
  return (
    <nav
      aria-label={`${label} pagination`}
      className="mt-4 flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <p aria-live="polite" className="text-sm text-muted-foreground">
        Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total}{" "}
        records
      </p>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  )
}
