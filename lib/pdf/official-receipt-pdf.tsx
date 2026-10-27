import "server-only"

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

import type {
  OfficialReceipt,
  OfficialReceiptItem,
} from "@/app/(client)/my-orders/types/official-receipt"

interface OfficialReceiptPdfProps {
  receipt: OfficialReceipt
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 34,
    fontFamily: "Helvetica",
    fontSize: 8.5,
    color: "#000000",
    backgroundColor: "#ffffff",
  },

  // ============================================================
  // COMPANY HEADER
  // ============================================================

  companyHeader: {
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: "#000000",
  },

  companyOwner: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    letterSpacing: 0.6,
  },

  companyName: {
    marginTop: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },

  companyAddress: {
    marginTop: 7,
    fontSize: 8,
  },

  companyContact: {
    marginTop: 2,
    fontSize: 8,
  },

  // ============================================================
  // RECEIPT TITLE
  // ============================================================

  titleSection: {
    position: "relative",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 13,
  },

  title: {
    fontFamily: "Helvetica-Bold",
    fontSize: 15,
    letterSpacing: 0.8,
  },

  subtitle: {
    marginTop: 3,
    fontSize: 7.5,
    color: "#555555",
  },

  paidBadge: {
    position: "absolute",
    right: 0,
    top: 14,
    minWidth: 60,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 3,
    alignItems: "center",
  },

  paidBadgeText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    letterSpacing: 0.5,
  },

  // ============================================================
  // COMMON ROWS
  // ============================================================

  twoColumnSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  column: {
    width: "47%",
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  infoLabel: {
    width: 72,
    fontFamily: "Helvetica-Bold",
  },

  infoValue: {
    flex: 1,
  },

  // ============================================================
  // CUSTOMER
  // ============================================================

  customerSection: {
    marginTop: 11,
    paddingVertical: 11,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
  },

  customerRow: {
    flexDirection: "row",
    marginBottom: 6,
  },

  customerRowLast: {
    flexDirection: "row",
  },

  customerLabel: {
    width: 80,
    fontFamily: "Helvetica-Bold",
  },

  customerValue: {
    flex: 1,
    lineHeight: 1.35,
  },

  // ============================================================
  // ITEMS TABLE
  // ============================================================

  table: {
    marginTop: 14,
  },

  tableHeader: {
    flexDirection: "row",
    paddingVertical: 7,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: "#000000",
    fontFamily: "Helvetica-Bold",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#bdbdbd",
  },

  itemNumberColumn: {
    width: "8%",
    textAlign: "center",
  },

  productColumn: {
    width: "48%",
    paddingHorizontal: 4,
  },

  unitPriceColumn: {
    width: "17%",
    paddingHorizontal: 3,
    textAlign: "right",
  },

  quantityColumn: {
    width: "10%",
    textAlign: "center",
  },

  amountColumn: {
    width: "17%",
    paddingLeft: 3,
    textAlign: "right",
  },

  productName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
  },

  productDetail: {
    marginTop: 3,
    fontSize: 7,
    color: "#555555",
    lineHeight: 1.3,
  },

  // ============================================================
  // TOTALS
  // ============================================================

  totalsContainer: {
    marginTop: 17,
    marginLeft: "48%",
    width: "52%",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    paddingVertical: 7,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: "#000000",
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
  },

  paymentBreakdown: {
    marginTop: 9,
  },

  totalPaidRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
  },

  balanceBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: "#000000",
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },

  // ============================================================
  // PAYMENT DETAILS
  // ============================================================

  paymentSection: {
    marginTop: 17,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },

  sectionTitle: {
    marginBottom: 8,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 0.4,
  },

  paymentDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  paymentDetail: {
    width: "48%",
    flexDirection: "row",
  },

  paymentDetailLabel: {
    fontFamily: "Helvetica-Bold",
  },

  // ============================================================
  // FOOTER
  // ============================================================

  footer: {
    marginTop: 18,
    paddingTop: 9,
    borderTopWidth: 0.5,
    borderTopColor: "#bdbdbd",
    alignItems: "center",
    color: "#666666",
    fontSize: 7,
  },

  footerReceipt: {
    marginTop: 3,
  },
})

function formatCurrency(value: number | null | undefined) {
  return `PHP ${new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0))}`
}

