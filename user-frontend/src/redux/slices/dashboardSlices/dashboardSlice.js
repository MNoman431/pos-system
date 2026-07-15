
// dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchDashboardSummary, fetchFilteredSummary, fetchLowStockItems, 
  fetchMonthlyAnalytics, fetchReorderAlerts // NEW
} from "../../thunks/dashboardThunks/dashboardThunk";

const initialState = {
  summary: { sales: 0, purchases: 0, cogs: 0, cost: 0, profit: 0, grossProfit: null, netCashImpact: 0 },
  lowStock: [],
  reorderAlerts: [],
  monthlyAnalytics: { labels: [], sales: [], purchases: [], loading: false, error: null },
  monthlySales: [],
  monthlyPurchases: [],
  filter: "monthly",
  loadingSummary: false,
  loadingLowStock: false,
  loadingReorder: false,
  filteredSummary: { loading: false, error: null, data: null, filter: "monthly", lastFetchedAt: null },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = String(action.payload || "monthly").toLowerCase();
    },
  },
  extraReducers: (builder) => {
    builder
      // ========== DASHBOARD REDUCERS ==========
      .addCase(fetchDashboardSummary.pending, (state) => { state.loadingSummary = true; })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        const d = action.payload?.data || {};
        state.summary = {
          sales: d.sales ?? 0,
          purchases: d.purchases ?? 0,
          cogs: d.cogs ?? 0,
          cost: d.cost ?? d.purchases ?? 0,
          profit: typeof d.profit === "number" ? d.profit : (d.sales ?? 0) - (d.cost ?? d.purchases ?? 0),
          netCashImpact: typeof d.netCashImpact === "number" ? d.netCashImpact : (d.sales ?? 0) - (d.purchases ?? 0),
          grossProfit: typeof d.grossProfit === "number" || d.grossProfit === null ? d.grossProfit : null,
        };
      })
      .addCase(fetchDashboardSummary.rejected, (state) => { state.loadingSummary = false; })

      .addCase(fetchLowStockItems.pending, (state) => { state.loadingLowStock = true; })
      .addCase(fetchLowStockItems.fulfilled, (state, action) => { state.loadingLowStock = false; state.lowStock = action.payload?.items || []; })
      .addCase(fetchLowStockItems.rejected, (state) => { state.loadingLowStock = false; })

      .addCase(fetchReorderAlerts.pending, (state) => { state.loadingReorder = true; })
      .addCase(fetchReorderAlerts.fulfilled, (state, action) => { state.loadingReorder = false; state.reorderAlerts = action.payload?.items || []; })
      .addCase(fetchReorderAlerts.rejected, (state) => { state.loadingReorder = false; })

      .addCase(fetchMonthlyAnalytics.pending, (state) => { state.monthlyAnalytics.loading = true; state.monthlyAnalytics.error = null; })
      .addCase(fetchMonthlyAnalytics.fulfilled, (state, action) => {
        state.monthlyAnalytics.loading = false;
        const labels = action.payload?.labels || [];
        const sales = action.payload?.sales || [];
        const purchases = action.payload?.purchases || [];
        state.monthlyAnalytics.labels = labels;
        state.monthlyAnalytics.sales = sales;
        state.monthlyAnalytics.purchases = purchases;
        state.monthlySales = sales;
        state.monthlyPurchases = purchases;
      })
      .addCase(fetchMonthlyAnalytics.rejected, (state, action) => {
        state.monthlyAnalytics.loading = false;
        state.monthlyAnalytics.error = action.error?.message || "Failed to load analytics";
        state.monthlyAnalytics.labels = [];
        state.monthlyAnalytics.sales = [];
        state.monthlyAnalytics.purchases = [];
        state.monthlySales = [];
        state.monthlyPurchases = [];
      })

      .addCase(fetchFilteredSummary.pending, (state, action) => {
        state.filteredSummary.loading = true;
        state.filteredSummary.error = null;
        state.filteredSummary.filter = String(action.meta.arg || state.filter || "monthly").toLowerCase();
      })
      .addCase(fetchFilteredSummary.fulfilled, (state, action) => {
        state.filteredSummary.loading = false;
        const payload = action.payload || null;
        const fallbackNetCash = payload && typeof payload.sales === "number" && typeof payload.purchases === "number"
          ? payload.sales - payload.purchases : 0;
        state.filteredSummary.data = {
          sales: payload?.sales ?? 0,
          purchases: payload?.purchases ?? 0,
          cogs: payload?.cogs ?? 0,
          cost: payload?.cost ?? payload?.purchases ?? 0,
          profit: typeof payload?.profit === "number" ? payload.profit : (payload?.sales ?? 0) - (payload?.purchases ?? 0),
          netCashImpact: typeof payload?.netCashImpact === "number" ? payload.netCashImpact : fallbackNetCash,
          grossProfit: typeof payload?.grossProfit === "number" || payload?.grossProfit === null ? payload?.grossProfit : null,
        };
        state.filteredSummary.lastFetchedAt = Date.now();
      })
      .addCase(fetchFilteredSummary.rejected, (state, action) => {
        state.filteredSummary.loading = false;
        state.filteredSummary.error = action.payload || action.error?.message || "Failed to load summary";
      })



  //     // ========== ROLES REDUCERS ==========
  //     .addCase(fetchRoles.pending, (state) => { state.rolesLoading = true; state.rolesError = null; })
  //     .addCase(fetchRoles.fulfilled, (state, action) => { state.rolesLoading = false; state.roles = action.payload; })
  //     .addCase(fetchRoles.rejected, (state, action) => { state.rolesLoading = false; state.rolesError = action.payload; })

  //     .addCase(assignRole.pending, (state) => { state.assignRoleLoading = true; state.assignRoleError = null; })
  //     .addCase(assignRole.fulfilled, (state) => { state.assignRoleLoading = false; })
  //     .addCase(assignRole.rejected, (state, action) => { state.assignRoleLoading = false; state.assignRoleError = action.payload; })

  //     // ========== USERS REDUCERS ==========
  //     .addCase(fetchUnassignedUsers.pending, (state) => { state.usersLoading = true; state.usersError = null; })
  //     .addCase(fetchUnassignedUsers.fulfilled, (state, action) => { state.usersLoading = false; state.unassignedUsers = action.payload; })
  //     .addCase(fetchUnassignedUsers.rejected, (state, action) => { state.usersLoading = false; state.usersError = action.payload; })

  //     // ========== ALL USERS (NEW) ==========
  //     .addCase(fetchAllUsers.pending, (state) => { state.usersLoading = true; state.usersError = null; })
  //     .addCase(fetchAllUsers.fulfilled, (state, action) => { state.usersLoading = false; state.allUsers = action.payload; })
  //     .addCase(fetchAllUsers.rejected, (state, action) => { state.usersLoading = false; state.usersError = action.payload; });
  },
});

