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
  "Replacement Ready for Delivery",
  "Replacement Delivered",
];

const repairSteps: ReturnStatus[] = [
  "Request Received",
  "Under Review",
  "Approved",
  "Repair Processing",
  "Repair Ready for Delivery",
  "Repair Delivered",
];

function isRepairStatus(status: ReturnStatus): boolean {
  return (
    status === "Repair Processing" ||
    status === "Repair Ready for Delivery" ||
    status === "Repair Delivered"
  );
}

export default function StatusTimeline({
  currentStatus,
}: Props) {
  const steps = isRepairStatus(currentStatus)
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