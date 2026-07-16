import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchVendors,
  deactivateVendor,
} from "../../redux/thunks/vendorThunks/VendorThunk";
import { EditIcon, DeactivateIcon } from "../../components/ui/icons/ActionIcons";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import { Helmet } from "react-helmet-async";

const Vendors = () => {
  const dispatch = useDispatch();

  const { vendors, loading, error } = useSelector((state) => state.vendor);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const handleDeactivate = (id) => {
    if (window.confirm("Are you sure you want to deactivate this vendor?")) {
      dispatch(deactivateVendor(id));
    }
  };

  const breadcrumbPaths = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Vendors" },
  ];

  if (loading)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Loading vendors...
      </div>
    );

  if (error)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-sm text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-red-400">
        {error}
      </div>
    );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* SEO */}
      <Helmet>
        <title>All Vendors - FancyStore</title>
        <meta
          name="description"
          content="View all vendors in FancyStore admin panel"
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Breadcrumbs paths={breadcrumbPaths} />

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">Vendors</h2>
          <p className="text-sm text-slate-500 mt-0.5 dark:text-slate-400">Suppliers you purchase inventory from</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Total: {vendors.length}
          </span>
          <Link
            to="/vendors/add"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-sm transition"
          >
            + Add Vendor
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Contact Person</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Phone</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Address</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Created By</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-600 dark:text-slate-300">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {vendors.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                  No vendors found
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => {
                const isActive = (vendor.status || "active") === "active";
                return (
                  <tr key={vendor._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                      {vendor.name}
                    </td>

                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {vendor.contactPerson || "-"}
                    </td>

                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {vendor.phone || "-"}
                    </td>

                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {vendor.email || "-"}
                    </td>

                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {vendor.address || "-"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                          isActive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {vendor.createdBy
                        ? `${vendor.createdBy.firstName} ${vendor.createdBy.lastName}`
                        : "-"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <EditIcon to={`/vendors/edit/${vendor._id}`} />
                        <DeactivateIcon
                          onClick={() => handleDeactivate(vendor._id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Vendors.pageName = "ViewVendors";
export default Vendors;