export const { setFilter } = dashboardSlice.actions;
export default dashboardSlice.reducer;


// // dashboardSlice.js
// import { createSlice } from "@reduxjs/toolkit";
// import { 
//   assignRole, 
//   fetchDashboardSummary, 
//   fetchFilteredSummary, 
//   fetchLowStockItems, 
//   fetchMonthlyAnalytics, 
//   fetchReorderAlerts, 
//   fetchRoles, 
//   fetchUnassignedUsers,
//   fetchAllUsers 
// } from "../../thunks/dashboardThunks/dashboardThunk";

// const initialState = {
//   summary: { 
//     sales: 0, 
//     purchases: 0, 
//     cogs: 0, 
//     cost: 0, 
//     profit: 0, 
//     grossProfit: null, 
//     netCashImpact: 0 
//   },
//   lowStock: [],
//   reorderAlerts: [],
//   monthlyAnalytics: { 
//     labels: [], 
//     sales: [], 
//     purchases: [], 
//     loading: false, 
//     error: null 
//   },
//   monthlySales: [],
//   monthlyPurchases: [],
//   filter: "monthly",
//   loadingSummary: false,
//   loadingLowStock: false,
//   loadingReorder: false,
//   filteredSummary: { 
//     loading: false, 
//     error: null, 
//     data: null, 
//     filter: "monthly", 
//     lastFetchedAt: null 
//   },

