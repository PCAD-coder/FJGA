import "server-only"

import { createClient } from "@/lib/supabase/server"

import type {
  OfficialReceipt,
  OfficialReceiptItem,
} from "@/app/(client)/my-orders/types/official-receipt"

export async function getOfficialReceiptServer(
  receiptId: string
): Promise<OfficialReceipt> {
  const supabase = await createClient()

  // ------------------------------------------------------------
  // 1. Verify that the request has an authenticated user.
  // ------------------------------------------------------------

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError) {
    throw new Error(authError.message)
  }

  if (!user) {
    throw new Error("Authentication required.")
  }

  // ------------------------------------------------------------
  // 2. Load the receipt.
  //
  // RLS remains responsible for deciding whether this user is
  // allowed to see this particular receipt.
  // ------------------------------------------------------------

  const { data: receipt, error: receiptError } = await supabase
    .from("official_receipts")
    .select("*")
    .eq("id", receiptId)
    .single()

  if (receiptError) {
    throw new Error(
      `Unable to load official receipt: ${receiptError.message}`
    )
  }

  if (!receipt) {
    throw new Error("Official receipt not found.")
  }

  // ------------------------------------------------------------
  // 3. Load the immutable receipt item snapshots.
  //
  // Their own RLS policies also apply here.
  // ------------------------------------------------------------

  const { data: items, error: itemsError } = await supabase
    .from("official_receipt_items")
    .select("*")
    .eq("official_receipt_id", receiptId)
    .order("created_at", {
      ascending: true,
    })

  if (itemsError) {
    throw new Error(
      `Unable to load official receipt items: ${itemsError.message}`
    )
  }

  if (!items || items.length === 0) {
    throw new Error(
      "Official receipt does not contain any receipt items."
    )
  }

  return {
    ...receipt,
    items: items as OfficialReceiptItem[],
  } as OfficialReceipt
}