function formatReceiptDate(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value))
}

function formatPaymentMethod(method: string) {
  switch (method) {
    case "cash_on_delivery":
      return "Cash on Delivery"

    case "gcash":
      return "GCash"

    case "card":
      return "Card"

    default:
      return method
  }
}

function formatDimensions(item: OfficialReceiptItem) {
  const dimensions = [
    item.width,
    item.height,
    item.depth,
  ].filter(
    (value): value is number =>
      value !== null && value !== undefined
  )

  if (dimensions.length === 0) {
    return null
  }

  return `${dimensions.join(" x ")}${
    item.dimension_unit ? ` ${item.dimension_unit}` : ""
  }`
}

export function OfficialReceiptPdf({
  receipt,
}: OfficialReceiptPdfProps) {
  return (
    <Document
      title={`Official Receipt ${receipt.receipt_number}`}
      author="FJ Glass and Aluminum"
      subject={`Official Receipt for ${receipt.order_number ?? "order"}`}
    >
      <Page size="A4" style={styles.page}>
        {/* ========================================================
            COMPANY HEADER
        ======================================================== */}

        <View style={styles.companyHeader}>
          <Text style={styles.companyOwner}>
            FELIX JUSAYAN
          </Text>

          <Text style={styles.companyName}>
            Glass and Aluminum Works
          </Text>

          <Text style={styles.companyAddress}>
            248 Camia St. Bancal, Meycauayan City of Bulacan
          </Text>

          <Text style={styles.companyContact}>
            09178777291 / 0917441866
          </Text>
        </View>

        {/* ========================================================
            TITLE
        ======================================================== */}

        <View style={styles.titleSection}>
          <Text style={styles.title}>
            OFFICIAL RECEIPT
          </Text>

          <Text style={styles.subtitle}>
            Proof of Full Payment
          </Text>

          <View style={styles.paidBadge}>
            <Text style={styles.paidBadgeText}>
              PAID
            </Text>
          </View>
        </View>

        {/* ========================================================
            RECEIPT INFORMATION
        ======================================================== */}

        <View style={styles.twoColumnSection}>
          <View style={styles.column}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Receipt No.:
              </Text>

              <Text style={styles.infoValue}>
                {receipt.receipt_number}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Order No.:
              </Text>

              <Text style={styles.infoValue}>
                {receipt.order_number ?? "—"}
              </Text>
            </View>
          </View>

          <View style={styles.column}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Date:
              </Text>

              <Text style={styles.infoValue}>
                {formatReceiptDate(receipt.issued_at)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Status:
              </Text>

              <Text style={styles.infoValue}>
                {receipt.payment_status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================
            CUSTOMER INFORMATION
        ======================================================== */}

        <View style={styles.customerSection}>
          <View style={styles.customerRow}>
            <Text style={styles.customerLabel}>
              Client Name:
            </Text>

            <Text style={styles.customerValue}>
              {receipt.customer_name}
            </Text>
          </View>

          <View style={styles.customerRow}>
            <Text style={styles.customerLabel}>
              Project:
            </Text>

            <Text style={styles.customerValue}>
              {receipt.project_name ?? "—"}
            </Text>
          </View>

          <View style={styles.customerRow}>
            <Text style={styles.customerLabel}>
              Address:
            </Text>

            <Text style={styles.customerValue}>
              {receipt.billing_address ?? "—"}
            </Text>
          </View>

          <View style={styles.customerRowLast}>
            <Text style={styles.customerLabel}>
              Contact No.:
            </Text>

            <Text style={styles.customerValue}>
              {receipt.customer_contact_number ?? "—"}
            </Text>
          </View>
        </View>

        {/* ========================================================
            ITEMS
        ======================================================== */}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.itemNumberColumn}>
              Item
            </Text>

            <Text style={styles.productColumn}>
              Materials / Product
            </Text>

            <Text style={styles.unitPriceColumn}>
              Unit Price
            </Text>

            <Text style={styles.quantityColumn}>
              QTY
            </Text>

            <Text style={styles.amountColumn}>
              Amount
            </Text>
          </View>

          {receipt.items.map((item, index) => {
            const dimensions = formatDimensions(item)

            return (
              <View
                key={item.id}
                style={styles.tableRow}
                wrap={false}
              >
                <Text style={styles.itemNumberColumn}>
                  {index + 1}
                </Text>

                <View style={styles.productColumn}>
                  <Text style={styles.productName}>
                    {item.product_name}
                  </Text>

                  {dimensions && (
                    <Text style={styles.productDetail}>
                      Dimensions: {dimensions}
                    </Text>
                  )}

                  {item.materials_snapshot?.map(
                    (material, materialIndex) => (
                      <Text
                        key={
                          material.material_id ??
                          `${item.id}-${materialIndex}`
                        }
                        style={styles.productDetail}
                      >
                        {material.material_name ?? "Material"}
                        {material.quantity != null
                          ? ` x ${material.quantity}`
                          : ""}
                        {material.unit
                          ? ` ${material.unit}`
                          : ""}
                      </Text>
                    )
                  )}
                </View>

                <Text style={styles.unitPriceColumn}>
                  {formatCurrency(item.unit_price)}
                </Text>

                <Text style={styles.quantityColumn}>
                  {item.quantity}
                </Text>

                <Text style={styles.amountColumn}>
                  {formatCurrency(item.line_total)}
                </Text>
              </View>
            )
          })}
        </View>

        {/* ========================================================
            TOTALS

            Do not add labor_total separately here because the
            receipt subtotal already represents the authoritative
            product pricing snapshot.
        ======================================================== */}

        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text>Product Total</Text>

            <Text>
              {formatCurrency(receipt.subtotal)}
            </Text>
          </View>

          {Number(receipt.vat_rate) > 0 && (
            <View style={styles.totalRow}>
              <Text>
                VAT ({Number(receipt.vat_rate).toFixed(2)}%)
              </Text>

              <Text>
                {formatCurrency(receipt.vat_amount)}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text>Delivery Fee</Text>

            <Text>
              {formatCurrency(receipt.delivery_fee)}
            </Text>
          </View>

          <View style={styles.grandTotalRow}>
            <Text>TOTAL</Text>

            <Text>
              {formatCurrency(receipt.total_amount)}
            </Text>
          </View>

          <View style={styles.paymentBreakdown}>
            <View style={styles.totalRow}>
              <Text>Previous Payments</Text>

              <Text>
                {formatCurrency(
                  receipt.amount_paid_before_final
                )}
              </Text>
            </View>

            <View style={styles.totalRow}>
              <Text>Final Payment</Text>

              <Text>
                {formatCurrency(
                  receipt.final_payment_amount
                )}
              </Text>
            </View>

            <View style={styles.totalPaidRow}>
              <Text>TOTAL PAID</Text>

              <Text>
                {formatCurrency(receipt.total_paid)}
              </Text>
            </View>
          </View>

          <View style={styles.balanceBox}>
            <Text>TOTAL BALANCE</Text>

            <Text>
              {formatCurrency(receipt.remaining_balance)}
            </Text>
          </View>
        </View>

        {/* ========================================================
            PAYMENT DETAILS
        ======================================================== */}

        <View style={styles.paymentSection} wrap={false}>
          <Text style={styles.sectionTitle}>
            PAYMENT DETAILS
          </Text>

          <View style={styles.paymentDetailsRow}>
            <View style={styles.paymentDetail}>
              <Text style={styles.paymentDetailLabel}>
                Final Payment Method:{" "}
              </Text>

              <Text>
                {formatPaymentMethod(receipt.payment_method)}
              </Text>
            </View>

            {receipt.payment_reference_number ? (
              <View style={styles.paymentDetail}>
                <Text style={styles.paymentDetailLabel}>
                  Reference No.:{" "}
                </Text>

                <Text>
                  {receipt.payment_reference_number}
                </Text>
              </View>
            ) : receipt.received_by_employee ? (
              <View style={styles.paymentDetail}>
                <Text style={styles.paymentDetailLabel}>
                  Received By:{" "}
                </Text>

                <Text>
                  {receipt.received_by_employee}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* ========================================================
            FOOTER
        ======================================================== */}

        <View style={styles.footer} wrap={false}>
          <Text>
            Thank you for choosing FJ Glass and Aluminum Works.
          </Text>

          <Text style={styles.footerReceipt}>
            Official Receipt No. {receipt.receipt_number}
          </Text>
        </View>
      </Page>
    </Document>
  )
}