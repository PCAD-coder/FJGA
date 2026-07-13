import { CheckCircle2 } from "lucide-react";

interface Props {
  quotation: boolean;
  production: boolean;
  delivery: boolean;
  completed: boolean;
}

export default function OrderProgress({
  quotation,
  production,
  delivery,
  completed,
}: Props) {

  const stages = [
    {
      label: "Quotation",
      active: quotation,
    },
    {
      label: "Production",
      active: production,
    },
    {
      label: "Delivery",
      active: delivery,
    },
    {
      label: "Completed",
      active: completed,
    },
  ];

  return (
    <div className="flex items-center justify-between">

      {stages.map((stage, index) => (

        <div
          key={stage.label}
          className="flex flex-1 items-center"
        >

          <div className="flex flex-col items-center">

            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                stage.active
                  ? "bg-primary text-white"
                  : "bg-muted"
              }`}
            >
              {stage.active && (
                <CheckCircle2 className="h-4 w-4" />
              )}
            </div>

            <span className="mt-2 text-xs">
              {stage.label}
            </span>

          </div>

          {index < stages.length - 1 && (
            <div
              className={`h-1 flex-1 ${
                stage.active
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          )}

        </div>

      ))}

    </div>
  );
}