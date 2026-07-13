"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export default function ProgressStepper({
  steps,
  currentStep,
}: ProgressStepperProps) {
  return (
    <div className="w-full">
      {/* Icons + Lines */}
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex flex-1 items-center"
          >
            <div className="flex flex-col items-center">
              {index < currentStep ? (
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              ) : index === currentStep ? (
                <CheckCircle2 className="h-7 w-7 text-primary" />
              ) : (
                <Circle className="h-7 w-7 text-muted-foreground" />
              )}
            </div>

            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded-full ${
                  index < currentStep
                    ? "bg-green-600"
                    : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Labels */}
      <div className="mt-3 flex">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex-1 text-center"
          >
            <p
              className={`text-xs md:text-sm ${
                index <= currentStep
                  ? "font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}