"use client"

import { Search, Wrench } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import type { LaborPricing, MaterialPricing } from "../types/pricing"

import PricingExportMenu from "./pricing-export-menu"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PricingToolbarProps {
  activeTab: "materials" | "labor"

  onTabChange: (tab: "materials" | "labor") => void

  search: string

  onSearchChange: (value: string) => void

  onAddService: () => void
  materials: MaterialPricing[]

  laborServices: LaborPricing[]
}

export default function PricingToolbar({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  onAddService,
  materials,
  laborServices,
}: PricingToolbarProps) {
  return (
    <div className="space-y-3 rounded-xl border border-border/80 bg-card p-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as "materials" | "labor")}
      >
        <TabsList className="h-auto max-w-full flex-wrap rounded-lg bg-muted/60">
          <TabsTrigger value="materials">Materials</TabsTrigger>

          <TabsTrigger value="labor">Labor Services</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            aria-label="Search pricing records"
            className="h-9 rounded-lg bg-background/50 pl-9 shadow-none"
            placeholder={
              activeTab === "materials"
                ? "Search materials..."
                : "Search labor services..."
            }
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <PricingExportMenu
            activeTab={activeTab}
            materials={materials}
            laborServices={laborServices}
            search={search}
          />

          {activeTab === "labor" && (
            <Button
              onClick={onAddService}
              className="h-9 rounded-lg text-sm shadow-none"
            >
              <Wrench className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
