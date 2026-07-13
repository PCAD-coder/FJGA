"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoryFilter() {
  return (
    <Select defaultValue="All">

      <SelectTrigger className="w-[220px]">

        <SelectValue />

      </SelectTrigger>

      <SelectContent>

        <SelectItem value="All">
          All Categories
        </SelectItem>

        <SelectItem value="Furniture">
          Furniture
        </SelectItem>

        <SelectItem value="Windows">
          Windows
        </SelectItem>

        <SelectItem value="Doors">
          Doors
        </SelectItem>

        <SelectItem value="Partitions">
          Partitions
        </SelectItem>

        <SelectItem value="Bathroom">
          Bathroom
        </SelectItem>

        <SelectItem value="Railings">
          Railings
        </SelectItem>

      </SelectContent>

    </Select>
  );
}