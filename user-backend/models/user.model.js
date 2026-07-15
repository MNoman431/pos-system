
// after eid role base system
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    profileImage: {
      type: String,
      default: "https://example.com/default-avatar.png",
    },

    // ✅ OLD FIELD REMOVE KARO
    // roleDocument: { type: String, enum: ["user", "master"], default: "user" },

    // ✅ NEW RBAC FIELD — DYNAMIC ROLE ID
   roleId: {
  type: mongoose.Schema.Types.Mixed,
  ref: "Role",
  default: null,
},

    // ✅ NEW RBAC FIELD — USER STATUS
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },

    resetOTP: { type: String },
    resetOTPExpires: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = mongoose.model("User", userSchema);
export default User;
