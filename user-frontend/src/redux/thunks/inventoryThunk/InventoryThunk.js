// src/redux/thunks/inventoryThunk/InventoryThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as inventoryApi from "../../../services/inventoryApi/inventoryApi";

// -------------------- CREATE ITEM --------------------
export const addItem = createAsyncThunk(
  "inventory/addItem",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await inventoryApi.createItemApi(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to add item");
    }
  }
);

// -------------------- GET ALL ITEMS --------------------
export const fetchItems = createAsyncThunk(
  "inventory/fetchItems",
  async (_, { rejectWithValue }) => {
    try {
      const res = await inventoryApi.getItemsApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch items");
    }
  }
);

// -------------------- GET ITEM BY ID --------------------
export const fetchItemById = createAsyncThunk(
  "inventory/fetchItemById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await inventoryApi.getItemByIdApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch item");
    }
  }
);

// -------------------- GET ITEM BY CODE --------------------
export const fetchItemByCode = createAsyncThunk(
  "inventory/fetchItemByCode",
  async (code, { rejectWithValue }) => {
    try {
      const res = await inventoryApi.getItemByCodeApi(code);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to fetch item by code");
    }
  }
);

// -------------------- CHECK ITEM CODE --------------------
export const checkItemCode = createAsyncThunk(
  "inventory/checkItemCode",
  async (code, { rejectWithValue }) => {
    try {
      const res = await inventoryApi.checkItemCodeApi(code);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to check item code");
    }
  }
);

// -------------------- UPDATE ITEM --------------------
export const updateItem = createAsyncThunk(
  "inventory/updateItem",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await inventoryApi.updateItemApi(id, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to update item");
    }
  }
);

// -------------------- DELETE ITEM --------------------
export const deleteItem = createAsyncThunk(
  "inventory/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      const res = await inventoryApi.deleteItemApi(id);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to delete item");
    }
  }
);