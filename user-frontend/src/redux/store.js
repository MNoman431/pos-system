import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices/AuthSlice";
import inventoryReducer from "./slices/inventorySlices/InventorySlice";
import vendorReducer from "./slices/vendorSlices/VendorSlice";
import purchaseReducer from "./slices/purchaseSlices/PurchaseSlice";
import salesReducer from "./slices/saleSlices/SaleSlice";
import dashboardReducer from "./slices/dashboardSlices/dashboardSlice";
import rolesReducer from "./slices/roleSlices/RoleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    vendor: vendorReducer,
    purchase: purchaseReducer,
    sales: salesReducer,
    dashboard: dashboardReducer, 
    roles: rolesReducer,
  },
});
