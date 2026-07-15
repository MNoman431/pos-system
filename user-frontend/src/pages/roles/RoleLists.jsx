

import React, { useEffect} from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
// import { api } from "../../services/api";
// import toast from "react-hot-toast";
import {
  deleteRole,
  fetchRoles,
} from "../../redux/thunks/roleThunks/RoleThunk";
import { useDispatch, useSelector } from "react-redux";
import { DeleteIcon } from "../../components/ui/icons/ActionIcons";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

const DISPLAY_PERMISSIONS = {
  ViewDashboard: "View Dashboard",
  ViewAnalytics: "View Analytics",
  ViewLowStock: "View Low Stock",
  ViewReorderAlerts: "View Reorder Alerts",
  ViewProfitSummary: "View Profit Summary",
  ViewInventory: "View Inventory",
  AddInventory: "Add Inventory",
  ViewPurchaseList: "Purchase List",
  CreatePurchase: "Create Purchase",
  ViewPurchaseDetail: "Purchase Detail",
  ViewVendors: "View Vendors",
  AddVendor: "Add Vendor",
  CreateSale: "Create Sale",
  ViewSalesList: "Sales List",
  ViewSaleDetail: "Sales Detail",
  ManageRoles: "Manage Roles",
  AssignRole: "Assign Role",
};

export default function RoleLists() {
  // const [roles, setRoles] = useState([]);
  // const [loading, setLoading] = useState(true);
  const dispatch = useDispatch(); // ✅ REQUIRED FOR deleteRole()
  const { roles, rolesLoading } = useSelector((state) => state.roles);

  // const loadRoles = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await api.get("/roles");
  //     setRoles(res.data.roles || []);
  //   } catch (err) {
  //     toast.error("Failed to load roles");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Delete this role?")) return;
  //   try {
  //     await api.delete(`/roles/${id}`);
  //     toast.success("Role deleted!");
  //     loadRoles();
  //   } catch (err) {
  //     toast.error("Failed to delete role");
  //   }
  // };

  // useEffect(() => {
  //   loadRoles();
  // }, []);

  useEffect(() => {
    dispatch(fetchRoles());
  }, []);

  const breadcrumbPaths = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Roles" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <Breadcrumbs paths={breadcrumbPaths} />

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-slate-900">Roles List</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage system roles and permissions</p>
        </div>
        <Link
          to="/dashboard/roles/add"
          className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition text-center"
        >
          + Add Role
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">Role Name</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Description</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Permissions</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {roles.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role._id} className="hover:bg-slate-50 transition-colors">
                  {/* Role Name */}
                  <td className="px-4 py-4 font-medium text-slate-800">
                    {role.roleName}
                  </td>

                  {/* Description */}
                  <td className="px-4 py-4 text-slate-600">
                    {role.description || "-"}
                  </td>

                  {/* Permissions */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(role.roleMap || {})
                        .filter(([_, allowed]) => allowed)
                        .map(([key]) => (
                          <span
                            key={key}
                            className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {DISPLAY_PERMISSIONS[key] || key}
                          </span>
                        ))}
                      {Object.keys(role.roleMap || {}).length === 0 && (
                        <span className="text-slate-400 text-sm">
                          No Permissions
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/dashboard/roles/${role._id}/edit`}
                        className="rounded-lg border border-slate-200 p-2 text-indigo-600 hover:bg-indigo-50 transition shadow-sm"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </Link>

                      <DeleteIcon
                        onClick={() => dispatch(deleteRole(role._id))}
                        title="Delete Role"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
