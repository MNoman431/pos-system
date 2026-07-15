
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ permission }) => {
  const { isAuthenticated, loading, user } = useSelector((s) => s.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ MASTER → FULL ACCESS
  if (user?.roleId === "master") {
    return <Outlet />;
  }

  // ✅ BACKEND MASTER ROLE (roleMap = "all")
  if (user?.role?.roleMap === "all") {
    return <Outlet />;
  }

  // ✅ NORMAL USERS → check permission
  if (permission) {
    const roleMap = user?.role?.roleMap || {};
    const allowed = roleMap[permission] === true;

    if (!allowed) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;