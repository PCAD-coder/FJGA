import {
  CheckCircle2,
  Circle,
} from "lucide-react";

interface Props {
  currentStage: string;
}

const stages = [
  "Quotation",
  "Production",
  "Delivery",
  "Completed",
];

export default function OrderTimeline({
  currentStage,
}: Props) {
  return (
    <div>

      <h3 className="mb-4 font-semibold">
        Order Timeline
      </h3>

      <div className="space-y-5">

        {stages.map((stage) => (

          <div
            key={stage}
            className="flex gap-3"
          >

            {stage === currentStage ? (
              <CheckCircle2 className="text-primary" />
            ) : (
              <Circle className="text-muted-foreground" />
            )}

            <div>

              <p className="font-medium">

                {stage}

              </p>

              <p className="text-sm text-muted-foreground">

                Waiting for update

              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}