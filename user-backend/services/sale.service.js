import Sale from "../models/sale.model.js";
import InventoryItem from "../models/inventory.model.js";
import { HttpError } from "../utils/httpError.js";
import { saleTrigger } from "../utils/triggers.js";

export const createSaleService = async (user, customer, items, discountType = "fixed", discountValue = 0) => {
  if (!customer || !customer.name) throw new HttpError(400, "Customer name is required");
  if (!Array.isArray(items) || items.length === 0) throw new HttpError(400, "At least one sale item is required");

  let subTotal = 0;
  let cogsTotal = 0;

  const processedItems = await Promise.all(
    items.map(async (item) => {
      const dbItem = await InventoryItem.findById(item.itemId);
      if (!dbItem) throw new HttpError(404, `Item ${item.itemId} not found`);

      const qty = Number(item.qty || 0);
      if (qty <= 0) throw new HttpError(400, "Invalid sale qty");
      if (dbItem.stockQty < qty) throw new HttpError(400, `${dbItem.name} stock is not enough`);

      const unitPrice = Number(dbItem.retailPrice || 0);
      const lineTotal = unitPrice * qty;
      subTotal += lineTotal;

      const unitCostAtSale = Number(dbItem.movingAvgCost ?? dbItem.costPrice ?? 0);
      const lineCOGS = unitCostAtSale * qty;
      cogsTotal += lineCOGS;

      dbItem.stockQty -= qty;
      await dbItem.save();

      return {
        itemId: dbItem._id,
        itemCode: dbItem.itemCode,
        itemName: dbItem.name,
        price: unitPrice,
        qty,
        lineTotal,
        unitCostAtSale,
        lineCOGS,
      };
    })
  );

  const discountAmount =
    discountType === "percent" ? (subTotal * Number(discountValue || 0)) / 100 : Number(discountValue || 0);

  const grandTotal = Math.max(0, subTotal - discountAmount);

  const sale = await Sale.create({
    customer,
    items: processedItems,
    subTotal,
    discount: discountAmount,
    discountType,
    grandTotal,
    cogsTotal,
    createdBy: user._id,
  });

  saleTrigger(sale);
  return sale;
};

export const getSalesService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const total = await Sale.countDocuments();

  const sales = await Sale.find()
    .populate("createdBy", "firstName lastName email")
    .populate("items.itemId", "itemCode name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return { data:sales, meta: { total, page, totalPages: Math.ceil(total / limit), limit } };
};

export const getSaleByIdService = async (id) => {
  const sale = await Sale.findById(id)
    .populate("createdBy", "firstName lastName email")
    .populate("items.itemId", "itemCode name");

  if (!sale) throw new HttpError(404, "Sale not found");
  return sale;
};