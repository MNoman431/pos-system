// inventory.service.js
import InventoryItem, { CATEGORY_ENUM } from "../models/inventory.model.js";
import { HttpError } from "../utils/httpError.js";
import { uploadBufferToSupabase } from "../utils/supabase.js";

const BUCKET = process.env.SUPABASE_BUCKET;

// CREATE ITEM
export const createItemService = async (data, file) => {
  const { itemCode, name, category, costPrice, retailPrice, wholesalePrice, description, vendor } = data;

  if (!itemCode || !itemCode.trim()) throw new HttpError(400, "itemCode is required");
  if (!/^\d{5}$/.test(itemCode)) throw new HttpError(400, "Item code must be exactly 5 digits");
  if (!name || !name.trim()) throw new HttpError(400, "name is required");
  if (!vendor) throw new HttpError(400, "vendor is required");
  if (!CATEGORY_ENUM.includes(category)) throw new HttpError(400, `category must be one of: ${CATEGORY_ENUM.join(", ")}`);

  const cp = Number(costPrice);
  const rp = Number(retailPrice);
  const wp = Number(wholesalePrice);

  if ([cp, rp, wp].some(n => Number.isNaN(n) || n < 0)) {
    throw new HttpError(400, "cost/retail/wholesale must be non-negative numbers");
  }

  let imageUrl = "";
  if (file) {
    try {
      const { publicUrl } = await uploadBufferToSupabase({
        bucket: BUCKET,
        folder: "items",
        filename: file.originalname,
        buffer: file.buffer,
        contentType: file.mimetype,
      });
      imageUrl = publicUrl;
    } catch {
      throw new HttpError(500, "Image upload failed");
    }
  }

  const item = await InventoryItem.create({
    itemCode: itemCode.trim(),
    name: name.trim(),
    category,
    costPrice: cp,
    retailPrice: rp,
    wholesalePrice: wp,
    stockQty: 0,
    movingAvgCost: cp || 0,
    imageUrl,
    description: description ? String(description).trim() : "",
    vendor,
  });

  return item;
};

// GET ITEMS WITH PAGINATION
export const getItemsService = async (page = 1, limit = 10) => {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Number(limit) || 10, 100);
  const skip = (page - 1) * limit;

  const totalItems = await InventoryItem.countDocuments();
  const items = await InventoryItem.find()
    .populate("vendor", "name email phone")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      limit,
    },
    data: items,
  };
};

// GET SINGLE ITEM BY ID
export const getItemByIdService = async (id) => {
  const item = await InventoryItem.findById(id).populate("vendor", "name email phone");
  if (!item) throw new HttpError(404, "Item not found");
  return item;
};

// UPDATE ITEM
export const updateItemService = async (id, body, file) => {
  const update = {};

  if (body.stockQty !== undefined) throw new HttpError(400, "stockQty cannot be updated manually");
  if (body.movingAvgCost !== undefined) throw new HttpError(400, "movingAvgCost cannot be updated manually");

  if (body.name !== undefined) {
    const v = String(body.name).trim();
    if (!v) throw new HttpError(400, "name cannot be empty");
    update.name = v;
  }

  if (body.category !== undefined) {
    if (!CATEGORY_ENUM.includes(body.category)) throw new HttpError(400, `category must be one of: ${CATEGORY_ENUM.join(", ")}`);
    update.category = body.category;
  }

  if (body.costPrice !== undefined) {
    const v = Number(body.costPrice);
    if (Number.isNaN(v) || v < 0) throw new HttpError(400, "costPrice must be a non-negative number");
    update.costPrice = v;
  }

  if (body.retailPrice !== undefined) {
    const v = Number(body.retailPrice);
    if (Number.isNaN(v) || v < 0) throw new HttpError(400, "retailPrice must be a non-negative number");
    update.retailPrice = v;
  }

  if (body.wholesalePrice !== undefined) {
    const v = Number(body.wholesalePrice);
    if (Number.isNaN(v) || v < 0) throw new HttpError(400, "wholesalePrice must be a non-negative number");
    update.wholesalePrice = v;
  }

  if (body.description !== undefined) update.description = String(body.description).trim();
  if (body.vendor !== undefined) update.vendor = body.vendor;

  if (file) {
    try {
      const { publicUrl } = await uploadBufferToSupabase({
        bucket: BUCKET,
        folder: "items",
        filename: file.originalname,
        buffer: file.buffer,
        contentType: file.mimetype,
      });
      update.imageUrl = publicUrl;
    } catch {
      throw new HttpError(500, "Image upload failed");
    }
  }

  try {
    const updated = await InventoryItem.findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .populate("vendor", "name email phone");
    if (!updated) throw new HttpError(404, "Item not found");
    return updated;
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.itemCode) throw new HttpError(409, "Item code already exists");
    throw err;
  }
};

// DELETE ITEM
export const deleteItemService = async (id) => {
  const deleted = await InventoryItem.findByIdAndDelete(id);
  if (!deleted) throw new HttpError(404, "Item not found");
  return deleted;
};

// CHECK DUPLICATE ITEM CODE
export const checkItemCodeService = async (code) => {
  if (!code || !code.trim()) throw new HttpError(400, "itemCode required");
  const exists = await InventoryItem.exists({ itemCode: code.trim() });
  return !!exists;
};

// GET ITEM BY CODE
export const getItemByCodeService = async (code) => {
  if (!/^\d{5}$/.test(code)) throw new HttpError(400, "Invalid item code");
  const item = await InventoryItem.findOne({ itemCode: code.trim() }).select("itemCode name costPrice");
  if (!item) throw new HttpError(404, "Item not found");
  return item;
};