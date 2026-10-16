interface PrintQuotationOptions {
  documentId: string
  quotationNumber: string
}

export function printQuotation({
  documentId,
  quotationNumber,
}: PrintQuotationOptions) {
  const documentElement =
    document.getElementById(documentId)

  if (!documentElement) {
    throw new Error(
      "Quotation document could not be found."
    )
  }

  const printWindow = window.open(
    "",
    "_blank",
    "width=1000,height=800"
  )

  if (!printWindow) {
    throw new Error(
      "Unable to open the print window. Please allow pop-ups and try again."
    )
  }

  const styles = Array.from(
    document.querySelectorAll(
      'style, link[rel="stylesheet"]'
    )
  )
    .map((node) => node.outerHTML)
    .join("\n")

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${quotationNumber}</title>

        ${styles}

        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: white;
          }

          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          #${documentId} {
            margin: 0 auto !important;
          }

          @media print {
            html,
            body {
              width: 210mm;
              min-height: 297mm;
            }
          }
        </style>
      </head>

      <body>
        ${documentElement.outerHTML}
      </body>
    </html>
  `)

  printWindow.document.close()

  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
  }
}