//   // Roles state
//   roles: [],
//   rolesLoading: false,
//   rolesError: null,
//   assignRoleLoading: false,
//   assignRoleError: null,

//   // Users for role assignment
//   unassignedUsers: [],
//   usersLoading: false,
//   usersError: null,

//   // NEW: all users (assigned + unassigned)
//   allUsers: [],
// };

// const dashboardSlice = createSlice({
//   name: "dashboard",
//   initialState,
//   reducers: {
//     setFilter: (state, action) => {
//       state.filter = String(action.payload || "monthly").toLowerCase();
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // ========== DASHBOARD SUMMARY (ALL-TIME) ==========
//       .addCase(fetchDashboardSummary.pending, (state) => { 
//         state.loadingSummary = true; 
//       })
//       .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
//         state.loadingSummary = false;
//         const d = action.payload?.data || {};
//         state.summary = {
//           sales: d.sales ?? 0,
//           purchases: d.purchases ?? 0,
//           cogs: d.cogs ?? 0,
//           cost: d.cost ?? d.purchases ?? 0,
//           profit: typeof d.profit === "number" ? d.profit : (d.sales ?? 0) - (d.cost ?? d.purchases ?? 0),
//           netCashImpact: typeof d.netCashImpact === "number" ? d.netCashImpact : (d.sales ?? 0) - (d.purchases ?? 0),
//           grossProfit: typeof d.grossProfit === "number" || d.grossProfit === null ? d.grossProfit : null,
//         };
//       })
//       .addCase(fetchDashboardSummary.rejected, (state) => { 
//         state.loadingSummary = false; 
//       })

//       // ========== LOW STOCK ITEMS ==========
//       .addCase(fetchLowStockItems.pending, (state) => { 
//         state.loadingLowStock = true; 
//       })
//       .addCase(fetchLowStockItems.fulfilled, (state, action) => { 
//         state.loadingLowStock = false; 
//         state.lowStock = action.payload?.items || []; 
//       })
//       .addCase(fetchLowStockItems.rejected, (state) => { 
//         state.loadingLowStock = false; 
//       })

//       // ========== REORDER ALERTS ==========
//       .addCase(fetchReorderAlerts.pending, (state) => { 
//         state.loadingReorder = true; 
//       })
//       .addCase(fetchReorderAlerts.fulfilled, (state, action) => { 
//         state.loadingReorder = false; 
//         state.reorderAlerts = action.payload?.items || []; 
//       })
//       .addCase(fetchReorderAlerts.rejected, (state) => { 
//         state.loadingReorder = false; 
//       })

//       // ========== MONTHLY ANALYTICS ==========
//       .addCase(fetchMonthlyAnalytics.pending, (state) => { 
//         state.monthlyAnalytics.loading = true; 
//         state.monthlyAnalytics.error = null; 
//       })
//       .addCase(fetchMonthlyAnalytics.fulfilled, (state, action) => {
//         state.monthlyAnalytics.loading = false;
//         const labels = action.payload?.labels || [];
//         const sales = action.payload?.sales || [];
//         const purchases = action.payload?.purchases || [];
//         state.monthlyAnalytics.labels = labels;
//         state.monthlyAnalytics.sales = sales;
//         state.monthlyAnalytics.purchases = purchases;
//         state.monthlySales = sales;
//         state.monthlyPurchases = purchases;
//       })
//       .addCase(fetchMonthlyAnalytics.rejected, (state, action) => {
//         state.monthlyAnalytics.loading = false;
//         state.monthlyAnalytics.error = action.error?.message || "Failed to load analytics";
//         state.monthlyAnalytics.labels = [];
//         state.monthlyAnalytics.sales = [];
//         state.monthlyAnalytics.purchases = [];
//         state.monthlySales = [];
//         state.monthlyPurchases = [];
//       })

