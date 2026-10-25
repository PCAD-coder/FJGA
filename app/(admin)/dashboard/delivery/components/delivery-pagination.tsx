"use client"

import { Button } from "@/components/ui/button"

interface DeliveryPaginationProps {
  currentPage: number

  totalPages: number

  onPageChange: (page: number) => void
}

export default function DeliveryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: DeliveryPaginationProps) {
  return (
    <nav aria-label="Delivery pagination" className="flex items-center gap-3">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </nav>
  )
}
