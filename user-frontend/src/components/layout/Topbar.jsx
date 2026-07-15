// src/components/layout/Topbar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../../redux/thunks/authThunks/AuthThunk";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [userMenu, setUserMenu] = useState(false);

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.name || "User";

  const handleLogout = async () => {
    try {
      const res = await dispatch(logoutUser());
      if (logoutUser.fulfilled.match(res)) {
        toast.success("Logged out successfully.");
        navigate("/login");
      } else {
        toast.error(res?.payload || "Failed to logout");
      }
    } catch {
      toast.error("Network error while logging out");
    } finally {
      setUserMenu(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
        aria-label="Open menu"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Search (visual only — not wired to a search backend) */}
      <div className="relative hidden flex-1 max-w-md sm:block">
        <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search products, invoices…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
        />
      </div>

      <div className="flex-1 sm:hidden" />

      {/* User menu */}
      <div className="relative">
        <button
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          onClick={() => setUserMenu((o) => !o)}
        >
          <UserCircleIcon className="h-7 w-7 text-slate-400" />
          <span className="hidden sm:inline">{userName}</span>
          <ChevronDownIcon
            className={`h-4 w-4 text-slate-400 transition-transform duration-150 ${userMenu ? "rotate-180" : ""}`}
          />
        </button>

        {userMenu && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-2 shadow-xl z-50">
            <NavLink
              to="/profile"
              className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              onClick={() => setUserMenu(false)}
            >
              Profile
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
