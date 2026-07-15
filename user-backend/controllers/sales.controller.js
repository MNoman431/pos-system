
// import Sale from "../models/sale.model.js";
// import InventoryItem from "../models/inventory.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { HttpError } from "../utils/httpError.js";
// import PDFDocument from "pdfkit";
// import { saleTrigger } from "../utils/triggers.js";



// // ================= CREATE SALE INVOICE (COGS Ready) =================
// export const createSale = asyncHandler(async (req, res) => {
//   const { customer, items, discountType = "fixed", discountValue = 0 } = req.body;

//   if (!customer || !customer.name) throw new HttpError(400, "Customer name is required");
//   if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, "At least one sale item is required");

//   let subTotal = 0;
//   let cogsTotal = 0;

//   const processedItems = await Promise.all(
//     items.map(async (item) => {
//       const dbItem = await InventoryItem.findById(item.itemId);
//       if (!dbItem) throw new HttpError(404, `Item ${item.itemId} not found`);

//       const qty = Number(item.qty || 0);
//       if (qty <= 0) throw new HttpError(400, "Invalid sale qty");

//       if (dbItem.stockQty < qty) throw new HttpError(400, `${dbItem.name} stock is not enough`);

//       // Selling price from master (retail)
//       const unitPrice = Number(dbItem.retailPrice || 0);
//       const lineTotal = unitPrice * qty;
//       subTotal += lineTotal;

//       // ✅ Stamp cost at sale time (moving average)
//       // Fallback: if movingAvg missing, use costPrice
//       const unitCostAtSale = Number(dbItem.movingAvgCost ?? dbItem.costPrice ?? 0);
//       const lineCOGS = unitCostAtSale * qty;
//       cogsTotal += lineCOGS;

//       // decrease stock
//       dbItem.stockQty = dbItem.stockQty - qty;
//       await dbItem.save();

//       return {
//         itemId: dbItem._id,
//         itemCode: dbItem.itemCode,
//         itemName: dbItem.name,
//         price: unitPrice,
//         qty,
//         lineTotal,

//         // ✅ NEW FIELDS
//         unitCostAtSale,
//         lineCOGS,
//       };
//     })
//   );

//   const discountAmount =
//     discountType === "percent" ? (subTotal * Number(discountValue || 0)) / 100 : Number(discountValue || 0);

//   const grandTotal = Math.max(0, subTotal - discountAmount);

//   const sale = await Sale.create({
//     customer,
//     items: processedItems,
//     subTotal,
//     discount: discountAmount,
//     discountType,
//     grandTotal,

//     // ✅ NEW
//     cogsTotal,

//     createdBy: req.user._id,
//   });

//   saleTrigger(sale);
//   res.status(201).json({
//     success: true,
//     message: "Sale invoice created successfully",
//     data: sale,
//   });
// });

// // ================= GET ALL SALES =================
// export const getSales = asyncHandler(async (req, res) => {
//   const page = Math.max(Number(req.query.page) || 1, 1);
//   const limit = Math.min(Number(req.query.limit) || 10, 100);
//   const skip = (page - 1) * limit;

//   const total = await Sale.countDocuments();

//   const sales = await Sale.find()
//     .populate("createdBy", "firstName lastName email")
//     .populate("items.itemId", "itemCode name")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);

//   res.json({
//     success: true,
//     meta: { total, page, totalPages: Math.ceil(total / limit), limit },
//     data: sales,
//   });
// });

// // ================= GET SINGLE SALE =================
// export const getSaleById = asyncHandler(async (req, res) => {
//   const sale = await Sale.findById(req.params.id)
//     .populate("createdBy", "firstName lastName email")
//     .populate("items.itemId", "itemCode name");

//   if (!sale) throw new HttpError(404, "Sale not found");

//   res.json({ success: true, data: sale });
// });

// // ================= GENERATE SALE PDF =================
// export const getSalePDF = asyncHandler(async (req, res) => {
//   const sale = await Sale.findById(req.params.id)
//     .populate("createdBy", "firstName lastName email")
//     .populate("items.itemId", "itemCode name");

//   if (!sale) throw new HttpError(404, "Sale not found");

//   // Create PDF document
//   const doc = new PDFDocument({ margin: 50 });

//   // Set response headers
//   res.setHeader("Content-Type", "application/pdf");
//   res.setHeader("Content-Disposition", `attachment; filename="invoice-${sale.invoiceNo}.pdf"`);

