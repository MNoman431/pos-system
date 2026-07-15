import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSale, getSales, getSaleById } from "../../../services/salesApi/salesApi";

export const createSaleThunk = createAsyncThunk(
  "sales/create",
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await createSale(saleData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchSalesThunk = createAsyncThunk(
  "sales/fetchAll",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await getSales(page, limit);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchSaleByIdThunk = createAsyncThunk(
  "sales/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getSaleById(id);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);