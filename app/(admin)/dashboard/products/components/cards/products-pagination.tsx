"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (
    page: number
  ) => void
}

export default function ProductsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <Pagination>

      <PaginationContent>

        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() =>
              currentPage > 1 &&
              onPageChange(
                currentPage - 1
              )
            }
          />
        </PaginationItem>

        {Array.from({
          length: totalPages,
        }).map((_, index) => (
          <PaginationItem
            key={index}
          >
            <PaginationLink
              href="#"
              isActive={
                currentPage ===
                index + 1
              }
              onClick={() =>
                onPageChange(
                  index + 1
                )
              }
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() =>
              currentPage <
                totalPages &&
              onPageChange(
                currentPage + 1
              )
            }
          />
        </PaginationItem>

      </PaginationContent>

    </Pagination>
  )
}