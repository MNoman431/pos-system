// src/slice/inventorySlice/InventorySlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  addItem,
  checkItemCode,
  deleteItem,
  fetchItemById,
  fetchItems,
  fetchItemByCode,
  updateItem,
} from "../../thunks/inventoryThunk/InventoryThunk";

const initialState = {
  items: [],
  meta: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  },

  currentItem: null,
  loadingList: false,
  loadingItem: false,
  submitting: false,
  deleting: false,

  errorList: null,
  errorItem: null,
  errorSubmit: null,
  errorDelete: null,

  dupCheck: { itemCode: "", exists: false, checking: false, error: null },
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    clearCurrentItem(state) {
      state.currentItem = null;
      state.errorItem = null;
    },
    resetDupCheck(state) {
      state.dupCheck = {
        itemCode: "",
        exists: false,
        checking: false,
        error: null,
      };
    },
    clearSubmitError(state) {
      state.errorSubmit = null;
    },
  },
  extraReducers: (builder) => {
    // ================= LIST =================
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loadingList = true;
        state.errorList = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loadingList = false;
        state.items = action.payload?.data || [];
        state.meta = action.payload?.meta || state.meta;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loadingList = false;
        state.errorList = action.payload || "Failed to fetch items";
      });

    // ================= GET ONE =================
    builder
      .addCase(fetchItemById.pending, (state) => {
        state.loadingItem = true;
        state.errorItem = null;
        state.currentItem = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loadingItem = false;
        // ✅ FIX: extract actual item
        state.currentItem = action.payload?.data || null;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.loadingItem = false;
        state.errorItem = action.payload || "Failed to fetch item";
      });

    // ================= GET BY CODE =================
    builder
      .addCase(fetchItemByCode.pending, (state) => {
        state.loadingItem = true;
        state.errorItem = null;
      })
      .addCase(fetchItemByCode.fulfilled, (state, action) => {
        state.loadingItem = false;
        // ✅ FIX: extract actual item
        state.currentItem = action.payload?.data || null;
      })
      .addCase(fetchItemByCode.rejected, (state, action) => {
        state.loadingItem = false;
        state.errorItem = action.payload || "Failed to fetch item by code";
      });

    // ================= DUP CODE CHECK =================
    builder
      .addCase(checkItemCode.pending, (state) => {
        state.dupCheck.checking = true;
        state.dupCheck.error = null;
      })
      .addCase(checkItemCode.fulfilled, (state, action) => {
        state.dupCheck.checking = false;
        state.dupCheck.itemCode = action.payload.itemCode;
        state.dupCheck.exists = action.payload.exists;
      })
      .addCase(checkItemCode.rejected, (state, action) => {
        state.dupCheck.checking = false;
        state.dupCheck.error = action.payload || "Failed to check code";
      });

    // ================= ADD =================
    builder
      .addCase(addItem.pending, (state) => {
        state.submitting = true;
        state.errorSubmit = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.submitting = false;
        const created = action.payload?.data || action.payload;
        if (created) state.items.unshift(created);
      })
      .addCase(addItem.rejected, (state, action) => {
        state.submitting = false;
        state.errorSubmit = action.payload || "Failed to add item";
      });

    // ================= UPDATE =================
    builder
      .addCase(updateItem.pending, (state) => {
        state.submitting = true;
        state.errorSubmit = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.submitting = false;
        const updated = action.payload?.data || action.payload;
        if (updated?._id) {
          const idx = state.items.findIndex((x) => x._id === updated._id);
          if (idx > -1) state.items[idx] = updated;
          if (state.currentItem?._id === updated._id)
            state.currentItem = updated;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.submitting = false;
        state.errorSubmit = action.payload || "Failed to update item";
      });

    // ================= DELETE =================
    builder
      .addCase(deleteItem.pending, (state) => {
        state.deleting = true;
        state.errorDelete = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.deleting = false;
        const id = action.payload?.id;
        if (id) {
          state.items = state.items.filter((x) => x._id !== id);
          if (state.currentItem?._id === id) state.currentItem = null;
        }
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.deleting = false;
        state.errorDelete = action.payload || "Failed to delete item";
      });
  },
});

export const { clearCurrentItem, resetDupCheck, clearSubmitError } =
  inventorySlice.actions;

export default inventorySlice.reducer;

/** Selectors */
export const selectInventory = (s) => s.inventory;
export const selectItems = (s) => s.inventory.items;
export const selectCurrentItem = (s) => s.inventory.currentItem;
export const selectListLoading = (s) => s.inventory.loadingList;
export const selectItemLoading = (s) => s.inventory.loadingItem;
export const selectSubmitting = (s) => s.inventory.submitting;
export const selectDeleting = (s) => s.inventory.deleting;
export const selectDupCheck = (s) => s.inventory.dupCheck;