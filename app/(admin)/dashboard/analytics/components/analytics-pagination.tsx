import { Button } from "@/components/ui/button"

export default function AnalyticsPagination({
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
  if (!total) return null
  const totalPages = Math.max(1, Math.ceil(total / 10))
  return (
    <nav
      aria-label={`${label} pagination`}
      className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3"
    >
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          {page} / {totalPages}
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
