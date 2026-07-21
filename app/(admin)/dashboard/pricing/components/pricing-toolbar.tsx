"use client";

import { Search, Wrench } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface PricingToolbarProps {
  activeTab: "materials" | "labor";

  onTabChange: (tab: "materials" | "labor") => void;

  search: string;

  onSearchChange: (value: string) => void;

  onAddService: () => void;
}

export default function PricingToolbar({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  onAddService,
}: PricingToolbarProps) {
  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          onTabChange(value as "materials" | "labor")
        }
      >
        <TabsList>
          <TabsTrigger value="materials">
            Materials
          </TabsTrigger>

          <TabsTrigger value="labor">
            Labor Services
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder={
              activeTab === "materials"
                ? "Search materials..."
                : "Search labor services..."
            }
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {activeTab === "labor" && (
          <Button onClick={onAddService}>
            <Wrench className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        )}
      </div>
    </div>
  );
}