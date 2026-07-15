import Vendor from "../models/vendor.model.js";
import { HttpError } from "../utils/httpError.js";
import { validateVendor } from "../utils/validators.js";

export const createVendorService = async (userId, data) => {
  validateVendor(data);

  const { name, phone, email, address, contactPerson } = data;

  const vendor = await Vendor.create({
    name: name.trim(),
    phone,
    email,
    contactPerson: contactPerson.trim(),
    address,
    createdBy: userId,
  });

  return vendor;
};

export const getAllVendorsService = async () => {
  return Vendor.find({ status: "active" })
    .sort({ createdAt: -1 })
    .populate("createdBy", "firstName lastName email");
};

export const getVendorByIdService = async (id) => {
  const vendor = await Vendor.findById(id).populate(
    "createdBy",
    "firstName lastName email"
  );
  if (!vendor) throw new HttpError(404, "Vendor not found");
  return vendor;
};

export const updateVendorService = async (id, data) => {
  if (data.name !== undefined && !data.name.trim()) {
    throw new HttpError(400, "Vendor name cannot be empty");
  }

  const vendor = await Vendor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!vendor) throw new HttpError(404, "Vendor not found");
  return vendor;
};

export const deactivateVendorService = async (id) => {
  const vendor = await Vendor.findByIdAndUpdate(
    id,
    { status: "inactive" },
    { new: true }
  );

  if (!vendor) throw new HttpError(404, "Vendor not found");
  return vendor;
};