
// // mny isko chota krdiya hai code ko utils/validators me aek function bna kr
// import Purchase from "../models/purchase.model.js";
// import InventoryItem from "../models/inventory.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { HttpError } from "../utils/httpError.js";
// import { validatePurchase } from "../utils/validators.js";
// import PDFDocument from "pdfkit";
// import { purchaseTrigger } from "../utils/triggers.js";

// // after cogs implemnt profit:
// // ================= CREATE PURCHASE INVOICE (COGS Ready) =================
// export const createPurchase = asyncHandler(async (req, res) => {
//   // 1) validate payload
//   try {
//     validatePurchase(req.body);
//   } catch (err) {
//     console.error("Validation failed:", err.message);
//     throw new HttpError(400, err.message);
//   }

//   const { vendor, items, discountValue = 0 } = req.body;

//   if (!req.vendor) throw new HttpError(400, "Vendor is required");
//   const vendorDoc = req.vendor;

//   let subTotal = 0;

//   // Process each item: update movingAvgCost & stock
//   const processedItems = await Promise.all(
//     items.map(async (item) => {
//       // Tum request me itemCode bhejte ho
//       const dbItem = await InventoryItem.findOne({ itemCode: item.itemCode });
//       if (!dbItem) throw new HttpError(404, `Item ${item.itemCode} not found`);

//       const qty = Number(item.qty || 0);
//       if (qty <= 0) throw new HttpError(400, "Invalid purchase qty");

//       // Purchase price policy:
//       // Tum currently InventoryItem.costPrice ko purchase price treat kar rahe ho.
//       // (Agar per-line costPrice request se lena ho to: const unitCost = Number(item.costPrice || dbItem.costPrice))
//       const unitCost = Number(dbItem.costPrice || 0);

//       // Line total
//       const lineTotal = unitCost * qty;
//       subTotal += lineTotal;

//       // ✅ Weighted Average Cost update
//       const oldQty = Number(dbItem.stockQty || 0);
//       const oldAvg = Number(dbItem.movingAvgCost || 0);
//       const totalOld = oldQty * oldAvg;
//       const totalNew = qty * unitCost;
//       const combinedQty = oldQty + qty;
//       const newAvg = combinedQty > 0 ? (totalOld + totalNew) / combinedQty : 0;

//       // Update stock & moving average
//       dbItem.stockQty = combinedQty;
//       dbItem.movingAvgCost = newAvg;
//       await dbItem.save();

//       return {
//         itemId: dbItem._id,
//         itemCode: dbItem.itemCode,
//         itemName: dbItem.name,
//         costPrice: unitCost,  // per line at time of purchase
//         qty,
//         lineTotal,
//       };
//     })
//   );

//   // 4) discount (fixed only — same as your code)
//   const discountAmount = Number(discountValue) || 0;
//   const grandTotal = Math.max(0, subTotal - discountAmount);

//   // 5) create purchase
//   const purchase = await Purchase.create({
//     vendor: { _id: vendorDoc._id, name: vendorDoc.name, email: vendorDoc.email },
//     subTotal,
//     discount: discountAmount,
//     grandTotal,
//     createdBy: req.user._id,
//     items: processedItems,
//   });

//   purchaseTrigger(purchase);
//   res.status(201).json({ success: true, data: purchase });
// });

// // ================= GET ALL PURCHASES =================
// export const getPurchases = asyncHandler(async (req, res) => {
//   const page = Math.max(Number(req.query.page) || 1, 1);
//   const limit = Math.min(Number(req.query.limit) || 10, 100);
//   const skip = (page - 1) * limit;

//   const total = await Purchase.countDocuments();

//   const purchases = await Purchase.find()
//     .populate("createdBy", "firstName lastName email")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);

//   res.json({
//     success: true,
//     meta: {
//       total,
//       page,
//       totalPages: Math.ceil(total / limit),
//       limit,
//     },
//     data: purchases,
//   });
// });

// // ================= GET SINGLE PURCHASE =================
// export const getPurchaseById = asyncHandler(async (req, res) => {
//   const purchase = await Purchase.findById(req.params.id)
//     .populate("createdBy", "firstName lastName email")
//     .populate("items.itemId", "itemCode name");

