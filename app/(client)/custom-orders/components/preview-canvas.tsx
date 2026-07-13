// components/preview-canvas.tsx

import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import DimensionOverlay from "./dimension-overlay";

interface Props {
  image: string;
  width: number;
  height: number;
}

export default function PreviewCanvas({
  image,
  width,
  height,
}: Props) {
  return (
    <Card className="h-fit">

      <CardHeader>

        <CardTitle>

          Live Product Preview

        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="relative flex h-[420px] items-center justify-center overflow-hidden rounded-xl border bg-muted">

          <Image
            src={image}
            alt="Preview"
            fill
            className="object-contain p-8"
          />

          <DimensionOverlay
            width={width}
            height={height}
          />

        </div>

      </CardContent>

    </Card>
  );
}