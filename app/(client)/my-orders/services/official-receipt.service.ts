import { createClient } from "@/lib/supabase/client"

import type {
  OfficialReceipt,
  OfficialReceiptItem,
} from "../types/official-receipt"

const supabase = createClient()

type OfficialReceiptRow = Omit<OfficialReceipt, "items">

/**
 * Get the official receipt belonging to a specific order.
 *
 * RLS ensures that a client can only retrieve a receipt
 * belonging to their own profile.
 */
export async function getOfficialReceiptByOrderId(
  orderId: string
): Promise<OfficialReceipt | null> {
  const { data: receipt, error: receiptError } = await supabase
    .from("official_receipts")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle()

  if (receiptError) {
    throw new Error(receiptError.message)
  }

  if (!receipt) {
    return null
  }

  const { data: items, error: itemsError } = await supabase
    .from("official_receipt_items")
    .select("*")
    .eq("official_receipt_id", receipt.id)
    .order("created_at", { ascending: true })

  if (itemsError) {
    throw new Error(itemsError.message)
  }

  return {
    ...(receipt as OfficialReceiptRow),
    items: (items ?? []) as OfficialReceiptItem[],
  }
}

/**
 * Get an official receipt directly by its receipt ID.
 *
 * Useful later for a dedicated receipt page/dialog.
 */
export async function getOfficialReceiptById(
  receiptId: string
): Promise<OfficialReceipt | null> {
  const { data: receipt, error: receiptError } = await supabase
    .from("official_receipts")
    .select("*")
    .eq("id", receiptId)
    .maybeSingle()

  if (receiptError) {
    throw new Error(receiptError.message)
  }

  if (!receipt) {
    return null
  }

  const { data: items, error: itemsError } = await supabase
    .from("official_receipt_items")
    .select("*")
    .eq("official_receipt_id", receipt.id)
    .order("created_at", { ascending: true })

  if (itemsError) {
    throw new Error(itemsError.message)
  }

  return {
    ...(receipt as OfficialReceiptRow),
    items: (items ?? []) as OfficialReceiptItem[],
  }
}