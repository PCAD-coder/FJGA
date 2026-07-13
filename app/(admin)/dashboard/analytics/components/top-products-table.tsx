"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { TopProduct } from "../types/analytics"

interface Props {
  products: TopProduct[]
}

export default function TopProductsTable({
  products,
}: Props) {
  return (
    <Card>

      <CardHeader>
        <CardTitle>
          Top Selling Products
        </CardTitle>
      </CardHeader>

      <CardContent>

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>
                Product
              </TableHead>

              <TableHead>
                Orders
              </TableHead>

              <TableHead>
                Revenue
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {products.map(
              (product) => (
                <TableRow
                  key={product.id}
                >
                  <TableCell className="font-medium">
                    {
                      product.productName
                    }
                  </TableCell>

                  <TableCell>
                    {
                      product.orders
                    }
                  </TableCell>

                  <TableCell>
                    ₱
                    {product.revenue.toLocaleString()}
                  </TableCell>

                </TableRow>
              )
            )}

          </TableBody>

        </Table>

      </CardContent>

    </Card>
  )
}