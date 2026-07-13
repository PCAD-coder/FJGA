import ProgressStepper from "@/components/ui/progress-stepper";

import { ReturnStatus } from "../types/return";

interface Props {
  currentStatus: ReturnStatus;
}

const steps: ReturnStatus[] = [
  "Request Received",
  "Under Review",
  "Approved",
  "Replacement Processing",
  "Replacement Delivered",
];

export default function StatusTimeline({
  currentStatus,
}: Props) {
  const currentStep = steps.indexOf(currentStatus);

  return (
    <ProgressStepper
      steps={steps}
      currentStep={currentStep}
    />
  );
}