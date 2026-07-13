"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  search: string;
  onSearch: (value: string) => void;
}

export default function OrderToolbar({
  search,
  onSearch,
}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <Select defaultValue="newest">

        <SelectTrigger className="w-[180px]">

          <SelectValue />

        </SelectTrigger>

        <SelectContent>

          <SelectItem value="newest">
            Newest
          </SelectItem>

          <SelectItem value="oldest">
            Oldest
          </SelectItem>

          <SelectItem value="highest">
            Highest Price
          </SelectItem>

          <SelectItem value="lowest">
            Lowest Price
          </SelectItem>

        </SelectContent>

      </Select>

      <div className="relative w-full md:w-80">

        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search orders..."
          className="pl-10"
        />

      </div>

    </div>
  );
}