

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

  return (
    <div className="w-full mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-4">Roles List</h1>
      <p className="text-gray-500 mb-6">Manage system roles and permissions</p>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="px-4 py-3">Role Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Permissions</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((role) => (
              <tr key={role._id} className="border-b hover:bg-gray-50">
                {/* Role Name */}
                <td className="px-4 py-4 font-semibold text-gray-900">
                  {role.roleName}
                </td>

                {/* Description */}
                <td className="px-4 py-4 text-gray-600">
                  {role.description || "-"}
                </td>

                {/* Permissions */}
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(role.roleMap || {})
                      .filter(([_, allowed]) => allowed)
                      .map(([key]) => (
                        <span
                          key={key}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                        >
                          {DISPLAY_PERMISSIONS[key]}
                        </span>
                      ))}
                    {Object.keys(role.roleMap || {}).length === 0 && (
                      <span className="text-gray-400 text-sm">
                        No Permissions
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      to={`/dashboard/roles/${role._id}/edit`}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <FiEdit2 size={18} />
                    </Link>

                    <DeleteIcon
                      onClick={() => dispatch(deleteRole(role._id))}
                      title="Delete Role"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
