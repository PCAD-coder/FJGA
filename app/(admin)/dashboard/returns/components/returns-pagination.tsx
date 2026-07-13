"use client"

import { Button } from "@/components/ui/button"

interface Props {
  currentPage: number

  totalPages: number

  onPageChange: (
    page: number
  ) => void
}

export default function ReturnsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-2">

      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(
            currentPage - 1
          )
        }
      >
        Previous
      </Button>

      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={
          currentPage === totalPages
        }
        onClick={() =>
          onPageChange(
            currentPage + 1
          )
        }
      >
        Next
      </Button>

    </div>
  )
}