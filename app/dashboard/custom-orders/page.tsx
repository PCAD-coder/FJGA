'use client'

import { DashboardCard } from "@/components/dashboard_cards"
import { ClipboardList, Clock, CheckCircle, XCircle } from "lucide-react"

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

export default function CustomOrdersPage() {
  return (
    <div className="space-y-6 w-full">

      {/* 🔹 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Custom Order Requests</h1>
          <p className="text-sm text-muted-foreground">
            Manage custom fabrication requests and quotations
          </p>
        </div>

        <Button>+ New Request</Button>
      </div>

      {/* 🔹 STATUS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">

        <DashboardCard
          title="Total Requests"
          value="5"
          description=""
          icon={ClipboardList}
          color="text-blue-500"
        />

        <DashboardCard
          title="Pending Quote"
          value="2"
          description=""
          icon={Clock}
          color="text-yellow-500"
        />

        <DashboardCard
          title="Quoted"
          value="1"
          description=""
          icon={ClipboardList}
          color="text-blue-500"
        />

        <DashboardCard
          title="Approved"
          value="1"
          description=""
          icon={CheckCircle}
          color="text-green-500"
        />

        <DashboardCard
          title="Rejected"
          value="1"
          description=""
          icon={XCircle}
          color="text-red-500"
        />
      </div>

      {/* 🔹 SEARCH + FILTER */}
      <div className="flex flex-col lg:flex-row gap-2 lg:items-center lg:justify-between">
        <Input
          placeholder="Search by Request ID, Client Name, or Glass Type..."
          className="w-full lg:max-w-md"
        />

        <Button variant="outline">All Statuses</Button>
      </div>

      {/* 🔹 TABLE */}
      <div className="rounded-xl border bg-card">
        <div className="overflow-x-auto w-full">
          <Table className="w-full">

            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Client Name</TableHead>
                <TableHead className="hidden md:table-cell">Glass Type</TableHead>
                <TableHead className="hidden lg:table-cell">Dimensions</TableHead>
                <TableHead className="hidden xl:table-cell">Material</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {/* ROW 1 */}
              <TableRow>
                <TableCell>CRQ-2026-001</TableCell>
                <TableCell>ABC Construction</TableCell>
                <TableCell className="hidden md:table-cell">Tempered</TableCell>
                <TableCell className="hidden lg:table-cell">8ft x 6ft</TableCell>
                <TableCell className="hidden xl:table-cell">Tempered + Aluminum</TableCell>
                <TableCell className="hidden md:table-cell">Mar 28, 2026</TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-600">
                    Pending
                  </span>
                </TableCell>

                <TableCell>
                  <Button size="sm" variant="outline">Add Quote</Button>
                </TableCell>
              </TableRow>

              {/* ROW 2 */}
              <TableRow>
                <TableCell>CRQ-2026-002</TableCell>
                <TableCell>Modern Homes</TableCell>
                <TableCell className="hidden md:table-cell">Clear</TableCell>
                <TableCell className="hidden lg:table-cell">5ft x 4ft</TableCell>
                <TableCell className="hidden xl:table-cell">Clear + Frame</TableCell>
                <TableCell className="hidden md:table-cell">Mar 25, 2026</TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-600">
                    Quoted
                  </span>
                </TableCell>

                <TableCell>
                  <Button size="sm" variant="outline">Add Quote</Button>
                </TableCell>
              </TableRow>

              {/* ROW 3 */}
              <TableRow>
                <TableCell>CRQ-2026-003</TableCell>
                <TableCell>Elite Interiors</TableCell>
                <TableCell className="hidden md:table-cell">Frosted</TableCell>
                <TableCell className="hidden lg:table-cell">10ft x 8ft</TableCell>
                <TableCell className="hidden xl:table-cell">Frosted Glass</TableCell>
                <TableCell className="hidden md:table-cell">Mar 24, 2026</TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600">
                    Approved
                  </span>
                </TableCell>

                <TableCell>
                  <Button size="sm" variant="outline">Add Quote</Button>
                </TableCell>
              </TableRow>

              {/* ROW 4 */}
              <TableRow>
                <TableCell>CRQ-2026-004</TableCell>
                <TableCell>Skyline Properties</TableCell>
                <TableCell className="hidden md:table-cell">Tinted</TableCell>
                <TableCell className="hidden lg:table-cell">12ft x 9ft</TableCell>
                <TableCell className="hidden xl:table-cell">Tinted + Aluminum</TableCell>
                <TableCell className="hidden md:table-cell">Mar 22, 2026</TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-600">
                    Pending
                  </span>
                </TableCell>

                <TableCell>
                  <Button size="sm" variant="outline">Add Quote</Button>
                </TableCell>
              </TableRow>

              {/* ROW 5 */}
              <TableRow>
                <TableCell>CRQ-2026-005</TableCell>
                <TableCell>Downtown Retail</TableCell>
                <TableCell className="hidden md:table-cell">Clear</TableCell>
                <TableCell className="hidden lg:table-cell">6ft x 8ft</TableCell>
                <TableCell className="hidden xl:table-cell">Glass + Hardware</TableCell>
                <TableCell className="hidden md:table-cell">Mar 20, 2026</TableCell>

                <TableCell>
                  <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-600">
                    Rejected
                  </span>
                </TableCell>

                <TableCell>
                  <Button size="sm" variant="outline">Add Quote</Button>
                </TableCell>
              </TableRow>

            </TableBody>
          </Table>
        </div>
      </div>

      {/* 🔹 FOOTER */}
      <p className="text-sm text-muted-foreground">
        Showing 5 of 5 custom order requests
      </p>

    </div>
  )
}