//       // ========== FILTERED SUMMARY (Today/Weekly/Monthly/Yearly) ==========
//       .addCase(fetchFilteredSummary.pending, (state, action) => {
//         state.filteredSummary.loading = true;
//         state.filteredSummary.error = null;
//         state.filteredSummary.filter = String(action.meta.arg || state.filter || "monthly").toLowerCase();
//       })
//       .addCase(fetchFilteredSummary.fulfilled, (state, action) => {
//         state.filteredSummary.loading = false;
        
//         // ✅ Backend "data" key ke andar values bhejta hai
//         const resData = action.payload?.data || {};
        
//         const fallbackNetCash = typeof resData.sales === "number" && typeof resData.purchases === "number"
//           ? resData.sales - resData.purchases : 0;

//         state.filteredSummary.data = {
//           sales: resData.sales ?? 0,
//           purchases: resData.purchases ?? 0,
//           cogs: resData.cogs ?? 0,
//           cost: resData.cost ?? resData.purchases ?? 0,
//           profit: typeof resData.profit === "number" ? resData.profit : (resData.sales ?? 0) - (resData.purchases ?? 0),
//           netCashImpact: typeof resData.netCashImpact === "number" ? resData.netCashImpact : fallbackNetCash,
//           grossProfit: typeof resData.grossProfit === "number" || resData.grossProfit === null ? resData.grossProfit : null,
//         };
        
//         state.filteredSummary.filter = action.payload?.filter || state.filter;
//         state.filteredSummary.lastFetchedAt = Date.now();
//       })
//       .addCase(fetchFilteredSummary.rejected, (state, action) => {
//         state.filteredSummary.loading = false;
//         state.filteredSummary.error = action.payload || action.error?.message || "Failed to load summary";
//         state.filteredSummary.data = null; // ✅ Purana data clear karein
//       })

//       // ========== ROLES ==========
//       .addCase(fetchRoles.pending, (state) => { 
//         state.rolesLoading = true; 
//         state.rolesError = null; 
//       })
//       .addCase(fetchRoles.fulfilled, (state, action) => { 
//         state.rolesLoading = false; 
//         state.roles = action.payload; 
//       })
//       .addCase(fetchRoles.rejected, (state, action) => { 
//         state.rolesLoading = false; 
//         state.rolesError = action.payload; 
//       })

//       .addCase(assignRole.pending, (state) => { 
//         state.assignRoleLoading = true; 
//         state.assignRoleError = null; 
//       })
//       .addCase(assignRole.fulfilled, (state) => { 
//         state.assignRoleLoading = false; 
//       })
//       .addCase(assignRole.rejected, (state, action) => { 
//         state.assignRoleLoading = false; 
//         state.assignRoleError = action.payload; 
//       })

//       // ========== USERS ==========
//       .addCase(fetchUnassignedUsers.pending, (state) => { 
//         state.usersLoading = true; 
//         state.usersError = null; 
//       })
//       .addCase(fetchUnassignedUsers.fulfilled, (state, action) => { 
//         state.usersLoading = false; 
//         state.unassignedUsers = action.payload; 
//       })
//       .addCase(fetchUnassignedUsers.rejected, (state, action) => { 
//         state.usersLoading = false; 
//         state.usersError = action.payload; 
//       })

//       // ========== ALL USERS ==========
//       .addCase(fetchAllUsers.pending, (state) => { 
//         state.usersLoading = true; 
//         state.usersError = null; 
//       })
//       .addCase(fetchAllUsers.fulfilled, (state, action) => { 
//         state.usersLoading = false; 
//         state.allUsers = action.payload; 
//       })
//       .addCase(fetchAllUsers.rejected, (state, action) => { 
//         state.usersLoading = false; 
//         state.usersError = action.payload; 
//       });
//   },
// });

// export const { setFilter } = dashboardSlice.actions;
// export default dashboardSlice.reducer;