// src/redux/thunks/vendorThunks/VendorThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
// import * as vendorApi from "../../../services/vendorApi/vendorApi";
import * as vendorApi from "../../../services/vendorApi/vendorApi";

// -------------------- CREATE VENDOR --------------------
export const createVendor = createAsyncThunk(
  "vendor/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await vendorApi.createVendorApi(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to create vendor");
    }
  }
);

// -------------------- GET ALL VENDORS --------------------
export const fetchVendors = createAsyncThunk(
  "vendor/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await vendorApi.getVendorsApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch vendors");
    }
  }
);

// -------------------- GET SINGLE VENDOR --------------------
export const fetchVendorById = createAsyncThunk(
  "vendor/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await vendorApi.getVendorByIdApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch vendor");
    }
  }
);

// -------------------- UPDATE VENDOR --------------------
export const updateVendor = createAsyncThunk(
  "vendor/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await vendorApi.updateVendorApi(id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to update vendor");
    }
  }
);

// -------------------- DEACTIVATE VENDOR --------------------
export const deactivateVendor = createAsyncThunk(
  "vendor/deactivate",
  async (id, { rejectWithValue }) => {
    try {
      const res = await vendorApi.deactivateVendorApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to deactivate vendor");
    }
  }
);
