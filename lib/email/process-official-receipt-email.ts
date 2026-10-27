import "server-only"

import { createClient } from "@/lib/supabase/server"
import { sendOfficialReceiptEmail } from "@/lib/email/send-official-receipt-email"

import type { OfficialReceipt } from "@/app/(client)/my-orders/types/official-receipt"

interface ProcessOfficialReceiptEmailResult {
  success: boolean
  alreadySent: boolean
  messageId: string | null
  error: string | null
}

export async function processOfficialReceiptEmail(
  receipt: OfficialReceipt
): Promise<ProcessOfficialReceiptEmailResult> {
  const supabase = await createClient()

  // ------------------------------------------------------------
  // Prevent normal duplicate sends.
  // ------------------------------------------------------------

  if (receipt.email_status === "sent") {
    return {
      success: true,
      alreadySent: true,
      messageId: null,
      error: null,
    }
  }

  try {
    // ----------------------------------------------------------
    // Generate PDF + submit email to Brevo.
    // ----------------------------------------------------------

    const result =
      await sendOfficialReceiptEmail(receipt)

    // ----------------------------------------------------------
    // Brevo accepted the email.
    // Record the successful attempt.
    // ----------------------------------------------------------

    const { error: statusError } = await supabase.rpc(
      "update_official_receipt_email_status",
      {
        p_receipt_id: receipt.id,
        p_success: true,
        p_error_message: null,
      }
    )

    if (statusError) {
      /*
       * Important:
       *
       * The email may already have been accepted by Brevo.
       * Therefore we MUST NOT attempt to send it again here.
       */
      console.error(
        "Receipt email was submitted, but its email status could not be updated:",
        statusError
      )

      throw new Error(
        `The receipt email was submitted, but its email status could not be updated: ${statusError.message}`
      )
    }

    return {
      success: true,
      alreadySent: false,
      messageId:
        result.messageId ??
        result.messageIds?.[0] ??
        null,
      error: null,
    }
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown official receipt email error."

    /*
     * There is one special case:
     *
     * If Brevo succeeded but our SUCCESS status RPC failed,
     * we don't want to immediately change the receipt to "failed",
     * because the customer may already have received the email.
     *
     * We'll distinguish that case below.
     */

    if (
      message.startsWith(
        "The receipt email was submitted, but its email status could not be updated:"
      )
    ) {
      return {
        success: false,
        alreadySent: false,
        messageId: null,
        error: message,
      }
    }

    // ----------------------------------------------------------
    // Email generation/Brevo submission actually failed.
    // Record a failed attempt.
    // ----------------------------------------------------------

    const { error: statusError } = await supabase.rpc(
      "update_official_receipt_email_status",
      {
        p_receipt_id: receipt.id,
        p_success: false,
        p_error_message: message,
      }
    )

    if (statusError) {
      console.error(
        "Failed to record official receipt email failure:",
        statusError
      )
    }

    return {
      success: false,
      alreadySent: false,
      messageId: null,
      error: message,
    }
  }
}