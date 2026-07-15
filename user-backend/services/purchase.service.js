import Purchase from "../models/purchase.model.js";
import InventoryItem from "../models/inventory.model.js";
import { HttpError } from "../utils/httpError.js";
import { purchaseTrigger } from "../utils/triggers.js";
import { validatePurchase } from "../utils/validators.js";

export const createPurchaseService = async (user, vendorDoc, items, discountValue = 0) => {
  // 1) validate payload
  try {
    validatePurchase({ vendor: vendorDoc, items, discountValue });
  } catch (err) {
    throw new HttpError(400, err.message);
  }

  let subTotal = 0;

  // 2) process items
  const processedItems = await Promise.all(
    items.map(async (item) => {
      const dbItem = await InventoryItem.findOne({ itemCode: item.itemCode });
      if (!dbItem) throw new HttpError(404, `Item ${item.itemCode} not found`);

      const qty = Number(item.qty || 0);
      if (qty <= 0) throw new HttpError(400, "Invalid purchase qty");

      const unitCost = Number(dbItem.costPrice || 0);
      const lineTotal = unitCost * qty;
      subTotal += lineTotal;

      // Weighted Average Cost update
      const oldQty = Number(dbItem.stockQty || 0);
      const oldAvg = Number(dbItem.movingAvgCost || 0);
      const totalOld = oldQty * oldAvg;
      const totalNew = qty * unitCost;
      const combinedQty = oldQty + qty;
      const newAvg = combinedQty > 0 ? (totalOld + totalNew) / combinedQty : 0;

      dbItem.stockQty = combinedQty;
      dbItem.movingAvgCost = newAvg;
      await dbItem.save();

      return {
        itemId: dbItem._id,
        itemCode: dbItem.itemCode,
        itemName: dbItem.name,
        costPrice: unitCost,
        qty,
        lineTotal,
      };
    })
  );

  // 3) discount & grandTotal
  const discountAmount = Number(discountValue) || 0;
  const grandTotal = Math.max(0, subTotal - discountAmount);

  // 4) create purchase
  const purchase = await Purchase.create({
    vendor: { _id: vendorDoc._id, name: vendorDoc.name, email: vendorDoc.email },
    subTotal,
    discount: discountAmount,
    grandTotal,
    createdBy: user._id,
    items: processedItems,
  });

  purchaseTrigger(purchase);
  return purchase;
};

export const getPurchasesService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await Purchase.countDocuments();
  const purchases = await Purchase.find()
    .populate("createdBy", "firstName lastName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
   data: purchases,
    meta: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const getPurchaseByIdService = async (id) => {
  const purchase = await Purchase.findById(id)
    .populate("createdBy", "firstName lastName email")
    .populate("items.itemId", "itemCode name");

  if (!purchase) throw new HttpError(404, "Purchase not found");
  return purchase;
};