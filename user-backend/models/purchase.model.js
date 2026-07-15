
import mongoose from "mongoose";

import Counter from "./counter.model.js";
const { Schema, model } = mongoose;


const PurchaseItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: "InventoryItem", required: true },
  itemCode: { type: String, required: true, trim: true },
  itemName: { type: String, required: true, trim: true },
  costPrice: { type: Number, required: true, min: 0 },
  qty: { type: Number, required: true, min: 1 },
  lineTotal: { type: Number, required: true, min: 0 },
});

const PurchaseSchema = new Schema(
  {
    invoiceNo: Number, // auto-increment field
    vendor: {
      _id: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
    },
    purchaseDate: { type: Date, default: Date.now },
    // flag that the email/PDF has been delivered to the vendor
    emailSent: { type: Boolean, default: false },
    subTotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [PurchaseItemSchema],
  },
  { timestamps: true }
);


PurchaseSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "purchaseInvoice" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.invoiceNo = counter.seq;
  }
});

export default model("Purchase", PurchaseSchema);