import { NextResponse } from "next/server"

import { getOfficialReceiptServer } from "@/lib/official-receipts/get-official-receipt.server"
import { generateOfficialReceiptPdf } from "@/lib/pdf/generate-official-receipt-pdf"

interface RouteContext {
  params: Promise<{
    receiptId: string
  }>
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  try {
    const { receiptId } = await context.params

    if (!receiptId) {
      return NextResponse.json(
        {
          error: "Receipt ID is required.",
        },
        {
          status: 400,
        }
      )
    }

    // ----------------------------------------------------------
    // Load the receipt using the authenticated Supabase session.
    // RLS determines whether this user can access the receipt.
    // ----------------------------------------------------------

    const receipt =
      await getOfficialReceiptServer(receiptId)

    // ----------------------------------------------------------
    // Generate the PDF completely on the server.
    // ----------------------------------------------------------

    const pdfBuffer =
      await generateOfficialReceiptPdf(receipt)

    // ----------------------------------------------------------
    // Return the PDF to the browser.
    // ----------------------------------------------------------

    const fileName =
      `Official-Receipt-${receipt.receipt_number}.pdf`

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",

        // "inline" lets us inspect the PDF in the browser.
        "Content-Disposition":
          `inline; filename="${fileName}"`,

        "Cache-Control":
          "private, no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error(
      "Failed to generate official receipt PDF:",
      error
    )

    const message =
      error instanceof Error
        ? error.message
        : "Unable to generate official receipt PDF."

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    )
  }
}