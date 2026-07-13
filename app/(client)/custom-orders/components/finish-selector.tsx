import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FrameFinish } from "../types/customization";

interface Props {
  finishes: FrameFinish[];
  value: string;
}

export default function FinishSelector({
  finishes,
  value,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">

        Frame Finish

      </label>

      <Select defaultValue={value}>

        <SelectTrigger>

          <SelectValue />

        </SelectTrigger>

        <SelectContent>

          {finishes.map((finish) => (
            <SelectItem
              key={finish.id}
              value={finish.id}
            >
              {finish.name}
            </SelectItem>
          ))}

        </SelectContent>

      </Select>

    </div>
  );
}