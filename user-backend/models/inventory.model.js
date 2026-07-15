// import mongoose from "mongoose";
// export const CATEGORY_ENUM = [
//   "Food",
//   "Beverage",
//   "Grocery",
//   "Electronics",
//   "Clothing",
//   "Bakery",
//   "Cosmetics",
//   "Car Accessories",
//   "Other",
// ];
// const InventoryItemSchema = new mongoose.Schema(
//   {
//    itemCode: {
//   type: String,
//   required: true,
//   unique: true,
//   trim: true,
//   match: [/^\d{5}$/, "Item code must be exactly 5 digits (numbers only)"],
// }
// ,
//     name: { type: String, required: true, trim: true },
//     category: { type: String, required: true, enum: CATEGORY_ENUM, trim: true },
//     costPrice: { type: Number, required: true, min: 0 },
//     retailPrice: { type: Number, required: true, min: 0 },
//     wholesalePrice: { type: Number, required: true, min: 0 },
//     stockQty: { type: Number, required: true, min: 0, default: 0 },

//     imageUrl: { type: String, required: true, trim: true },
//     description: { type: String, default: "", trim: true },

//     vendor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Vendor",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );
// // InventoryItemSchema.index({ itemCode: 1 }, { unique: true });
// InventoryItemSchema.set("toJSON", { virtuals: true, versionKey: false });
// const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema);
// export default InventoryItem;



// after profit cogs implement:
// models/inventory.model.js
import mongoose from "mongoose";
export const CATEGORY_ENUM = [
  "Food",
  "Beverage",
  "Grocery",
  "Electronics",
  "Clothing",
  "Bakery",
  "Cosmetics",
  "Car Accessories",
  "Other",
];

const InventoryItemSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{5}$/, "Item code must be exactly 5 digits (numbers only)"],
    },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORY_ENUM, trim: true },

    // ⚠️ costPrice tumhare current master price ka field hai (fine).
    // ✅ NEW: movingAvgCost - yahi actual inventory valuation use hoga COGS ke liye.
    movingAvgCost: { type: Number, default: 0, min: 0 }, // ✅ ADD THIS

    costPrice: { type: Number, required: true, min: 0 },
    retailPrice: { type: Number, required: true, min: 0 },
    wholesalePrice: { type: Number, required: true, min: 0 },
    stockQty: { type: Number, required: true, min: 0, default: 0 },

    imageUrl: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
  },
  { timestamps: true }
);

InventoryItemSchema.index({ createdAt: 1 });
InventoryItemSchema.set("toJSON", { virtuals: true, versionKey: false });

const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema);
export default InventoryItem;