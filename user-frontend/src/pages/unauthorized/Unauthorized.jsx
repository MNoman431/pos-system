import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

const Unauthorized = () => {
  const { isAuthenticated } = useSelector((s) => s.auth);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm max-w-md w-full">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
          <ShieldExclamationIcon className="h-7 w-7 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="mt-2 text-sm text-slate-500">
          You don&apos;t have permission to view this page. Contact an administrator if you think this is a mistake.
        </p>
        <Link
          to={isAuthenticated ? "/dashboard" : "/login"}
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition"
        >
          {isAuthenticated ? "Back to Dashboard" : "Back to Login"}
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
