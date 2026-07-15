import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, fetchAllUsers, assignRole } from "../../redux/thunks/roleThunks/RoleThunk";
import toast from "react-hot-toast";

const AssignRolePage = () => {
  const dispatch = useDispatch();

  const { allUsers = [], roles = [] } = useSelector((state) => state.roles);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const canAccessPage = currentUser?.roleId === "master";

  useEffect(() => {
    if (canAccessPage) {
      dispatch(fetchRoles());
      dispatch(fetchAllUsers());
    }
  }, [canAccessPage, dispatch]);

  const handleAssign = async () => {
    if (!selectedUser || !selectedRole) {
      return toast.error("Please select both user and role!");
    }

    try {
      await dispatch(assignRole({ userId: selectedUser, roleId: selectedRole })).unwrap();
      toast.success("✅ Role assigned successfully!");
      dispatch(fetchAllUsers());
      setSelectedUser("");
      setSelectedRole("");
    } catch (err) {
      toast.error(err || "Failed to assign role");
    }
  };

  if (!canAccessPage) {
    return (
      <div className="mt-20 text-center text-red-600 text-xl font-semibold">
        🔒 Access Denied — Only Master can assign roles.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-10 mt-[1px]  bg-white shadow-xl rounded-2xl border border-gray-200">

      <h1 className="text-3xl font-bold mb-2 text-gray-900">Assign Role</h1>
      <p className="text-gray-500 mb-8">Select a user and assign a role to manage access permissions.</p>

      {/* Form Card */}
      <div className="grid gap-6 md:grid-cols-2 mb-7">

        {/* User Select */}
        <div>
          <label className="font-medium text-gray-700 mb-1 block">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border border-gray-300 px-4 py-3 rounded-lg w-full bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Choose a user...</option>
            {allUsers.map((u) => (
              <option key={u._id} value={u._id}>
                {u.firstName} {u.lastName} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {/* Role Select */}
        <div>
          <label className="font-medium text-gray-700 mb-1 block">Select Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 px-4 py-3 rounded-lg w-full bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 transition"
          >
            <option value="">Choose a role...</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.roleName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assign Button */}
      <button
        onClick={handleAssign}
        className="w-1/2 mx-auto block bg-black text-white py-3 rounded-xl font-semibold
                  hover:bg-gray-800 shadow-md transition active:scale-95"
      >
        Assign Role
      </button>

      {/* User List */}
      <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900">Users & Their Roles</h2>

      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="w-full border-collapse text-gray-800">
          <thead className="bg-gray-100">
            <tr className="text-left border-b">
              <th className="p-4 text-sm font-semibold">User</th>
              <th className="p-4 text-sm font-semibold">Email</th>
              <th className="p-4 text-sm font-semibold">Assigned Role</th>
            </tr>
          </thead>

          <tbody>
            {allUsers.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4">{u.firstName} {u.lastName}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  {u.roleId ? (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {roles.find((r) => r._id === u.roleId)?.roleName || "—"}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">No Role Assigned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AssignRolePage;