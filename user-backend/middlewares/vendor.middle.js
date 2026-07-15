import Vendor from "../models/vendor.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const attachVendor = asyncHandler(async (req, res, next) => {
  const vendorId = req.body.vendor || req.query.vendor || req.params.vendorId;
  if (!vendorId) return next(); 
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) throw new HttpError(404, "Vendor not found");

  req.vendor = {
    _id: vendor._id,
    name: vendor.name,
    email: vendor.email,
    phone: vendor.phone,
  };

  next();
});