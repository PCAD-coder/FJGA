import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AluminumSeries } from "../types/customization";

interface Props {
  series: AluminumSeries[];
  value: string;
}

export default function AluminumSelector({
  series,
  value,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">

        Aluminum Series

      </label>

      <Select defaultValue={value}>

        <SelectTrigger>

          <SelectValue />

        </SelectTrigger>

        <SelectContent>

          {series.map((item) => (
            <SelectItem
              key={item.id}
              value={item.id}
            >
              {item.name}
            </SelectItem>
          ))}

        </SelectContent>

      </Select>

    </div>
  );
}