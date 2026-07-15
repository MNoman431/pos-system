
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgetPassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";
import About from "../pages/about/AboutUs";
import Contact from "../pages/contact/ContactUs";
import Profile from "../pages/auth/Profile";

import Dashboard from "../pages/dashboard/Dashboard";
import InventoryList from "../pages/inventory/InventoryList";
import AddInventory from "../pages/inventory/AddInventory";
import InventoryView from "../pages/inventory/InventoryView";

import Vendors from "../pages/vendors/Vendors";
import AddVendor from "../pages/vendors/Addvendor";

import NewInvoice from "../pages/purchase/NewInvoice";
import InvoiceList from "../pages/purchase/InvoiceList";
import InvoiceView from "../pages/purchase/InvoiceView";

import SaleList from "../pages/sales/SalesList";
import AddSale from "../pages/sales/AddSale";
import SalesView from "../pages/sales/SalesView";
// import RolePage from "../pages/roles/RolePage";
import AssignRolePage from "../pages/roles/AssignRolePage";
import RoleLists from "../pages/roles/RoleLists";
import AddRole from "../pages/roles/AddRole";
import PageNotFound from "../pages/404/PageNotFound";
import Unauthorized from "../pages/unauthorized/Unauthorized";
// import AssignRolePAge from "../pages/dashboard/AssignRolePage";
// import RolePage from "../pages/dashboard/RolePage";

const AppRoutes = () => {
  const location = useLocation();

  // ✅ Auth pages jahan Navbar nahi dikhana
  const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-otp",
  ];

  const hideNavbar = authRoutes.includes(location.pathname);

  const routesElement = (
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedRoute permission="ViewDashboard" />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          {/* <Route element={<ProtectedRoute permission="ManageRoles" />}>
            <Route path="/dashboard/roles" element={<RolePage />} />
          </Route> */}

          <Route element={<ProtectedRoute permission="AssignRole" />}>
            <Route path="/dashboard/assign-role" element={<AssignRolePage />} />
          </Route>
          <Route element={<ProtectedRoute permission="RoleList" />}>
            <Route path="/dashboard/role-list" element={<RoleLists />} />
          </Route>
          {/* ✅ Add Role Page (Only ManageRoles OR Master) */}
          <Route element={<ProtectedRoute permission="ManageRoles" />}>
            <Route path="/dashboard/roles/add" element={<AddRole />} />
            <Route path="/dashboard/roles/:id/edit" element={<AddRole />} />
          </Route>

          {/* Inventory */}
          <Route
            path="/inventory"
            element={<ProtectedRoute permission="ViewInventory" />}
          >
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<InventoryList />} />

            <Route element={<ProtectedRoute permission="AddInventory" />}>
              <Route path="add" element={<AddInventory />} />
              <Route path="edit/:id" element={<AddInventory />} />
            </Route>

            <Route element={<ProtectedRoute permission="ViewInventory" />}>
              <Route path="view/:id" element={<InventoryView />} />
            </Route>
          </Route>

          {/* Purchase */}
          <Route element={<ProtectedRoute permission="ViewPurchaseList" />}>
            <Route path="/purchase/list" element={<InvoiceList />} />
            <Route path="/purchase/:id" element={<InvoiceView />} />
          </Route>

          <Route element={<ProtectedRoute permission="CreatePurchase" />}>
            <Route path="/purchase/new" element={<NewInvoice />} />
          </Route>

          {/* Vendors */}
          <Route element={<ProtectedRoute permission="ViewVendors" />}>
            <Route path="/vendors" element={<Vendors />} />
          </Route>

          <Route element={<ProtectedRoute permission="AddVendor" />}>
            <Route path="/vendors/add" element={<AddVendor />} />
            <Route path="/vendors/edit/:id" element={<AddVendor />} />
          </Route>

          {/* Sales */}
          <Route
            path="/sales"
            element={<ProtectedRoute permission="ViewSalesList" />}
          >
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<SaleList />} />
          </Route>

          <Route element={<ProtectedRoute permission="CreateSale" />}>
            <Route path="/sales/add" element={<AddSale />} />
            <Route path="/sales/edit/:id" element={<AddSale />} />
          </Route>

          <Route element={<ProtectedRoute permission="ViewSalesList" />}>
            <Route path="/sales/view/:id" element={<SalesView />} />
          </Route>
        </Route>

        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
  );

  return hideNavbar ? routesElement : <AppLayout>{routesElement}</AppLayout>;
};

export default AppRoutes;
