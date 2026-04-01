'use client'

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
import { Card } from "@/components/ui/card"

export default function ReturnsPage() {
  return (
    <div className="space-y-6">

      {/* 🔹 HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Return Request & Quality Control</h1>
        <p className="text-sm text-muted-foreground">
          Manage return requests and quality defect claims
        </p>
      </div>

      {/* 🔹 SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-2">
        <Input placeholder="Search by Return ID, Order ID, or Customer Name..." />
        <Button variant="outline">All Status</Button>
      </div>

      {/* 🔹 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Requests</p>
          <p className="text-2xl font-bold">6</p>
        </Card>

        <Card className="p-4 border-yellow-400">
          <p className="text-sm text-muted-foreground">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-500">3</p>
        </Card>

        <Card className="p-4 border-green-400">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-green-500">2</p>
        </Card>

        <Card className="p-4 border-red-400">
          <p className="text-sm text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold text-red-500">1</p>
        </Card>

      </div>

      {/* 🔹 TABLE */}
      <div className="rounded-xl border bg-card overflow-x-auto">

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Return ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Defect Reason</TableHead>
              <TableHead>Request Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {/* ROW */}
            <TableRow>
              <TableCell>#RET201</TableCell>
              <TableCell>#J101</TableCell>
              <TableCell>John Smith</TableCell>
              <TableCell>Cracked Glass</TableCell>
              <TableCell>Mar 25, 2026</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 text-xs font-medium">
                  Pending
                </span>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">View Details</Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>#RET202</TableCell>
              <TableCell>#J105</TableCell>
              <TableCell>Ahmed Hassan</TableCell>
              <TableCell>Wrong Measurement</TableCell>
              <TableCell>Mar 24, 2026</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-md bg-yellow-100 text-yellow-700 text-xs font-medium">
                  Pending
                </span>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">View Details</Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>#RET203</TableCell>
              <TableCell>#J103</TableCell>
              <TableCell>David Chen</TableCell>
              <TableCell>Scratched Surface</TableCell>
              <TableCell>Mar 23, 2026</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                  Approved
                </span>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">View Details</Button>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>#RET204</TableCell>
              <TableCell>#J108</TableCell>
              <TableCell>Lisa Anderson</TableCell>
              <TableCell>Installation Damage</TableCell>
              <TableCell>Mar 22, 2026</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded-md bg-red-100 text-red-700 text-xs font-medium">
                  Rejected
                </span>
              </TableCell>
              <TableCell>
                <Button size="sm" variant="outline">View Details</Button>
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>

      </div>

    </div>
  )
}