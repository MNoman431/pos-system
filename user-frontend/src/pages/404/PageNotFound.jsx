import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-950 text-center p-6">

      <h1 className="text-7xl font-bold text-red-600 dark:text-red-400">404</h1>

      <h2 className="text-2xl font-semibold text-gray-800 dark:text-slate-100 mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-600 dark:text-slate-400 mt-2 mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition duration-200"
      >
        Go Back Home
      </Link>
    </div>
  );
}