import "server-only"

import { createElement, type ReactElement } from "react"
import {
  renderToBuffer,
  type DocumentProps,
} from "@react-pdf/renderer"

import type { OfficialReceipt } from "@/app/(client)/my-orders/types/official-receipt"

import { OfficialReceiptPdf } from "./official-receipt-pdf"

export async function generateOfficialReceiptPdf(
  receipt: OfficialReceipt
): Promise<Buffer> {
  const document = createElement(OfficialReceiptPdf, {
    receipt,
  }) as ReactElement<DocumentProps>

  const pdfBuffer = await renderToBuffer(document)

  return Buffer.from(pdfBuffer)
}