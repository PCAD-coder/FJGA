import ProgressStepper from "@/components/ui/progress-stepper";

import { ReturnStatus } from "../types/return";

interface Props {
  currentStatus: ReturnStatus;
}

const replacementSteps: ReturnStatus[] = [
  "Request Received",
  "Under Review",
  "Approved",
  "Replacement Processing",
  "Replacement Delivered",
];

const repairSteps: ReturnStatus[] = [
  "Request Received",
  "Under Review",
  "Approved",
  "Replacement Processing",
  "Repair Delivered",
];

export default function StatusTimeline({
  currentStatus,
}: Props) {
  const steps =
    currentStatus === "Repair Delivered"
      ? repairSteps
      : replacementSteps;

  const currentStep = steps.indexOf(currentStatus);

  return (
    <ProgressStepper
      steps={steps}
      currentStep={currentStep}
    />
  );
}