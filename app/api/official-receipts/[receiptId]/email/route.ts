import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { processOfficialReceiptEmail } from "@/lib/email/process-official-receipt-email"
import { getOfficialReceiptServer } from "@/lib/official-receipts/get-official-receipt.server"

interface RouteContext {
  params: Promise<{
    receiptId: string
  }>
}

export async function POST(
  _request: Request,
  context: RouteContext
) {
  try {
    const { receiptId } = await context.params

    if (!receiptId) {
      return NextResponse.json(
        {
          success: false,
          error: "Receipt ID is required.",
        },
        {
          status: 400,
        }
      )
    }

    const supabase = await createClient()

const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser()

if (authError || !user) {
  return NextResponse.json(
    {
      success: false,
      error: "Authentication required.",
    },
    {
      status: 401,
    }
  )
}

const { data: profile, error: profileError } = await supabase
  .from("profiles")
  .select("role")
  .eq("auth_user_id", user.id)
  .single()

if (profileError || !profile) {
  return NextResponse.json(
    {
      success: false,
      error: "Unable to verify administrator access.",
    },
    {
      status: 403,
    }
  )
}

if (profile.role !== "admin") {
  return NextResponse.json(
    {
      success: false,
      error: "Administrator access required.",
    },
    {
      status: 403,
    }
  )
}

    /*
     * Loads the receipt through the authenticated Supabase
     * session. Existing RLS policies determine whether the
     * current user can access it.
     */
    const receipt =
      await getOfficialReceiptServer(receiptId)

    const result =
      await processOfficialReceiptEmail(receipt)

    /*
     * A previously sent receipt is not an error.
     * No second Brevo request was made.
     */
    if (result.alreadySent) {
      return NextResponse.json({
        success: true,
        alreadySent: true,
        receiptNumber: receipt.receipt_number,
        recipient: receipt.customer_email,
        message:
          "Official receipt email has already been sent.",
        messageId: null,
      })
    }

    /*
     * The receipt/payment/delivery transaction has already
     * succeeded before this endpoint is called.
     *
     * Therefore an email failure only reports an email failure.
     */
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          alreadySent: false,
          receiptNumber: receipt.receipt_number,
          recipient: receipt.customer_email,
          error:
            result.error ??
            "Unable to send official receipt email.",
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json({
      success: true,
      alreadySent: false,
      receiptNumber: receipt.receipt_number,
      recipient: receipt.customer_email,
      message:
        "Official receipt email submitted successfully.",
      messageId: result.messageId,
    })
  } catch (error) {
    console.error(
      "Official receipt email endpoint failed:",
      error
    )

    const message =
      error instanceof Error
        ? error.message
        : "Unable to process official receipt email."

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      }
    )
  }
}