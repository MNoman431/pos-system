import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    roleName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    
description: {
      type: String,
      default: ""
    },


    //  Yeh object me sare page permissions honge
    // Example: { AddInventory: true, EditInventory: false }
    roleMap: {
      type: Object,
      required: true,
      default: {},
    },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
export default Role;