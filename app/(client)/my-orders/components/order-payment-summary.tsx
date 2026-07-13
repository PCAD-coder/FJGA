import { Card, CardContent } from "@/components/ui/card";

interface Props {
  total: number;
  paid: number;
}

export default function OrderPaymentSummary({
  total,
  paid,
}: Props) {
  return (
    <Card>

      <CardContent className="space-y-3 p-5">

        <h3 className="font-semibold">

          Payment Summary

        </h3>

        <div className="flex justify-between">

          <span>Total</span>

          <span>

            ₱{total.toLocaleString()}

          </span>

        </div>

        <div className="flex justify-between">

          <span>Paid</span>

          <span>

            ₱{paid.toLocaleString()}

          </span>

        </div>

        <div className="flex justify-between font-bold">

          <span>Balance</span>

          <span>

            ₱{(total - paid).toLocaleString()}

          </span>

        </div>

      </CardContent>

    </Card>
  );
}