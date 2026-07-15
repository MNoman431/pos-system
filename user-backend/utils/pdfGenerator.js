import PDFDocument from "pdfkit";
import getStream from "get-stream"; // import default

export const generatePurchasePDF = async (purchase) => {
  const doc = new PDFDocument({ margin: 50 });

  // PDF content
  doc.fontSize(24).text("PURCHASE INVOICE", { align: "center" });
  doc.moveDown();
  doc.text(`Invoice #: ${purchase.invoiceNo}`);
  doc.text(`Vendor: ${purchase.vendor.name}`);
  doc.text(`Email: ${purchase.vendor.email}`);
  doc.moveDown();

  doc.text("Items:");
  purchase.items.forEach((item) => {
    doc.text(`${item.itemCode} - ${item.itemName} - ${item.qty} pcs - Rs.${item.lineTotal}`);
  });

  doc.text(`Grand Total: Rs.${purchase.grandTotal}`, { align: "right" });

  doc.end();

  // convert stream to buffer
  const pdfBuffer = await getStream.buffer(doc); // ye ab sahi hai
  return pdfBuffer;
};