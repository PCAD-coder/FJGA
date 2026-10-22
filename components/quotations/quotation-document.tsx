import type {
  QuotationDocumentData,
  QuotationDocumentItem,
} from "./quotation-document.types"

/*import type {
ClientQuotationDetail,
  ClientQuotationItem,
} from "@/app/(client)/custom-orders/types/custom-order-request"*/

interface QuotationDocumentProps {
  quotation: QuotationDocumentData
  documentId?: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value)
}

function formatDate(value: string | null) {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value))
}

function formatDimensionValue(value: number | null) {
  if (value === null) {
    return "—"
  }

  return Number.isInteger(value) ? value.toString() : value.toFixed(2)
}

function QuotationItemDetails({ item }: { item: QuotationDocumentItem }) {
  return (
    <div className="space-y-2">
      <p className="font-semibold">{item.itemName}</p>

      {item.materials.length > 0 && (
        <div className="text-[10px] leading-4">
          <p className="font-semibold">Materials:</p>

          <ul className="list-disc pl-4">
            {item.materials.map((material, index) => (
              <li key={`${material.materialName}-${index}`}>
                {material.materialName} — {material.quantity} {material.unit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function QuotationDocument({
  quotation,
  documentId,
}: QuotationDocumentProps) {
  return (
    <div
      id={documentId}
      className="mx-auto min-h-[297mm] w-[210mm] min-w-[210mm] bg-white p-[12mm] text-black"
    >
      {/* Company Header */}
      <header className="text-center">
        <h1 className="text-[20px] font-bold tracking-wide uppercase">
          FJ Glass and Aluminum
        </h1>

        <p className="mt-0.5 text-[11px] font-medium">
          Glass and Aluminum Works
        </p>

        <p className="mt-1 text-[10px]">
          248 Camia St. Bancal, Meycauayan City of Bulacan
        </p>
      </header>

      <div className="my-5 border-t border-black" />

      {/* Quotation Header */}
      <section className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-[17px] font-bold uppercase">Quotation</h2>

          <p className="mt-1 text-[10px]">
            Quotation No.:{" "}
            <span className="font-semibold">{quotation.quotationNumber}</span>
          </p>
        </div>

        <div className="text-right text-[10px]">
          <p className="font-semibold">Date</p>

          <p>{formatDate(quotation.sentAt ?? quotation.createdAt)}</p>
        </div>
      </section>
      {/* Project Information */}
      <section className="mb-5 border border-black text-[10px]">
        <div className="grid grid-cols-[90px_1fr] border-b border-black">
          <div className="border-r border-black px-3 py-2 font-semibold">
            Project Name
          </div>

          <div className="px-3 py-2">{quotation.projectName}</div>
        </div>

        <div className="grid grid-cols-[90px_1fr]">
          <div className="border-r border-black px-3 py-2 font-semibold">
            Address
          </div>

          <div className="min-h-8 px-3 py-2">
            {quotation.customerAddressSnapshot || "—"}
          </div>
        </div>
      </section>

      {/* Quotation Table */}
      <table className="w-full table-fixed border-collapse text-[11px]">
        <thead>
          <tr>
            <th rowSpan={2} className="w-[7%] border border-black px-1 py-2">
              Item
              <br />
              No.
            </th>

            <th rowSpan={2} className="w-[32%] border border-black px-2 py-2">
              Details
            </th>

            <th colSpan={3} className="w-[21%] border border-black px-1 py-1">
              Dimensions ({quotation.items[0]?.dimensionUnit || "cm"})
            </th>

            <th rowSpan={2} className="w-[14%] border border-black px-1 py-2">
              Unit Price
            </th>

            <th rowSpan={2} className="w-[8%] border border-black px-1 py-2">
              Qty
            </th>

            <th rowSpan={2} className="w-[18%] border border-black px-1 py-2">
              Amount
            </th>
          </tr>

          <tr>
            <th className="border border-black px-1 py-1">W</th>

            <th className="border border-black px-1 py-1">H</th>

            <th className="border border-black px-1 py-1">D</th>
          </tr>
        </thead>

        <tbody>
          {quotation.items.map((item) => (
            <tr key={item.id}>
              <td className="border border-black px-1 py-3 text-center align-top">
                {item.itemNumber}
              </td>

              <td className="border border-black px-2 py-3 align-top">
                <QuotationItemDetails item={item} />
              </td>

              <td className="border border-black px-1 py-3 text-center align-top">
                {formatDimensionValue(item.width)}
              </td>

              <td className="border border-black px-1 py-3 text-center align-top">
                {formatDimensionValue(item.height)}
              </td>

              <td className="border border-black px-1 py-3 text-center align-top">
                {item.depth === null ? "0" : formatDimensionValue(item.depth)}
              </td>

              <td className="border border-black px-2 py-3 text-right align-top">
                {formatCurrency(item.unitPrice)}
              </td>

              <td className="border border-black px-1 py-3 text-center align-top">
                {item.quantity}
              </td>

              <td className="border border-black px-2 py-3 text-right align-top">
                {formatCurrency(item.lineTotal)}
              </td>
            </tr>
          ))}

          {/* Empty visual space similar to a paper quotation */}
          <tr>
            <td className="h-20 border-x border-black" />
            <td className="border-x border-black" />
            <td className="border-x border-black" />
            <td className="border-x border-black" />
            <td className="border-x border-black" />
            <td className="border-x border-black" />
            <td className="border-x border-black" />
            <td className="border-x border-r border-black" />
            
          </tr>

          {/* Subtotal */}
          <tr>
            <td colSpan={6}className="border-t border-black" />
            
            <td className="border border-black px-2 py-2 text-right font-semibold">
              Subtotal
            </td>

            <td className="border border-black px-2 py-2 text-right">
              {formatCurrency(quotation.subtotal)}
            </td>
          </tr>

          {/* VAT */}
          <tr>
            <td colSpan={6}/>

            <td className="border border-black px-2 py-2 text-right font-semibold">
              VAT ({quotation.vatRate}%)
            </td>

            <td className="border border-black px-2 py-2 text-right">
              {formatCurrency(quotation.vatAmount)}
            </td>
          </tr>

          {/* Delivery */}
          <tr>
            <td colSpan={6}/>

            <td className="border border-black px-2 py-2 text-right font-semibold">
              Delivery Fee
            </td>

            <td className="border border-black px-2 py-2 text-right">
              {formatCurrency(quotation.deliveryFee)}
            </td>
          </tr>

          {/* Total */}
          <tr>
            <td colSpan={6}/>

            <td className="border border-black px-2 py-2 text-right text-sm font-bold">
              TOTAL
            </td>

            <td className="border border-black px-2 py-2 text-right text-sm font-bold">
              {formatCurrency(quotation.totalAmount)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Notes */}
      {quotation.notes && (
        <section className="mt-5">
          <p className="text-xs font-bold">Notes:</p>

          <p className="mt-1 text-xs leading-relaxed whitespace-pre-line">
            {quotation.notes}
          </p>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-10 border-t border-black pt-3 text-center text-[10px]">
        <p>Thank you for choosing FJ Glass and Aluminum.</p>
      </footer>
    </div>
  )
}
