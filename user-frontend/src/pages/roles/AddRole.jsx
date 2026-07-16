import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { PERMISSIONS } from "../../constants/permission";
import {
  createRole,
  updateRole,
  fetchRoleById, // ✅ ADD THIS
} from "../../redux/thunks/roleThunks/RoleThunk";

const AddRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  // ✅ USE selectedRole INSTEAD OF roles list
  const { selectedRole } = useSelector((state) => state.roles);

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [roleMap, setRoleMap] = useState({});

  /* ===================== FETCH ROLE BY ID (EDIT MODE) ===================== */
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchRoleById(id));
    }
  }, [id, isEditMode, dispatch]);

  /* ===================== PREFILL DATA ===================== */
  useEffect(() => {
    if (isEditMode && selectedRole) {
      setRoleName(selectedRole.roleName);
      setDescription(selectedRole.description || "");
      setRoleMap(selectedRole.roleMap || {});
    }
  }, [isEditMode, selectedRole]);

  /* ===================== TOGGLE PERMISSION ===================== */
  const togglePermission = (key) => {
    setRoleMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    try {
      if (isEditMode) {
        await dispatch(
          updateRole({
            id,
            roleName,
            description,
            roleMap,
          })
        ).unwrap();

        toast.success("✅ Role updated successfully");
      } else {
        await dispatch(
          createRole({
            roleName,
            description,
            roleMap,
          })
        ).unwrap();

        toast.success("✅ Role created successfully");
      }

      navigate("/dashboard/assign-role");
    } catch (err) {
      toast.error(err || "Something went wrong");
    }
  };

  return (
    <div className="w-full mx-auto bg-white p-10 shadow-xl rounded-2xl border border-gray-200 dark:bg-slate-900 dark:border-slate-800">
      <h1 className="text-3xl font-bold text-gray-900 mb-1 dark:text-slate-100">
        {isEditMode ? "Edit Role" : "Add New Role"}
      </h1>

      <p className="text-gray-500 mb-8 dark:text-slate-400">
        {isEditMode
          ? "Update role details and permissions"
          : "Create a new user role and assign permissions below"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Role Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-slate-300">
            Role Name
          </label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
            placeholder="Enter role name..."
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1 dark:text-slate-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400"
            placeholder="Optional description..."
            rows={3}
          />
        </div>

        {/* Permissions */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-slate-100">
            Permissions
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(PERMISSIONS).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800"
              >
                <input
                  type="checkbox"
                  checked={!!roleMap[key]}
                  onChange={() => togglePermission(key)}
                  className="w-5 h-5 accent-blue-600 dark:accent-indigo-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-1/2 mx-auto block bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg shadow hover:bg-blue-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition"
        >
          {isEditMode ? "Update Role" : "Save Role"}
        </button>
      </form>
    </div>
  );
};

export default AddRole;