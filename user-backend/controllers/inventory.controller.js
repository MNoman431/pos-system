
// import InventoryItem, { CATEGORY_ENUM } from "../models/inventory.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { HttpError } from "../utils/httpError.js";
// import { uploadBufferToSupabase } from "../utils/supabase.js";
// const BUCKET = process.env.SUPABASE_BUCKET;
// // create item
// export const createItem = asyncHandler(async (req, res) => {
//   const {
//     itemCode,
//     name,
//     category,
//     costPrice,
//     retailPrice,
//     wholesalePrice,
//     description,
//     vendor,
//   } = req.body;

//   if (!itemCode || !itemCode.trim())
//     throw new HttpError(400, "itemCode is required");
//   if (!/^\d{5}$/.test(itemCode)) {
//     throw new HttpError(400, "Item code must be exactly 5 digits");
//   }
//   if (!name || !name.trim()) throw new HttpError(400, "name is required");
//   if (!vendor) throw new HttpError(400, "vendor is required");

//   if (!CATEGORY_ENUM.includes(category)) {
//     throw new HttpError(
//       400,
//       `category must be one of: ${CATEGORY_ENUM.join(", ")}`
//     );
//   }

//   const cp = Number(costPrice);
//   const rp = Number(retailPrice);
//   const wp = Number(wholesalePrice);

//   if ([cp, rp, wp].some((n) => Number.isNaN(n) || n < 0)) {
//     throw new HttpError(400, "cost/retail/wholesale must be non-negative numbers");
//   }

//   let imageUrl = "";
//   if (req.file) {
//     try {
//       const { publicUrl } = await uploadBufferToSupabase({
//         bucket: BUCKET,
//         folder: "items",
//         filename: req.file.originalname,
//         buffer: req.file.buffer,
//         contentType: req.file.mimetype,
//       });
//       imageUrl = publicUrl;
//     } catch {
//       throw new HttpError(500, "Image upload failed");
//     }
//   }

//   const item = await InventoryItem.create({
//     itemCode: itemCode.trim(),
//     name: name.trim(),
//     category,
//     costPrice: cp,
//     retailPrice: rp,
//     wholesalePrice: wp,

//     // ✅ FORCE: stock ALWAYS starts at 0 (all stock must come via Purchase)
//     stockQty: 0,

//     // ✅ Seed moving average = master cost at creation
//     movingAvgCost: cp || 0,

//     imageUrl,
//     description: description ? String(description).trim() : "",
//     vendor,
//   });

//   res.status(201).json({ success: true, data: item });
// });

// // yeh after pagination:
// export const getItems = asyncHandler(async (req, res) => {
//   // 1 query se page & limit lo
//   const page = Math.max(Number(req.query.page) || 1, 1);
//   const limit = Math.min(Number(req.query.limit) || 10, 100);
//   // 2️ skip calculate
//   const skip = (page - 1) * limit;
//   // 3️ total count (for frontend pagination UI)
//   const totalItems = await InventoryItem.countDocuments();
//   // 4️ paginated data
//   const items = await InventoryItem.find()
//     .populate("vendor", "name email phone")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);
//   // 5️ response with meta
//   res.json({
//     success: true,
//     meta: {
//       totalItems,
//       currentPage: page,
//       totalPages: Math.ceil(totalItems / limit),
//       limit,
//     },
//     data: items,
//   });
// });             
// /* ================= GET SINGLE ITEM ================= */
// export const getItemById = asyncHandler(async (req, res) => {
//   const item = await InventoryItem.findById(req.params.id).populate(
//     "vendor",
//     "name email phone"
//   );

//   if (!item) throw new HttpError(404, "Item not found");
//   res.json({ success: true, data: item });
// });

// // after profit cogs implement:
// export const updateItem = asyncHandler(async (req, res) => {
//   const body = req.body || {};
//   const update = {};

//   // ❌ Disallow manual stock updates (must come via Purchase/Sale)
//   if (body.stockQty !== undefined) {
//     throw new HttpError(400, "stockQty cannot be updated manually");
//   }

//   // ❌ Disallow manual moving average updates
//   if (body.movingAvgCost !== undefined) {
//     throw new HttpError(400, "movingAvgCost cannot be updated manually");
//   }

//   if (body.name !== undefined) {
//     const v = String(body.name).trim();
//     if (!v) throw new HttpError(400, "name cannot be empty");
//     update.name = v;
//   }

//   if (body.category !== undefined) {
//     if (!CATEGORY_ENUM.includes(body.category)) {
//       throw new HttpError(
//         400,
//         `category must be one of: ${CATEGORY_ENUM.join(", ")}`
//       );
//     }
//     update.category = body.category;
//   }

