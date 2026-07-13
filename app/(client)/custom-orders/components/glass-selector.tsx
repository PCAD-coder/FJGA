import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { GlassMaterial } from "../types/customization";

interface Props {
  materials: GlassMaterial[];
  value: string;
}

export default function GlassSelector({
  materials,
  value,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">

        Glass Material

      </label>

      <Select defaultValue={value}>

        <SelectTrigger>

          <SelectValue />

        </SelectTrigger>

        <SelectContent>

          {materials.map((item) => (
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