//   if (!purchase) throw new HttpError(404, "Purchase not found");

//   res.json({ success: true, data: purchase });
// });
// // ================= GENERATE PURCHASE PDF =================
// export const getPurchasePDF = asyncHandler(async (req, res) => {
//   const purchase = await Purchase.findById(req.params.id)
//     .populate("createdBy", "firstName lastName email")
//     .populate("items.itemId", "itemCode name");

//   if (!purchase) throw new HttpError(404, "Purchase not found");

//   // create document
//   const doc = new PDFDocument({ margin: 50 });

//   // headers
//   res.setHeader("Content-Type", "application/pdf");
//   res.setHeader(
//     "Content-Disposition",
//     `attachment; filename="purchase-${purchase.invoiceNo}.pdf"`
//   );

//   doc.pipe(res);

//   // title
//   doc.fontSize(24).font("Helvetica-Bold").text("PURCHASE INVOICE", { align: "center" });
//   doc.fontSize(10).font("Helvetica").text(`Invoice #: ${purchase.invoiceNo}`, { align: "center" });
//   doc.moveDown(0.5);

//   // date & user
//   const createdDate = new Date(purchase.createdAt).toLocaleDateString();
//   doc.fontSize(10).text(`Date: ${createdDate}`);
//   doc.text(`Created by: ${purchase.createdBy?.firstName} ${purchase.createdBy?.lastName}`);
//   doc.moveDown(1);

//   // vendor info
//   doc.fontSize(12).font("Helvetica-Bold").text("Vendor Information");
//   doc.fontSize(10).font("Helvetica");
//   doc.text(`Name: ${purchase.vendor.name}`);
//   doc.text(`Email: ${purchase.vendor.email}`);
//   doc.moveDown(1);

//   // items table
//   doc.fontSize(12).font("Helvetica-Bold").text("Items");
//   doc.moveDown(0.3);
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
//   doc.moveTo(50, tableTop + 15).lineTo(540, tableTop + 15).stroke();

//   let y = tableTop + 25;
//   doc.font("Helvetica");
//   purchase.items.forEach((item) => {
//     doc.fontSize(9).text(item.itemCode, col1, y);
//     doc.text(item.itemName, col2, y);
//     doc.text(String(item.qty), col3, y);
//     doc.text(`Rs. ${item.costPrice.toFixed(2)}`, col4, y);
//     doc.text(`Rs. ${item.lineTotal.toFixed(2)}`, col5, y);
//     y += 20;
//   });

//   doc.moveTo(50, y).lineTo(540, y).stroke();
//   y += 10;

//   doc.fontSize(10).font("Helvetica");
//   doc.text(`Subtotal: Rs. ${purchase.subTotal.toFixed(2)}`, col4, y);
//   y += 15;
// if (purchase.discount > 0) {
//   doc.text(`Discount: -Rs. ${purchase.discount.toFixed(2)}`, col4, y);
// }
//   doc.fontSize(12).font("Helvetica-Bold");
//   doc.text(`GRAND TOTAL: Rs. ${purchase.grandTotal.toFixed(2)}`, col4, y, { underline: true });

//   doc.end();
// });



import { asyncHandler } from "../utils/asyncHandler.js";
import { createPurchaseService, getPurchasesService, getPurchaseByIdService } from "../services/purchase.service.js";
import PDFDocument from "pdfkit";

export const createPurchase = asyncHandler(async (req, res) => {
  const purchase = await createPurchaseService(req.user, req.vendor, req.body.items, req.body.discountValue);
  res.status(201).json({ success: true, data: purchase });
});

export const getPurchases = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const data = await getPurchasesService(page, limit);
  res.json({ success: true, ...data });
});

export const getPurchaseById = asyncHandler(async (req, res) => {
  const purchase = await getPurchaseByIdService(req.params.id);
  res.json({ success: true, data: purchase });
});

// PDF generation can stay in controller
export const getPurchasePDF = asyncHandler(async (req, res) => {
  const purchase = await getPurchaseByIdService(req.params.id);
  
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="purchase-${purchase.invoiceNo}.pdf"`);
  doc.pipe(res);

  // ...rest of PDF generation code (same as current)
  doc.end();
});