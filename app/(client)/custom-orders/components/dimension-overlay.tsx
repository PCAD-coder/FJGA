// components/dimension-overlay.tsx

interface Props {
  width: number;
  height: number;
}

export default function DimensionOverlay({
  width,
  height,
}: Props) {
  return (
    <>
      {/* Width */}

      <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-md bg-background/90 px-3 py-1 text-sm font-semibold shadow">

        ← {width} cm →

      </div>

      {/* Height */}

      <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 rounded-md bg-background/90 px-3 py-1 text-sm font-semibold shadow">

        ↑ {height} cm ↓

      </div>
    </>
  );
}