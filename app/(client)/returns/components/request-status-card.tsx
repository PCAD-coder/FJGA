import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import StatusTimeline from "./status-timeline";

import { ReturnRequest } from "../types/return";

interface Props {
  request: ReturnRequest;
}

const badgeStyles: Record<string, string> = {
  "Request Received":
    "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100",

  "Under Review":
    "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100",

  "Approved":
    "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",

  "Rejected":
    "bg-red-100 text-red-700 border-red-200 hover:bg-red-100",

  "Replacement Processing":
    "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-100",

  "Replacement Delivered":
    "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
};

export default function RequestStatusCard({
  request,
}: Props) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">
              {request.returnNumber}
            </h3>

            <p className="text-muted-foreground">
              {request.productName}
            </p>

            <p className="text-sm text-muted-foreground">
              Order No. {request.orderNumber}
            </p>

            <p className="text-sm text-muted-foreground">
              Submitted on {request.submittedAt}
            </p>
          </div>

          <Badge
            variant="outline"
            className={badgeStyles[request.currentStatus]}
          >
            {request.currentStatus}
          </Badge>
        </div>

        {/* Progress */}
        <StatusTimeline
          currentStatus={request.currentStatus}
        />
      </CardContent>
    </Card>
  );
}