//   // Pipe to response
//   doc.pipe(res);

//   // ===== HEADER =====
//   doc.fontSize(24).font("Helvetica-Bold").text("SALES INVOICE", { align: "center" });
//   doc.fontSize(10).font("Helvetica").text(`Invoice #: ${sale.invoiceNo}`, { align: "center" });
//   doc.moveDown(0.5);

//   // ===== DATE & USER INFO =====
//   const createdDate = new Date(sale.createdAt).toLocaleDateString();
//   doc.fontSize(10).text(`Date: ${createdDate}`);
//   doc.text(`Created by: ${sale.createdBy?.firstName} ${sale.createdBy?.lastName}`);
//   doc.moveDown(1);

//   // ===== CUSTOMER INFO =====
//   doc.fontSize(12).font("Helvetica-Bold").text("Customer Information");
//   doc.fontSize(10).font("Helvetica");
//   doc.text(`Name: ${sale.customer.name}`);
//   doc.text(`Phone: ${sale.customer.phone || "N/A"}`);
//   doc.moveDown(1);

//   // ===== ITEMS TABLE =====
//   doc.fontSize(12).font("Helvetica-Bold").text("Items");
//   doc.moveDown(0.3);

//   // Table header
//   const tableTop = doc.y;
//   const col1 = 50;
//   const col2 = 180;
//   const col3 = 280;
//   const col4 = 380;
//   const col5 = 480;

//   doc.fontSize(10).font("Helvetica-Bold");
//   doc.text("Code", col1, tableTop);
//   doc.text("Item Name", col2, tableTop);
//   doc.text("Qty", col3, tableTop);
//   doc.text("Price", col4, tableTop);
//   doc.text("Total", col5, tableTop);

//   // Underline header
//   doc.moveTo(50, tableTop + 15).lineTo(540, tableTop + 15).stroke();

//   // Table rows
//   let y = tableTop + 25;
//   doc.font("Helvetica");
//   sale.items.forEach((item) => {
//     doc.fontSize(9).text(item.itemCode, col1, y);
//     doc.text(item.itemName, col2, y);
//     doc.text(String(item.qty), col3, y);
//     doc.text(`Rs. ${item.price.toFixed(2)}`, col4, y);
//     doc.text(`Rs. ${item.lineTotal.toFixed(2)}`, col5, y);
//     y += 20;
//   });

//   // Bottom line
//   doc.moveTo(50, y).lineTo(540, y).stroke();
//   y += 10;

//   // ===== TOTALS SECTION =====
//   doc.fontSize(10).font("Helvetica");
//   doc.text(`Subtotal: Rs. ${sale.subTotal.toFixed(2)}`, col4, y);
//   y += 15;

//   if (sale.discount > 0) {
//     doc.text(`Discount (${sale.discountType}): -Rs. ${sale.discount.toFixed(2)}`, col4, y);
//     y += 15;
//   }

//   // Grand total highlight
//   doc.fontSize(12).font("Helvetica-Bold");
//   doc.text(`GRAND TOTAL: Rs. ${sale.grandTotal.toFixed(2)}`, col4, y, { underline: true });

//   // ===== END PDF =====
//   doc.end();
// });

import { asyncHandler } from "../utils/asyncHandler.js";
import PDFDocument from "pdfkit";
import { createSaleService, getSalesService, getSaleByIdService } from "../services/sale.service.js";

export const createSale = asyncHandler(async (req, res) => {
  const { customer, items, discountType, discountValue } = req.body;
  const sale = await createSaleService(req.user, customer, items, discountType, discountValue);
  res.status(201).json({ success: true, message: "Sale invoice created successfully", data: sale });
});

export const getSales = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const data = await getSalesService(page, limit);
  res.json({ success: true, ...data });
});

export const getSaleById = asyncHandler(async (req, res) => {
  const sale = await getSaleByIdService(req.params.id);
  res.json({ success: true, data: sale });
});

// PDF generation stays in controller (presentation layer)
export const getSalePDF = asyncHandler(async (req, res) => {
  const sale = await getSaleByIdService(req.params.id);

  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="invoice-${sale.invoiceNo}.pdf"`);
  doc.pipe(res);

  // ...rest of PDF generation code remains same
  doc.end();
});