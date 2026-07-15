


// after profit cogs implement:
// models/sale.model.js
import mongoose from "mongoose";
import Counter from "./counter.model.js";
const { Schema, model } = mongoose;

// ===== Sale Item Schema =====
const SaleItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: "InventoryItem", required: true },
  itemCode: { type: String, required: true, trim: true },
  itemName: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },         // selling price (unit)
  qty: { type: Number, required: true, min: 1 },
  lineTotal: { type: Number, required: true, min: 0 },     // qty * price

  // ✅ NEW FIELDS (COGS)
  unitCostAtSale: { type: Number, default: 0, min: 0 },    // stamped from inventory.movingAvgCost at sale time
  lineCOGS: { type: Number, default: 0, min: 0 },          // qty * unitCostAtSale
});

// ===== Sale Schema =====
const SaleSchema = new Schema(
  {
    invoiceNo: Number, // auto-incremented
    customer: {
      name: { type: String, required: true, trim: true },
      phone: {
        type: String,
        trim: true,
        required: true,
        match: [/^(\+92|0)?3\d{9}$/, "Invalid phone number"],
      },
      email: { type: String, trim: true, lowercase: true, required: true },
    },
    items: [SaleItemSchema],
    emailSent: { type: Boolean, default: false },
    subTotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },

    // ✅ NEW FIELD (COGS total on sale)
    cogsTotal: { type: Number, default: 0, min: 0 },

    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    saleDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ===== Auto-increment invoiceNo before save =====
SaleSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "saleInvoice" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.invoiceNo = counter.seq;
  }
});

SaleSchema.index({ createdAt: 1 });

const Sale = model("Sale", SaleSchema);
export default Sale;