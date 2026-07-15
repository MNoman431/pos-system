import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      match: [/^(\+92|0)?3\d{9}$/, "Invalid phone number"],
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    contactPerson: {
      type: String,
      trim: true,
      required:true
    },
    address: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

vendorSchema.set("toJSON", { virtuals: true, versionKey: false });

const Vendor = mongoose.model("Vendor", vendorSchema);
export default Vendor;
