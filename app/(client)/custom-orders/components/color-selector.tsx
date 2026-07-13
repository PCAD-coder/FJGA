import { FrameFinish } from "../types/customization";

interface Props {
  finishes: FrameFinish[];
}

export default function ColorSelector({
  finishes,
}: Props) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium">

        Frame Color

      </label>

      <div className="flex flex-wrap gap-3">

        {finishes.map((finish) => (

          <button
            key={finish.id}
            className="h-8 w-8 rounded-full border-2 transition hover:scale-110"
            style={{
              backgroundColor: finish.color,
            }}
          />

        ))}

      </div>

    </div>
  );
}