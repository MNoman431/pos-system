import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, fetchAllUsers, assignRole } from "../../redux/thunks/roleThunks/RoleThunk";
import toast from "react-hot-toast";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";

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

  const breadcrumbPaths = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Assign Role" },
  ];

  if (!canAccessPage) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm mt-10 text-center text-red-600 text-lg font-semibold dark:border-slate-800 dark:bg-slate-900 dark:text-red-400">
        🔒 Access Denied — Only Master can assign roles.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Breadcrumbs paths={breadcrumbPaths} />

      <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">Assign Role</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 mb-6">Select a user and assign a role to manage access permissions.</p>

      {/* Form Card */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">

        {/* User Select */}
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block dark:text-slate-300">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border border-slate-300 px-3.5 py-2.5 rounded-lg w-full bg-white text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-400"
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
          <label className="text-sm font-medium text-slate-700 mb-1 block dark:text-slate-300">Select Role</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-slate-300 px-3.5 py-2.5 rounded-lg w-full bg-white text-[15px] shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:border-indigo-400"
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
        className="w-full sm:w-auto rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-sm transition active:scale-[0.98]"
      >
        Assign Role
      </button>

      {/* User List */}
      <h2 className="text-base font-semibold mt-10 mb-3 text-slate-800 dark:text-slate-100">Users &amp; Their Roles</h2>

      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">User</th>
              <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Email</th>
              <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Assigned Role</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {allUsers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No users found
                </td>
              </tr>
            ) : (
              allUsers.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="px-4 py-3 text-slate-800 font-medium dark:text-slate-100">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.roleId ? (
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold dark:bg-indigo-500/10 dark:text-indigo-400">
                        {roles.find((r) => r._id === u.roleId)?.roleName || "—"}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm dark:text-slate-500">No Role Assigned</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AssignRolePage;