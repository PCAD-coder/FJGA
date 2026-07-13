import ReturnHeader from "./components/return-header";
import ReturnRequestForm from "./components/return-request-form";
import ReturnPolicy from "./components/return-policy";
import HelpCard from "./components/help-card";
import RequestStatusList from "./components/request-status-list";

export default function ReturnsPage() {
  // Temporary mock data
  // Replace these with Prisma/API data later

  const orders = [
    {
      id: "1",
      orderNumber: "ORD-2026-001",
      productName: "Glass Office Partition",
      orderDate: "March 10, 2026",
      deliveredDate: "March 20, 2026",
      warrantyUntil: "March 27, 2026",
      eligible: true,
      image: "/products/partition.jpg",
    },
    {
      id: "2",
      orderNumber: "ORD-2026-002",
      productName: "Aluminum Window Frame",
      orderDate: "March 15, 2026",
      deliveredDate: "March 25, 2026",
      warrantyUntil: "April 1, 2026",
      eligible: true,
      image: "/products/window.jpg",
    },
  ];

  const requests = [
    {
      id: "1",
      returnNumber: "RTN-2026-001",
      orderNumber: "ORD-2026-001",
      productName: "Glass Office Partition",
      issueType: "Damaged Product",
      description:
        "The glass panel arrived cracked upon delivery.",
      submittedAt: "June 12, 2026",
      currentStatus: "Approved" as const,

      timeline: [
        {
          status: "Request Received" as const,
          date: "June 12, 2026",
        },
        {
          status: "Under Review" as const,
          date: "June 13, 2026",
        },
        {
          status: "Approved" as const,
          date: "June 14, 2026",
        },
      ],
    },
    {
      id: "2",
      returnNumber: "RTN-2026-002",
      orderNumber: "ORD-2026-003",
      productName: "Aluminum Window Frame",
      issueType: "Glass Defect",
      description:
        "The tempered glass has scratches on arrival.",
      submittedAt: "June 18, 2026",
      currentStatus: "Under Review" as const,

      timeline: [
        {
          status: "Request Received" as const,
          date: "June 18, 2026",
        },
        {
          status: "Under Review" as const,
          date: "June 19, 2026",
        },
      ],
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <ReturnHeader />

      {/* Top Section */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Return Form */}
        <div className="lg:col-span-2">

          <ReturnRequestForm
            orders={orders}
          />

        </div>

        {/* Right Panel */}
        <div className="space-y-6">

          <ReturnPolicy />

          <HelpCard />

        </div>

      </div>

      {/* Status Tracking */}
      <RequestStatusList
        requests={requests}
      />

    </div>
  );
}