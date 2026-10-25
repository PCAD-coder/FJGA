"use client"

import { useState } from "react"
import AnalyticsPagination from "./analytics-pagination"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { TopProduct } from "../types/analytics"

interface Props {
  products: TopProduct[]
}

export default function TopProductsTable({ products }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const page = Math.min(
    currentPage,
    Math.max(1, Math.ceil(products.length / 10))
  )
  const visibleRows = products.slice((page - 1) * 10, page * 10)

  return (
    <Card className="min-w-0 gap-0 overflow-hidden rounded-xl border border-border/80 py-0 shadow-none ring-0">
      <CardHeader className="border-b border-border/60 px-5 py-4">
        <CardTitle className="text-base font-semibold">
          Top Selling Products
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 py-0 [&_td]:px-5 [&_td]:py-3 [&_th]:px-5 [&_th]:text-xs">
        <Table className="min-w-[420px]">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Product</TableHead>

              <TableHead>Orders</TableHead>

              <TableHead>Revenue</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {visibleRows.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  {product.productName}
                </TableCell>

                <TableCell>{product.orders}</TableCell>

                <TableCell>₱{product.revenue.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <AnalyticsPagination
        total={products.length}
        page={page}
        onPageChange={setCurrentPage}
        label="products"
      />
    </Card>
  )
}
