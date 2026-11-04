"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import type { ClientSiteVisit } from "../../types/site-visit"

interface Props {
  visit: ClientSiteVisit | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function money(amount: number) {
  return `₱${amount.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDateTime(value: string | null) {
  if (!value) return "Not available"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Not available"

  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  }).format(date)
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }

    return entities[character]
  })
}

export function SiteVisitFeeSummaryDialog({
  visit,
  open,
  onOpenChange,
}: Props) {
  const isPaid = visit?.paymentStatus === "paid"
  const documentTitle = isPaid
    ? "On-Site Visit Payment Receipt"
    : "On-Site Visit Fee Summary"

  function handlePrint() {
    if (!visit) return

    const paid = visit.paymentStatus === "paid"
    const title = paid
      ? "On-Site Visit Payment Receipt"
      : "On-Site Visit Fee Summary"

    const paymentDetails = paid
      ? `
        <div class="payment-details">
          <p><strong>Payment Status:</strong> PAID</p>
          <p><strong>Payment Method:</strong> ${escapeHtml(
            visit.paymentMethod ?? "Cash"
          )}</p>
          <p><strong>Payment Date:</strong> ${escapeHtml(
            formatDateTime(visit.paidAt)
          )}</p>
          <p><strong>Received By:</strong> ${escapeHtml(
            visit.paymentReceivedBy ?? "FJGA Staff"
          )}</p>
        </div>
      `
      : ""

    const notice = paid
      ? "This document acknowledges the recorded cash payment for the on-site visit fees."
      : "This document is a summary of the on-site visit charges and is not proof of payment."

    const printWindow = window.open("", "_blank", "width=800,height=700")

    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>${escapeHtml(title)}</title>

          <style>
            @page {
              size: A4;
              margin: 20mm;
            }

            body {
              font-family: Arial, sans-serif;
              color: #222;
              margin: 0;
              line-height: 1.6;
            }

            .container {
              max-width: 650px;
              margin: 0 auto;
            }

            .header {
              text-align: center;
              border-bottom: 2px solid #222;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }

            h1 {
              font-size: 24px;
              margin: 0;
            }

            .subtitle {
              font-size: 14px;
              color: #666;
              margin-top: 5px;
              text-transform: uppercase;
            }

            .details,
            .payment-details {
              font-size: 14px;
              margin-bottom: 25px;
            }

            .details p,
            .payment-details p {
              margin: 6px 0;
            }

            .payment-details {
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }

            .fee-title {
              font-size: 15px;
              font-weight: bold;
              margin-bottom: 10px;
            }

            .row {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              padding: 10px 0;
              font-size: 14px;
            }

            .total {
              border-top: 2px solid #222;
              margin-top: 10px;
              padding-top: 15px;
              font-size: 18px;
              font-weight: bold;
            }

            .notice {
              margin-top: 35px;
              padding-top: 15px;
              border-top: 1px solid #ddd;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>

        <body>
          <div class="container">
            <div class="header">
              <h1>FJ Glass and Aluminum</h1>
              <p class="subtitle">${escapeHtml(title)}</p>
            </div>

            <div class="details">
              <p>
                <strong>Visit Reference:</strong>
                ${escapeHtml(visit.visitNumber)}
              </p>

              <p>
                <strong>Service:</strong>
                ${escapeHtml(visit.serviceName)}
              </p>

              <p>
                <strong>Scheduled Visit:</strong>
                ${escapeHtml(formatDateTime(visit.scheduledAt))}
              </p>

              <p>
                <strong>Location:</strong>
                ${escapeHtml(visit.address.barangayName)},
                ${escapeHtml(visit.address.cityName)}
              </p>

              <p>
                <strong>Visit Status:</strong>
                ${escapeHtml(visit.status)}
              </p>
            </div>

            <div class="fee-title">
              Service Fee Breakdown
            </div>

            <div class="row">
              <span>On-Site Measurement Service</span>
              <span>${money(visit.serviceFee)}</span>
            </div>

            ${visit.totalFee > visit.serviceFee + visit.travelFee + 0.005
  ? `
    <div class="row">
      <span>VAT (12% - Measurement Service)</span>
      <span>${money(
        Math.round((visit.totalFee - visit.serviceFee - visit.travelFee) * 100) / 100
      )}</span>
    </div>
  `
  : ""}

<div class="row">
  <span>Travel Fee</span>
  <span>${money(visit.travelFee)}</span>
</div>

            <div class="row total">
              <span>${paid ? "Total Amount Paid" : "Total Amount"}</span>
              <span>${money(visit.totalFee)}</span>
            </div>

            ${paymentDetails}

            <div class="notice">
              ${escapeHtml(notice)}
            </div>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  if (!visit) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-5">
          <DialogHeader>
            <DialogTitle>FJ Glass and Aluminum</DialogTitle>

            <p className="text-sm text-muted-foreground">{documentTitle}</p>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <p>
              <strong>Visit Reference:</strong> {visit.visitNumber}
            </p>

            <p>
              <strong>Service:</strong> {visit.serviceName}
            </p>

            <p>
              <strong>Scheduled Visit:</strong>{" "}
              {formatDateTime(visit.scheduledAt)}
            </p>

            <p>
              <strong>Location:</strong> {visit.address.barangayName},{" "}
              {visit.address.cityName}
            </p>

            <p>
              <strong>Visit Status:</strong> {visit.status}
            </p>
          </div>

          <div className="space-y-3 border-y py-4 text-sm">
            <div className="flex justify-between">
              <span>On-Site Measurement Service</span>
              <span>{money(visit.serviceFee)}</span>
            </div>
{visit.totalFee > visit.serviceFee + visit.travelFee + 0.005 && (
  <div className="flex justify-between">
    <span>VAT (12% - Measurement Service)</span>
    <span>
      {money(
        Math.round(
          (visit.totalFee - visit.serviceFee - visit.travelFee) * 100
        ) / 100
      )}
    </span>
  </div>
)}

<div className="flex justify-between">
  <span>Travel Fee</span>
  <span>{money(visit.travelFee)}</span>
</div>

            <div className="flex justify-between border-t pt-3 font-semibold">
              <span>{isPaid ? "Total Amount Paid" : "Total Amount"}</span>
              <span>{money(visit.totalFee)}</span>
            </div>
          </div>

          {isPaid && (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Payment Status:</strong> PAID
              </p>

              <p>
                <strong>Payment Method:</strong> {visit.paymentMethod ?? "Cash"}
              </p>

              <p>
                <strong>Payment Date:</strong> {formatDateTime(visit.paidAt)}
              </p>

              <p>
                <strong>Received By:</strong>{" "}
                {visit.paymentReceivedBy ?? "FJGA Staff"}
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {isPaid
              ? "This document acknowledges the recorded cash payment for the on-site visit fees."
              : "This document is a fee summary and is not proof of payment."}
          </p>
        </div>

        <Button type="button" onClick={handlePrint} className="w-full">
          {isPaid ? "Print Payment Receipt" : "Print Summary"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
