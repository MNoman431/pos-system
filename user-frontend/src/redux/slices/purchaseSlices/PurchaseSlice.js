// user-frontend/src/redux/slices/purchaseSlices/PurchaseSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createPurchaseInvoice,
  fetchPurchases,
  fetchPurchaseById,
} from "../../thunks/purchaseThunks/PurchaseThunk";

const initialState = {
  purchases: [],              // all purchase invoices
  currentPurchase: null,      // single invoice view/edit
  loading: false,
  error: null,
  meta: {                     // pagination info
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    resetCurrentPurchase: (state) => {
      state.currentPurchase = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // create purchase invoice
    builder
      .addCase(createPurchaseInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchaseInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases.unshift(action.payload); // add new invoice at top
      })
      .addCase(createPurchaseInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetch all purchases (paginated)
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.purchases = action.payload.data || [];
        state.meta = action.payload.meta || initialState.meta;
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetch single purchase by ID
    builder
      .addCase(fetchPurchaseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPurchase = action.payload;
      })
      .addCase(fetchPurchaseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCurrentPurchase } = purchaseSlice.actions;
export default purchaseSlice.reducer;
