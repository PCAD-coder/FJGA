import { DashboardCard } from "@/components/dashboard_cards"
import { Package, Tag, LayoutGrid, DollarSign, Pencil, Trash } from "lucide-react"

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ProductsPage() {
  return (
    <div className="space-y-6">

      {/* 🔹 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Product Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage finished products and catalog
          </p>
        </div>

        <Button>+ Add New Product</Button>
      </div>

      {/* 🔹 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Products"
          value="8"
          description="All products"
          icon={Package}
          color="text-gray-500"
        />
        <DashboardCard
          title="Furniture Items"
          value="2"
          description="Furniture category"
          icon={Tag}
          color="text-purple-500"
        />
        <DashboardCard
          title="Fixture Items"
          value="6"
          description="Fixture category"
          icon={LayoutGrid}
          color="text-blue-500"
        />
        <DashboardCard
          title="Catalog Value"
          value="$8,190"
          description="Total value"
          icon={DollarSign}
          color="text-green-500"
        />
      </div>

      {/* 🔹 SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-2">
        <Input placeholder="Search by product name or materials..." />
        <Button variant="outline">All Categories</Button>
      </div>

      {/* 🔹 TABLE */}
      <div className="rounded-xl border bg-card w-full">
        <div className="overflow-x-auto w-full">

          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead className="">Category</TableHead>
                <TableHead className="">Dimensions</TableHead>
                <TableHead className="">Material Used</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {/* 🔸 ROW 1 */}
              <TableRow>
                <TableCell>
                  <Image src="/sample.jpg" alt="product" width={50} height={50} className="rounded-md object-cover" />
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">Sliding Glass Window</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Modern sliding window with smooth operation
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-600">
                    Fixture
                  </span>
                </TableCell>

                <TableCell>
                  6ft x 4ft
                </TableCell>

                <TableCell>
                  1/4" Glass, Aluminum Frame
                </TableCell>

                <TableCell>$850.00</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Pencil className="w-4 h-4 cursor-pointer" />
                    <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
                  </div>
                </TableCell>
              </TableRow>

              {/* 🔸 ROW 2 */}
              <TableRow>
                <TableCell>
                  <Image src="/sample.jpg" alt="product" width={50} height={50} className="rounded-md object-cover" />
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">Aluminum Door Frame</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Heavy-duty aluminum door frame
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-600">
                    Fixture
                  </span>
                </TableCell>

                <TableCell>
                  7ft x 3.5ft
                </TableCell>

                <TableCell>
                  38 Series Aluminum, Powder-Coated
                </TableCell>

                <TableCell>$620.00</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Pencil className="w-4 h-4 cursor-pointer" />
                    <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
                  </div>
                </TableCell>
              </TableRow>

              {/* 🔸 ROW 3 */}
              <TableRow>
                <TableCell>
                  <Image src="/sample.jpg" alt="product" width={50} height={50} className="rounded-md object-cover" />
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">Tempered Glass Table</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Dining table with safety glass
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs rounded-md bg-purple-100 text-purple-600">
                    Furniture
                  </span>
                </TableCell>

                <TableCell>
                  5ft x 3ft
                </TableCell>

                <TableCell>
                  1/2" Tempered Glass, Aluminum Legs
                </TableCell>

                <TableCell>$1,250.00</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Pencil className="w-4 h-4 cursor-pointer" />
                    <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Image src="/sample.jpg" alt="product" width={50} height={50} className="rounded-md object-cover" />
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">Aluminum Door Frame</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Heavy-duty aluminum door frame
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-600">
                    Fixture
                  </span>
                </TableCell>

                <TableCell>
                  7ft x 3.5ft
                </TableCell>

                <TableCell>
                  38 Series Aluminum, Powder-Coated
                </TableCell>

                <TableCell>$620.00</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Pencil className="w-4 h-4 cursor-pointer" />
                    <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Image src="/sample.jpg" alt="product" width={50} height={50} className="rounded-md object-cover" />
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">Aluminum Door Frame</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Heavy-duty aluminum door frame
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-600">
                    Fixture
                  </span>
                </TableCell>

                <TableCell>
                  7ft x 3.5ft
                </TableCell>

                <TableCell>
                  38 Series Aluminum, Powder-Coated
                </TableCell>

                <TableCell>$620.00</TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Pencil className="w-4 h-4 cursor-pointer" />
                    <Trash className="w-4 h-4 text-red-500 cursor-pointer" />
                  </div>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>

        </div>
      </div>

    </div>
  )
}