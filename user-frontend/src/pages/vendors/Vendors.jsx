import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchVendors,
  deactivateVendor,
} from "../../redux/thunks/vendorThunks/VendorThunk";
import { EditIcon, DeactivateIcon } from "../../components/ui/icons/ActionIcons";
import { Helmet } from "react-helmet-async";

const Vendors = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { vendors, loading, error } = useSelector((state) => state.vendor);

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const handleDeactivate = (id) => {
    if (window.confirm("Are you sure you want to deactivate this vendor?")) {
      dispatch(deactivateVendor(id));
    }
  };

  if (loading)
    return (
      <p className="p-6 text-sm text-slate-600">Loading vendors...</p>
    );

  if (error)
    return (
      <p className="p-6 text-sm text-red-600">{error}</p>
    );

  return (
    <div className="p-6">
      {/* SEO */}
      <Helmet>
        <title>All Vendors - FancyStore</title>
        <meta
          name="description"
          content="View all vendors in FancyStore admin panel"
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Vendors
        </h2>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
          Total: {vendors.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">
                Contact Person
              </th>
              <th className="px-4 py-3 text-left font-medium">
                Phone
              </th>
              <th className="px-4 py-3 text-left font-medium">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium">
                Address
              </th>
              <th className="px-4 py-3 text-left font-medium">
                Created By
              </th>
              <th className="px-4 py-3 text-center font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No vendors found
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr
                  key={vendor._id}
                  className="border-t border-slate-200 hover:bg-slate-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {vendor.name}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {vendor.contactPerson || "-"}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {vendor.phone || "-"}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {vendor.email || "-"}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {vendor.address || "-"}
                  </td>

                  {/* ✅ FIXED: Created By */}
                  <td className="px-4 py-3 text-slate-600">
                    {vendor.createdBy
                      ? `${vendor.createdBy.firstName} ${vendor.createdBy.lastName}`
                      : "-"}
                  </td>

                  {/* FIXED: Actions (no nested <td>) */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <EditIcon to={`/vendors/edit/${vendor._id}`} />
                      <DeactivateIcon
                        onClick={() =>
                          handleDeactivate(vendor._id)
                        }
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
};

Vendors.pageName = "ViewVendors";
export default Vendors;