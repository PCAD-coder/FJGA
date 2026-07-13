// components/specification-summary.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  product: string;
  width: number;
  height: number;
  aluminum: string;
  glass: string;
  finish: string;
}

export default function SpecificationSummary({
  product,
  width,
  height,
  aluminum,
  glass,
  finish,
}: Props) {
  return (
    <Card>

      <CardHeader>

        <CardTitle>

          Selected Specifications

        </CardTitle>

      </CardHeader>

      <CardContent className="space-y-5">

        <div>

          <p className="text-sm text-muted-foreground">

            Product

          </p>

          <p className="font-medium">

            {product}

          </p>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <div>

            <p className="text-sm text-muted-foreground">

              Width

            </p>

            <p className="font-medium">

              {width} cm

            </p>

          </div>

          <div>

            <p className="text-sm text-muted-foreground">

              Height

            </p>

            <p className="font-medium">

              {height} cm

            </p>

          </div>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">

            Aluminum Series

          </p>

          <p className="font-medium">

            {aluminum}

          </p>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">

            Glass Material

          </p>

          <p className="font-medium">

            {glass}

          </p>

        </div>

        <div>

          <p className="text-sm text-muted-foreground">

            Frame Finish

          </p>

          <p className="font-medium">

            {finish}

          </p>

        </div>

      </CardContent>

    </Card>
  );
}