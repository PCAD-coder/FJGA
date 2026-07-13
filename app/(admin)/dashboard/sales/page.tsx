"use client"

import { useMemo, useState } from "react"

import {
  Search,
  Eye,
  Archive,
  PhilippinePeso,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

const transactions = [
  {
    id: 1,
    client: "Maria Santos",
    date: "Apr 15, 2026",
    totalAmount: 45800,
    amountPaid: 45800,
  },
  {
    id: 2,
    client: "Juan dela Cruz",
    date: "Apr 15, 2026",
    totalAmount: 32500,
    amountPaid: 20000,
  },
  {
    id: 3,
    client: "Carmen Reyes",
    date: "Apr 14, 2026",
    totalAmount: 67300,
    amountPaid: 67300,
  },
  {
    id: 4,
    client: "Roberto Garcia",
    date: "Apr 14, 2026",
    totalAmount: 28900,
    amountPaid: 10000,
  },
  {
    id: 5,
    client: "Sofia Hernandez",

    date: "Apr 13, 2026",
    totalAmount: 51200,
    amountPaid: 0,
  },
]

export default function SalesPage() {
  const [search, setSearch] = useState("")

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.client
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  }, [search])

  const totalSales = transactions.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  )

  const totalReceivables = transactions.reduce(
    (sum, item) =>
      sum + (item.totalAmount - item.amountPaid),
    0
  )

  const getStatus = (
    totalAmount: number,
    amountPaid: number
  ) => {
    if (amountPaid === 0) return "Unpaid"

    if (amountPaid < totalAmount)
      return "Partially Paid"

    return "Fully Paid"
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Fully Paid":
        return "bg-green-100 text-green-700"

      case "Partially Paid":
        return "bg-yellow-100 text-yellow-700"

      default:
        return "bg-red-100 text-red-700"
    }
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold">
          Sales & Payment Tracking
        </h1>

        <p className="text-muted-foreground">
          Monitor sales transactions and
          outstanding balances
        </p>
      </div>

      {/* SUMMARY CARDS */}

      <div className="grid gap-4 md:grid-cols-2">

        <Card>
          <CardContent className="pt-3">
            <div className="flex items-center gap-3">
              <PhilippinePeso className="h-8 w-8 text-green-600" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Total Sales
                </p>

                <h2 className="text-2xl font-bold">
                  ₱{totalSales.toLocaleString()}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-3">
            <div className="flex items-center gap-3">
              <PhilippinePeso className="h-8 w-8 text-orange-500" />

              <div>
                <p className="text-sm text-muted-foreground">
                  Outstanding Receivables
                </p>

                <h2 className="text-2xl font-bold">
                  ₱{totalReceivables.toLocaleString()}
                </h2>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* TABLE */}

      <Card>

        <CardHeader>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <CardTitle>
                Sales Transactions
              </CardTitle>

              <CardDescription>
                Track payments and balances
              </CardDescription>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search client..."
                className="pl-9"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

          </div>

        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b text-left">

                  <th className="py-3">
                    Client
                  </th>

                  <th className="py-3">
                    Date
                  </th>

                  <th className="py-3">
                    Total Amount
                  </th>

                  <th className="py-3">
                    Amount Paid
                  </th>

                  <th className="py-3">
                    Remaining Balance
                  </th>

                  <th className="py-3">
                    Status
                  </th>

                  <th className="py-3">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredTransactions.map(
                  (transaction) => {
                    const balance =
                      transaction.totalAmount -
                      transaction.amountPaid

                    const status =
                      getStatus(
                        transaction.totalAmount,
                        transaction.amountPaid
                      )

                    return (
                      <tr
                        key={transaction.id}
                        className="border-b"
                      >
                        <td className="py-4">
                          {transaction.client}
                        </td>

                        <td className="py-4">
                          {transaction.date}
                        </td>

                        <td className="py-4 font-medium">
                          ₱
                          {transaction.totalAmount.toLocaleString()}
                        </td>

                        <td className="py-4 text-green-600 font-medium">
                          ₱
                          {transaction.amountPaid.toLocaleString()}
                        </td>

                        <td className="py-4 text-red-500 font-medium">
                          ₱
                          {balance.toLocaleString()}
                        </td>

                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="py-4">
                          <div className="flex gap-2">

                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={
                                status !==
                                "Fully Paid"
                              }
                            >
                              <Archive className="h-4 w-4 mr-1" />
                              Archive
                            </Button>

                          </div>
                        </td>
                      </tr>
                    )
                  }
                )}

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>

    </div>
  )
}