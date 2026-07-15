// src/redux/thunks/purchaseThunks/PurchaseThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as purchaseApi from "../../../services/purchaseApi/purchaseApi";

// -------------------- CREATE PURCHASE --------------------
export const createPurchaseInvoice = createAsyncThunk(
  "purchase/create",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await purchaseApi.createPurchaseApi(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to create purchase");
    }
  }
);

// -------------------- GET ALL PURCHASES --------------------
export const fetchPurchases = createAsyncThunk(
  "purchase/fetchAll",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const res = await purchaseApi.getPurchasesApi(page, limit);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch purchases");
    }
  }
);

// -------------------- GET SINGLE PURCHASE --------------------
export const fetchPurchaseById = createAsyncThunk(
  "purchase/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await purchaseApi.getPurchaseByIdApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch purchase");
    }
  }
);
