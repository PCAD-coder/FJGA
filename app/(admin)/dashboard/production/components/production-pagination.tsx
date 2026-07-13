"use client"

import { Button } from "@/components/ui/button"

interface ProductsPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function ProductsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductsPaginationProps) {
  return (
    <div className="flex justify-center gap-2 pt-4">

      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        Previous
      </Button>

      <span className="flex items-center px-4 text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        Next
      </Button>

    </div>
  )
}