//   if (body.costPrice !== undefined) {
//     const v = Number(body.costPrice);
//     if (Number.isNaN(v) || v < 0)
//       throw new HttpError(400, "costPrice must be a non-negative number");
//     update.costPrice = v;
//   }

//   if (body.retailPrice !== undefined) {
//     const v = Number(body.retailPrice);
//     if (Number.isNaN(v) || v < 0)
//       throw new HttpError(400, "retailPrice must be a non-negative number");
//     update.retailPrice = v;
//   }

//   if (body.wholesalePrice !== undefined) {
//     const v = Number(body.wholesalePrice);
//     if (Number.isNaN(v) || v < 0)
//       throw new HttpError(400, "wholesalePrice must be a non-negative number");
//     update.wholesalePrice = v;
//   }

//   if (body.description !== undefined) {
//     update.description = String(body.description).trim();
//   }

//   // vendor update allowed
//   if (body.vendor !== undefined) {
//     update.vendor = body.vendor;
//   }

//   if (req.file) {
//     try {
//       const { publicUrl } = await uploadBufferToSupabase({
//         bucket: BUCKET,
//         folder: "items",
//         filename: req.file.originalname,
//         buffer: req.file.buffer,
//         contentType: req.file.mimetype,
//       });
//       update.imageUrl = publicUrl;
//     } catch {
//       throw new HttpError(500, "Image upload failed");
//     }
//   }

//   try {
//     const updated = await InventoryItem.findByIdAndUpdate(
//       req.params.id,
//       update,
//       { new: true, runValidators: true }
//     ).populate("vendor", "name email phone");

//     if (!updated) throw new HttpError(404, "Item not found");
//     res.json({ success: true, data: updated });
//   } catch (err) {
//     if (err?.code === 11000 && err?.keyPattern?.itemCode) {
//       throw new HttpError(409, "Item code already exists");
//     }
//     throw err;
//   }
// });


// /* ================= DELETE ITEM ================= */
// export const deleteItem = asyncHandler(async (req, res) => {
//   const deleted = await InventoryItem.findByIdAndDelete(req.params.id);
//   if (!deleted) throw new HttpError(404, "Item not found");
//   res.json({ success: true, message: "Item deleted", data: deleted });
// });

// /* ================= DUPLICATE ITEM CODE CHECK ================= */
// export const checkItemCode = asyncHandler(async (req, res) => {
//   const code = String(req.query.itemCode || "").trim();
//   if (!code) throw new HttpError(400, "itemCode query param required");

//   const exists = await InventoryItem.exists({ itemCode: code });
//   res.json({ success: true, exists: !!exists });
// });





// export const getItemByCode = asyncHandler(async (req, res) => {
//   const code = String(req.query.itemCode || "").trim();

//   if (!/^\d{5}$/.test(code)) {
//     throw new HttpError(400, "Invalid item code");
//   }

//   const item = await InventoryItem.findOne({ itemCode: code })
//     .select("itemCode name costPrice");

//   if (!item) {
//     throw new HttpError(404, "Item not found");
//   }

//   res.json({
//     success: true,
//     data: item,
//   });
// });

// inventory.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import * as inventoryService from "../services/inventory.service.js";

// CREATE ITEM
export const createItem = asyncHandler(async (req, res) => {
  const item = await inventoryService.createItemService(req.body, req.file);
  res.status(201).json({ success: true, data: item });
});

// GET ITEMS WITH PAGINATION
export const getItems = asyncHandler(async (req, res) => {
  const result = await inventoryService.getItemsService(req.query.page, req.query.limit);
  res.json({ success: true, ...result });
});

// GET SINGLE ITEM
export const getItemById = asyncHandler(async (req, res) => {
  const item = await inventoryService.getItemByIdService(req.params.id);
  res.json({ success: true, data: item });
});

// UPDATE ITEM
export const updateItem = asyncHandler(async (req, res) => {
  const updated = await inventoryService.updateItemService(req.params.id, req.body, req.file);
  res.json({ success: true, data: updated });
});

// DELETE ITEM
export const deleteItem = asyncHandler(async (req, res) => {
  const deleted = await inventoryService.deleteItemService(req.params.id);
  res.json({ success: true, message: "Item deleted", data: deleted });
});

// CHECK DUPLICATE ITEM CODE
export const checkItemCode = asyncHandler(async (req, res) => {
  const exists = await inventoryService.checkItemCodeService(req.query.itemCode);
  res.json({ success: true, exists });
});

// GET ITEM BY CODE
export const getItemByCode = asyncHandler(async (req, res) => {
  const item = await inventoryService.getItemByCodeService(req.query.itemCode);
  res.json({ success: true, data: item });
});