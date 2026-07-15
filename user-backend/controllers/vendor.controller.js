// import Vendor from "../models/vendor.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { HttpError } from "../utils/httpError.js";
// import { validateVendor } from "../utils/validators.js";
// /* ================= CREATE VENDOR ================= */
// export const createVendor = asyncHandler(async (req, res) => {
//   try {
//     validateVendor(req.body);
//   } catch (err) {
//     throw new HttpError(400, err.message);
//   }

//   const { name, phone, email, address,contactPerson } = req.body;

//   const vendor = await Vendor.create({
//     name: name.trim(),
//     phone,
//     email,
//      contactPerson: contactPerson.trim(),
//     address,
//     createdBy: req.user.id,
//   });

//   res.status(201).json({
//     success: true,
//     message: "Vendor created successfully",
//     data: vendor,
//   });
// });

// /* ================= GET ALL VENDORS ================= */
// export const getVendors = asyncHandler(async (req, res) => {
//   const vendors = await Vendor.find({ status: "active" })
//     .sort({ createdAt: -1 })
//     .populate("createdBy", "firstName lastName email");

//   res.status(200).json(vendors);
// });

// /* ================= GET SINGLE VENDOR ================= */
// export const getVendorById = asyncHandler(async (req, res) => {
//   const vendor = await Vendor.findById(req.params.id)
//     .populate("createdBy", "firstName lastName email");

//   if (!vendor) {
//     throw new HttpError(404, "Vendor not found");
//   }

//   res.status(200).json(vendor);
// });

// /* ================= UPDATE VENDOR ================= */
// export const updateVendor = asyncHandler(async (req, res) => {
//   if (req.body.name !== undefined && !req.body.name.trim()) {
//     throw new HttpError(400, "Vendor name cannot be empty");
//   }

//   const vendor = await Vendor.findByIdAndUpdate(
//     req.params.id,
//     req.body,
//     { new: true, runValidators: true }
//   );

//   if (!vendor) {
//     throw new HttpError(404, "Vendor not found");
//   }

//   res.status(200).json(vendor);
// });

// /* ================= SOFT DELETE ================= */
// export const deactivateVendor = asyncHandler(async (req, res) => {
//   const vendor = await Vendor.findByIdAndUpdate(
//     req.params.id,
//     { status: "inactive" },
//     { new: true }
//   );

//   if (!vendor) {
//     throw new HttpError(404, "Vendor not found");
//   }

//   res.status(200).json({
//     message: "Vendor deactivated successfully",
//     vendor,
//   });
// });












import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createVendorService,
  getAllVendorsService,
  getVendorByIdService,
  updateVendorService,
  deactivateVendorService,
} from "../services/vendor.service.js";

/* ================= CREATE VENDOR ================= */
export const createVendor = asyncHandler(async (req, res) => {
  const vendor = await createVendorService(req.user.id, req.body);
  res.status(201).json({
    success: true,
    message: "Vendor created successfully",
    data: vendor,
  });
});

/* ================= GET ALL VENDORS ================= */
export const getVendors = asyncHandler(async (req, res) => {
  const vendors = await getAllVendorsService();
  res.status(200).json(vendors);
});

/* ================= GET SINGLE VENDOR ================= */
export const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await getVendorByIdService(req.params.id);
  res.status(200).json(vendor);
});

/* ================= UPDATE VENDOR ================= */
export const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await updateVendorService(req.params.id, req.body);
  res.status(200).json(vendor);
});

/* ================= SOFT DELETE ================= */
export const deactivateVendor = asyncHandler(async (req, res) => {
  const vendor = await deactivateVendorService(req.params.id);
  res.status(200).json({
    message: "Vendor deactivated successfully",
    vendor,
  });
});