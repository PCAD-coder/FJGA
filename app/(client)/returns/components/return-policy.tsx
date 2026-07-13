import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ShieldCheck } from "lucide-react";

export default function ReturnPolicy() {
  const policies = [
    "Items must be reported within 7 days after delivery.",
    "Returned items must include all original parts and accessories.",
    "Products damaged due to misuse are not eligible for replacement.",
    "Custom-made products may only qualify for replacement if manufacturing defects are confirmed.",
    "Proof of damage (photos) is required for evaluation.",
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" />

        <CardTitle>Return Policy</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3 text-sm">
          {policies.map((policy, index) => (
            <li
              key={index}
              className="flex gap-2"
            >
              <span className="text-primary font-bold">•</span>

              <span>{policy}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}