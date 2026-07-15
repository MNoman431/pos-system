// utils/salePdfGenerator.js
import PDFDocument from "pdfkit";
import getStream from "get-stream";

export const generateSalePDF = async (sale) => {
  const doc = new PDFDocument({ margin: 50 });

  doc.fontSize(24).text("SALE INVOICE", { align: "center" });
  doc.moveDown();
  doc.text(`Invoice #: ${sale.invoiceNo}`);
  doc.text(`Customer: ${sale.customer.name}`);
  doc.text(`Phone: ${sale.customer.phone}`);
  doc.moveDown();

  doc.text("Items:");
  sale.items.forEach((item) => {
    doc.text(`${item.itemCode} - ${item.itemName} - ${item.qty} pcs - Rs.${item.lineTotal}`);
  });

  doc.text(`Grand Total: Rs.${sale.grandTotal}`, { align: "right" });
  doc.end();

  const pdfBuffer = await getStream.buffer(doc);
  return pdfBuffer;
};