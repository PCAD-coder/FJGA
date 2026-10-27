import type { OfficialReceipt } from "../../types/official-receipt"

interface OfficialReceiptDocumentProps {
  receipt: OfficialReceipt
}

function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number(value ?? 0))
}

function formatReceiptDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value))
}

function formatPaymentMethod(method: string) {
  switch (method) {
    case "cash_on_delivery":
      return "Cash on Delivery"

    case "gcash":
      return "GCash"

    case "card":
      return "Card"

    default:
      return method
  }
}

function formatDimensions(
  width: number | null,
  height: number | null,
  depth: number | null,
  unit: string | null
) {
  const values = [width, height, depth].filter(
    (value): value is number => value !== null && value !== undefined
  )

  if (values.length === 0) {
    return null
  }

  return `${values.join(" × ")}${unit ? ` ${unit}` : ""}`
}

export function OfficialReceiptDocument({
  receipt,
}: OfficialReceiptDocumentProps) {
  return (
    <div
  id="official-receipt-print-area"
  className="mx-auto w-full max-w-4xl bg-white text-black"
>
      {/* ============================================================
          COMPANY HEADER
      ============================================================ */}
      <header className="border-b-2 border-black px-6 pb-5 pt-6 text-center sm:px-10">
        <h1 className="text-2xl font-bold tracking-wide">
          FELIX JUSAYAN
        </h1>

        <p className="mt-1 text-lg font-semibold">
          Glass and Aluminum Works
        </p>

        <p className="mt-2 text-sm">
          248 Camia St. Bancal, Meycauayan City of Bulacan
        </p>

        <p className="text-sm">
          09178777291 / 0917441866
        </p>
      </header>

      {/* ============================================================
          RECEIPT TITLE
      ============================================================ */}
      <section className="px-6 py-6 sm:px-10">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="hidden sm:block sm:w-24" />

          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-wider">
              OFFICIAL RECEIPT
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Proof of Full Payment
            </p>
          </div>

          <div className="rounded-md border-2 border-black px-5 py-2 text-center sm:w-24">
            <p className="text-lg font-bold tracking-wider">
              PAID
            </p>
          </div>
        </div>

        {/* ============================================================
            RECEIPT INFORMATION
        ============================================================ */}
        <div className="mt-8 grid gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
          <div className="flex gap-2">
            <span className="min-w-24 font-semibold">
              Receipt No.:
            </span>

            <span>{receipt.receipt_number}</span>
          </div>

          <div className="flex gap-2">
            <span className="min-w-20 font-semibold">
              Date:
            </span>

            <span>{formatReceiptDate(receipt.issued_at)}</span>
          </div>

          <div className="flex gap-2">
            <span className="min-w-24 font-semibold">
              Order No.:
            </span>

            <span>{receipt.order_number ?? "—"}</span>
          </div>

          <div className="flex gap-2">
            <span className="min-w-20 font-semibold">
              Status:
            </span>

            <span className="font-semibold uppercase">
              {receipt.payment_status}
            </span>
          </div>
        </div>

        {/* ============================================================
            CUSTOMER INFORMATION
        ============================================================ */}
        <div className="mt-6 border-y border-black py-5">
          <div className="grid gap-3 text-sm">
            <div className="grid grid-cols-[110px_1fr] gap-3">
              <span className="font-semibold">
                Client Name:
              </span>

              <span>{receipt.customer_name}</span>
            </div>

            <div className="grid grid-cols-[110px_1fr] gap-3">
              <span className="font-semibold">
                Project:
              </span>

              <span>{receipt.project_name ?? "—"}</span>
            </div>

            <div className="grid grid-cols-[110px_1fr] gap-3">
              <span className="font-semibold">
                Address:
              </span>

              <span>{receipt.billing_address ?? "—"}</span>
            </div>

            {receipt.customer_contact_number && (
              <div className="grid grid-cols-[110px_1fr] gap-3">
                <span className="font-semibold">
                  Contact No.:
                </span>

                <span>{receipt.customer_contact_number}</span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            ORDER ITEMS
        ============================================================ */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-sm">
            <thead>
              <tr className="border-y-2 border-black">
                <th className="w-16 px-3 py-3 text-center">
                  Item
                </th>

                <th className="px-3 py-3 text-left">
                  Materials / Product
                </th>

                <th className="w-32 px-3 py-3 text-right">
                  Unit Price
                </th>

                <th className="w-20 px-3 py-3 text-center">
                  QTY
                </th>

                <th className="w-32 px-3 py-3 text-right">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {receipt.items.map((item, index) => {
                const dimensions = formatDimensions(
                  item.width,
                  item.height,
                  item.depth,
                  item.dimension_unit
                )

                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-300 align-top"
                  >
                    <td className="px-3 py-4 text-center">
                      {index + 1}
                    </td>

                    <td className="px-3 py-4">
                      <p className="font-medium">
                        {item.product_name}
                      </p>

                      {dimensions && (
                        <p className="mt-1 text-xs text-gray-600">
                          Dimensions: {dimensions}
                        </p>
                      )}

                      {item.materials_snapshot &&
                        item.materials_snapshot.length > 0 && (
                          <div className="mt-2 space-y-0.5 text-xs text-gray-600">
                            {item.materials_snapshot.map(
                              (material, materialIndex) => (
                                <p
                                  key={
                                    material.material_id ??
                                    `${item.id}-material-${materialIndex}`
                                  }
                                >
                                  {material.material_name ?? "Material"}

                                  {material.quantity != null &&
                                    ` × ${material.quantity}`}

                                  {material.unit &&
                                    ` ${material.unit}`}
                                </p>
                              )
                            )}
                          </div>
                        )}
                    </td>

                    <td className="px-3 py-4 text-right tabular-nums">
                      {formatCurrency(item.unit_price)}
                    </td>

                    <td className="px-3 py-4 text-center">
                      {item.quantity}
                    </td>

                    <td className="px-3 py-4 text-right font-medium tabular-nums">
                      {formatCurrency(item.line_total)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ============================================================
            FINANCIAL SUMMARY

            IMPORTANT:
            receipt.subtotal already contains the product pricing,
            including the labor contribution. Do not add labor_total
            again when calculating/displaying the grand total.
        ============================================================ */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-md text-sm">
            <div className="flex justify-between gap-4 py-1.5">
              <span>Product Total</span>

              <span className="tabular-nums">
                {formatCurrency(receipt.subtotal)}
              </span>
            </div>

            {receipt.vat_rate > 0 && (
              <div className="flex justify-between gap-4 py-1.5">
                <span>
                  VAT ({Number(receipt.vat_rate).toFixed(2)}%)
                </span>

                <span className="tabular-nums">
                  {formatCurrency(receipt.vat_amount)}
                </span>
              </div>
            )}

            <div className="flex justify-between gap-4 py-1.5">
              <span>Delivery Fee</span>

              <span className="tabular-nums">
                {formatCurrency(receipt.delivery_fee)}
              </span>
            </div>

            <div className="mt-2 flex justify-between gap-4 border-y-2 border-black py-3 text-base font-bold">
              <span>TOTAL</span>

              <span className="tabular-nums">
                {formatCurrency(receipt.total_amount)}
              </span>
            </div>

            <div className="mt-4 flex justify-between gap-4 py-1.5">
              <span>Previous Payments</span>

              <span className="tabular-nums">
                {formatCurrency(
                  receipt.amount_paid_before_final
                )}
              </span>
            </div>

            <div className="flex justify-between gap-4 py-1.5">
              <span>Final Payment</span>

              <span className="tabular-nums">
                {formatCurrency(receipt.final_payment_amount)}
              </span>
            </div>

            <div className="mt-2 flex justify-between gap-4 border-t border-black py-2 text-base font-semibold">
              <span>TOTAL PAID</span>

              <span className="tabular-nums">
                {formatCurrency(receipt.total_paid)}
              </span>
            </div>

            <div className="mt-4 flex justify-between gap-4 border-2 border-black px-4 py-3 text-lg font-bold">
              <span>TOTAL BALANCE</span>

              <span className="tabular-nums">
                {formatCurrency(receipt.remaining_balance)}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================
            PAYMENT DETAILS
        ============================================================ */}
        <div className="mt-8 border-t border-black pt-5">
          <h3 className="text-sm font-bold uppercase tracking-wide">
            Payment Details
          </h3>

          <div className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
            <div>
              <span className="font-semibold">
                Final Payment Method:
              </span>{" "}
              {formatPaymentMethod(receipt.payment_method)}
            </div>

            {receipt.payment_reference_number && (
              <div>
                <span className="font-semibold">
                  Reference No.:
                </span>{" "}
                {receipt.payment_reference_number}
              </div>
            )}

            {receipt.received_by_employee && (
              <div>
                <span className="font-semibold">
                  Received By:
                </span>{" "}
                {receipt.received_by_employee}
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            FOOTER
        ============================================================ */}
        <footer className="mt-10 border-t border-gray-300 pt-5 text-center text-xs text-gray-600">
          <p>
            Thank you for choosing FJ Glass and Aluminum Works.
          </p>

          <p className="mt-1">
            Official Receipt No. {receipt.receipt_number}
          </p>
        </footer>
      </section>
    </div>
  )
}