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

      {requests.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <h3 className="font-semibold">No return requests yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven’t submitted any return requests. Once you submit a request
            in the Request a Return tab, its status will appear here.
          </p>
        </div>
      ) : requests.map((request) => (

        <RequestStatusCard
          key={request.id}
          request={request}
        />

      ))}

    </div>

  );
}
