import { createSlice } from "@reduxjs/toolkit";
import {
  createVendor,
  fetchVendors,
  fetchVendorById,
  updateVendor,
  deactivateVendor,
} from "../../thunks/vendorThunks/VendorThunk";

const vendorSlice = createSlice({
  name: "vendor",

  initialState: {
    vendors: [],
    currentVendor: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearCurrentVendor: (state) => {
      state.currentVendor = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== CREATE ===== */
      .addCase(createVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors.unshift(action.payload);
      })
      .addCase(createVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== FETCH ALL ===== */
      .addCase(fetchVendors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false;
        state.vendors = action.payload;
      })
      .addCase(fetchVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== FETCH ONE ===== */
      .addCase(fetchVendorById.fulfilled, (state, action) => {
        state.currentVendor = action.payload;
      })

      /* ===== UPDATE ===== */
      .addCase(updateVendor.fulfilled, (state, action) => {
        state.vendors = state.vendors.map((v) =>
          v._id === action.payload._id ? action.payload : v
        );
        state.currentVendor = action.payload;
      })

      /* ===== DEACTIVATE ===== */
      .addCase(deactivateVendor.fulfilled, (state, action) => {
        state.vendors = state.vendors.filter(
          (v) => v._id !== action.payload.vendor._id
        );
      });
  },
});

export const { clearCurrentVendor } = vendorSlice.actions;
export default vendorSlice.reducer;
