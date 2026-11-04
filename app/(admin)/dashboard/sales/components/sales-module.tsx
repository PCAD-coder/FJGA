"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Sales from "./sales"
import OnSiteServices from "./on-site-services"

export default function SalesModule() {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-4 px-1 pt-2 pb-12 sm:px-4 sm:pt-3 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
        <p className="text-muted-foreground">
          Monitor product sales and on-site service transactions.
        </p>
      </div>
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList
          aria-label="Sales categories"
          className="h-auto max-w-full flex-wrap justify-start gap-1 rounded-lg border bg-card p-1"
        >
          <TabsTrigger value="products">Product Sales</TabsTrigger>
          <TabsTrigger value="on-site">On-Site Services</TabsTrigger>
        </TabsList>
        {/* Preserve product filters, pagination, and dialogs when changing tabs. */}
        <TabsContent
          value="products"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <Sales />
        </TabsContent>
        {/* Mount on entry to retrieve current payment confirmations on each visit. */}
        <TabsContent value="on-site">
          <OnSiteServices />
        </TabsContent>
      </Tabs>
    </div>
  )
}
