
import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const tabClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-md text-sm ${
    isActive ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
  }`;

const InventoryLayout = () => {
  return (
    <div className="p-4">
      {/* Children render here */}
      <Outlet />
    </div>
  );
};

export default InventoryLayout;
