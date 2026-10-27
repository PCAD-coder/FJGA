interface PrintOfficialReceiptOptions {
  documentId: string
  receiptNumber: string
}

export function printOfficialReceipt({
  documentId,
  receiptNumber,
}: PrintOfficialReceiptOptions) {
  const receiptElement = document.getElementById(documentId)

  if (!receiptElement) {
    throw new Error("Official receipt document was not found.")
  }

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=700"
  )

  if (!printWindow) {
    throw new Error(
      "Unable to open the print window. Please allow pop-ups and try again."
    )
  }

  const styles = Array.from(
    document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>(
      'link[rel="stylesheet"], style'
    )
  )
    .map((style) => style.outerHTML)
    .join("\n")

  printWindow.document.open()

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />

        <title>${receiptNumber}</title>

        ${styles}

       <style>
  @page {
    size: A4 portrait;
    margin: 8mm;
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
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    box-shadow: none !important;
  }

  @media print {
    html,
    body {
      width: 100%;
      height: auto;
      overflow: visible !important;
    }

    #${documentId} {
      width: 100% !important;
      max-width: none !important;
      overflow: visible !important;

      /*
       * Slightly reduce the receipt for A4 printing.
       * This affects only the isolated print window,
       * not the receipt shown inside My Orders.
       */
      zoom: 0.82;
    }

    #${documentId} * {
      box-sizing: border-box;
    }

    #${documentId} .overflow-x-auto {
      overflow: visible !important;
    }

    #${documentId} table {
      width: 100% !important;
      min-width: 0 !important;
    }
  }
</style>
      </head>

      <body>
        ${receiptElement.outerHTML}
      </body>
    </html>
  `)

  printWindow.document.close()

  printWindow.focus()

  printWindow.onload = () => {
    window.setTimeout(() => {
      printWindow.print()
    }, 250)
  }
}