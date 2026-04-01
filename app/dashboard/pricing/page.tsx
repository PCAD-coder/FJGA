'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="space-y-6 w-full">

      {/* 🔹 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Pricing Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage pricing matrices for materials and labor
          </p>
        </div>

        <Button variant="secondary">💾 Save All Changes</Button>
      </div>

      {/* 🔹 SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="p-4 rounded-xl border bg-blue-50 dark:bg-blue-950">
          <p className="text-sm text-muted-foreground">Glass Types</p>
          <div className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-500" />
            5
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-purple-50 dark:bg-purple-950">
          <p className="text-sm text-muted-foreground">Aluminum Series</p>
          <div className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-purple-500" />
            4
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-green-50 dark:bg-green-950">
          <p className="text-sm text-muted-foreground">Fabrication Fees</p>
          <div className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            5
          </div>
        </div>
      </div>

      {/* 🔹 TABS */}
      <Tabs defaultValue="glass" className="w-full">

        <TabsList>
          <TabsTrigger value="glass">Glass Types</TabsTrigger>
          <TabsTrigger value="aluminum">Aluminum Series</TabsTrigger>
          <TabsTrigger value="fabrication">Fabrication Labor</TabsTrigger>
        </TabsList>

        {/* ================= GLASS TAB ================= */}
        <TabsContent value="glass">
          <div className="rounded-xl border p-4 space-y-4">

            <h2 className="font-semibold">
              Glass Type Pricing (Per Square Inch)
            </h2>

            {[
              { name: "Clear Glass", price: "0.12" },
              { name: "Tempered Glass", price: "0.18" },
              { name: "Frosted Glass", price: "0.15" },
              { name: "Tinted Glass", price: "0.14" },
              { name: "Laminated Glass", price: "0.22" },
            ].map((item) => (
              <div
                key={item.name}
                className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 border rounded-lg p-3"
              >

                {/* NAME */}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    per sq. inch
                  </p>
                </div>

                {/* PRICE */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">Price:</span>
                  <Input defaultValue={item.price} className="w-28" />
                </div>

                {/* DATE */}
                <div className="text-xs text-muted-foreground">
                  Updated: Mar 15, 2026
                </div>

                {/* BUTTON */}
                <div>
                  <Button size="sm" variant="outline">
                    Update Price
                  </Button>
                </div>

              </div>
            ))}

          </div>
        </TabsContent>

        {/* ================= ALUMINUM TAB ================= */}
        <TabsContent value="aluminum">
          <div className="rounded-xl border p-4 space-y-4">

            <h2 className="font-semibold">
              Aluminum Series Pricing (Per Linear Foot)
            </h2>

            {[
              { name: "798 Series", price: "8.5" },
              { name: "38 Series", price: "12" },
              { name: "Analoc Series", price: "10.5" },
              { name: "Premium Series", price: "15" },
            ].map((item) => (
              <div
                key={item.name}
                className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 border rounded-lg p-3"
              >

                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    per linear ft
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Price:</span>
                  <Input defaultValue={item.price} className="w-28" />
                </div>

                <div className="text-xs text-muted-foreground">
                  Updated: Mar 20, 2026
                </div>

                <div>
                  <Button size="sm" variant="outline">
                    Update Price
                  </Button>
                </div>

              </div>
            ))}

          </div>
        </TabsContent>

        {/* ================= FABRICATION TAB ================= */}
        <TabsContent value="fabrication">
          <div className="rounded-xl border p-4 space-y-4">

            <h2 className="font-semibold">
              Fabrication Labor Fees
            </h2>

            {[
              { name: "Standard Window Assembly", price: "150" },
              { name: "Door Frame Installation", price: "200" },
              { name: "Custom Glass Cutting", price: "80" },
              { name: "Shower Enclosure Setup", price: "350" },
              { name: "Complex Design Add-on", price: "100" },
            ].map((item) => (
              <div
                key={item.name}
                className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 border rounded-lg p-3"
              >

                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    flat fee
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm">Price:</span>
                  <Input defaultValue={item.price} className="w-28" />
                </div>

                <div className="text-xs text-muted-foreground">
                  Updated: Mar 1, 2026
                </div>

                <div>
                  <Button size="sm" variant="outline">
                    Update Price
                  </Button>
                </div>

              </div>
            ))}

          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}