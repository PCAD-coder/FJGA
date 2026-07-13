import RequestStatusCard from "./request-status-card";

import { ReturnRequest } from "../types/return";

interface Props {
  requests: ReturnRequest[];
}

export default function RequestStatusList({
  requests,
}: Props) {
  return (

    <div className="space-y-4">

      <div>

        <h2 className="text-2xl font-semibold">
          Return Request Status
        </h2>

        <p className="text-muted-foreground">
          Track the progress of your submitted requests.
        </p>

      </div>

      {requests.map((request) => (

        <RequestStatusCard
          key={request.id}
          request={request}
        />

      ))}

    </div>

  );
}