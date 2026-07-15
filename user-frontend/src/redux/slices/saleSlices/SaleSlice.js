import { createSlice } from "@reduxjs/toolkit";
import { createSaleThunk, fetchSalesThunk, fetchSaleByIdThunk } from "../../thunks/salesThunk/SaleThunk";

const initialState = {
  sales: [],
  singleSale: null,
  loading: false,
  error: null,
  meta: {},
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearSingleSale: (state) => { state.singleSale = null; },
  },
  extraReducers: (builder) => {
    builder
      // Create Sale
      .addCase(createSaleThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createSaleThunk.fulfilled, (state, action) => { state.loading = false; state.sales.unshift(action.payload); })
      .addCase(createSaleThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload.message; })

      // Fetch all sales
      .addCase(fetchSalesThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSalesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchSalesThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload.message; })

      // Fetch single sale
      .addCase(fetchSaleByIdThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSaleByIdThunk.fulfilled, (state, action) => { state.loading = false; state.singleSale = action.payload; })
      .addCase(fetchSaleByIdThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload.message; });
  },
});

export const { clearSingleSale } = salesSlice.actions;
export default salesSlice.reducer;