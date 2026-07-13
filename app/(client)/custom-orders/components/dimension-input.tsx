import { Input } from "@/components/ui/input";

interface Props {
  label: string;
  value: number;
}

export default function DimensionInput({
  label,
  value,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">

        {label}

      </label>

      <div className="flex gap-2">

        <Input
          type="number"
          value={value}
          min={1}
        />

        <div className="flex items-center rounded-md border px-3 text-sm text-muted-foreground">
          cm
        </div>

      </div>

    </div>
  );
}