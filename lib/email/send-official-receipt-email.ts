import "server-only"

import type { OfficialReceipt } from "@/app/(client)/my-orders/types/official-receipt"

import { sendBrevoEmail } from "@/lib/email/brevo"
import { generateOfficialReceiptPdf } from "@/lib/pdf/generate-official-receipt-pdf"

function escapeHtml(value: string | null | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function formatCurrency(value: number | null | undefined) {
  return `PHP ${new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0))}`
}

export async function sendOfficialReceiptEmail(
  receipt: OfficialReceipt
) {
  if (!receipt.customer_email) {
    throw new Error(
      "The official receipt does not contain a customer email address."
    )
  }

  if (receipt.payment_status !== "paid") {
    throw new Error(
      "Only paid official receipts can be emailed."
    )
  }

  const pdfBuffer =
    await generateOfficialReceiptPdf(receipt)

  const attachmentName =
    `Official-Receipt-${receipt.receipt_number}.pdf`

  const customerName = escapeHtml(receipt.customer_name)
  const receiptNumber = escapeHtml(receipt.receipt_number)
  const orderNumber = escapeHtml(
    receipt.order_number ?? "Not available"
  )

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
          font-family: Arial, Helvetica, sans-serif;
          color: #222222;
        "
      >
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="background-color: #f5f5f5; padding: 32px 16px;"
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  max-width: 620px;
                  background-color: #ffffff;
                  border: 1px solid #e5e5e5;
                "
              >
                <tr>
                  <td
                    style="
                      padding: 28px 32px;
                      text-align: center;
                      border-bottom: 1px solid #dddddd;
                    "
                  >
                    <div
                      style="
                        font-size: 22px;
                        font-weight: 700;
                        letter-spacing: 0.3px;
                      "
                    >
                      FJ Glass and Aluminum
                    </div>

                    <div
                      style="
                        margin-top: 6px;
                        font-size: 13px;
                        color: #666666;
                      "
                    >
                      Official Receipt
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 32px;">
                    <p
                      style="
                        margin: 0 0 18px;
                        font-size: 15px;
                        line-height: 1.6;
                      "
                    >
                      Hello ${customerName},
                    </p>

                    <p
                      style="
                        margin: 0 0 24px;
                        font-size: 14px;
                        line-height: 1.7;
                        color: #444444;
                      "
                    >
                      Thank you for your payment. Your order has
                      been fully paid and your official receipt is
                      attached to this email.
                    </p>

                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        border-collapse: collapse;
                        margin-bottom: 26px;
                      "
                    >
                      <tr>
                        <td
                          style="
                            padding: 10px 0;
                            border-bottom: 1px solid #eeeeee;
                            font-size: 13px;
                            color: #666666;
                          "
                        >
                          Receipt Number
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 10px 0;
                            border-bottom: 1px solid #eeeeee;
                            font-size: 13px;
                            font-weight: 600;
                          "
                        >
                          ${receiptNumber}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 10px 0;
                            border-bottom: 1px solid #eeeeee;
                            font-size: 13px;
                            color: #666666;
                          "
                        >
                          Order Number
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 10px 0;
                            border-bottom: 1px solid #eeeeee;
                            font-size: 13px;
                            font-weight: 600;
                          "
                        >
                          ${orderNumber}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 10px 0;
                            border-bottom: 1px solid #eeeeee;
                            font-size: 13px;
                            color: #666666;
                          "
                        >
                          Total Amount
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 10px 0;
                            border-bottom: 1px solid #eeeeee;
                            font-size: 13px;
                            font-weight: 600;
                          "
                        >
                          ${formatCurrency(receipt.total_amount)}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 10px 0;
                            border-bottom: 1px solid #eeeeee;
                            font-size: 13px;
                            color: #666666;
                          "
                        >
                          Total Paid
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 10px 0;
                            border-bottom: 1px solid #eeeeee;
                            font-size: 13px;
                            font-weight: 600;
                          "
                        >
                          ${formatCurrency(receipt.total_paid)}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style="
                            padding: 10px 0;
                            font-size: 13px;
                            font-weight: 700;
                          "
                        >
                          Remaining Balance
                        </td>

                        <td
                          align="right"
                          style="
                            padding: 10px 0;
                            font-size: 13px;
                            font-weight: 700;
                          "
                        >
                          ${formatCurrency(
                            receipt.remaining_balance
                          )}
                        </td>
                      </tr>
                    </table>

                    <div
                      style="
                        padding: 14px 16px;
                        border: 1px solid #222222;
                        text-align: center;
                        font-size: 14px;
                        font-weight: 700;
                        letter-spacing: 0.5px;
                      "
                    >
                      PAID IN FULL
                    </div>

                    <p
                      style="
                        margin: 26px 0 0;
                        font-size: 13px;
                        line-height: 1.7;
                        color: #666666;
                      "
                    >
                      Please keep the attached PDF for your
                      records.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 20px 32px;
                      border-top: 1px solid #eeeeee;
                      text-align: center;
                      font-size: 11px;
                      line-height: 1.6;
                      color: #777777;
                    "
                  >
                    FJ Glass and Aluminum Works<br />
                    248 Camia St. Bancal, Meycauayan City of Bulacan<br />
                    09178777291 / 0917441866
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  const textContent = [
    "FJ Glass and Aluminum",
    "",
    `Hello ${receipt.customer_name},`,
    "",
    "Thank you for your payment. Your order has been fully paid.",
    "",
    `Receipt Number: ${receipt.receipt_number}`,
    `Order Number: ${receipt.order_number ?? "Not available"}`,
    `Total Amount: ${formatCurrency(receipt.total_amount)}`,
    `Total Paid: ${formatCurrency(receipt.total_paid)}`,
    `Remaining Balance: ${formatCurrency(
      receipt.remaining_balance
    )}`,
    "",
    "Your official receipt PDF is attached to this email.",
    "",
    "FJ Glass and Aluminum Works",
  ].join("\n")

  return sendBrevoEmail({
    to: {
      email: receipt.customer_email,
      name: receipt.customer_name,
    },

    subject:
      `Official Receipt ${receipt.receipt_number} - FJ Glass and Aluminum`,

    htmlContent,
    textContent,

    attachments: [
      {
        name: attachmentName,
        content: pdfBuffer.toString("base64"),
      },
    ],
  })
}