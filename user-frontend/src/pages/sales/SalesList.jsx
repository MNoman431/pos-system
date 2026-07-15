import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesThunk } from "../../redux/thunks/salesThunk/SaleThunk";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { ViewIcon } from "../../components/ui/icons/ActionIcons";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import { Helmet } from "react-helmet-async";

const SalesList = () => {
  const dispatch = useDispatch();
  const { sales = [], loading, meta = { page: 1, totalPages: 1 } } =
    useSelector((state) => state.sales || {});

  useEffect(() => {
    dispatch(fetchSalesThunk({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handlePDF = async (saleId) => {
    try {
      const response = await api.get(`/sales/pdf/${saleId}`, { responseType: "blob" });

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${saleId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully!");
    } catch (err) {
      toast.error("Failed to generate PDF.");
    }
  };

  const breadcrumbPaths = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Sales" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <Helmet>
        <title>All Sales Invoices - FancyStore</title>
        <meta name="description" content="View all sales invoices in FancyStore admin panel" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Breadcrumbs paths={breadcrumbPaths} />

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">Sales Invoices</h2>
          <p className="text-sm text-slate-500 mt-0.5">All sales transactions recorded in the system</p>
        </div>
        <Link
          to="/sales/add"
          className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition text-center"
        >
          + New Sale
        </Link>
      </div>

      {loading && (
        <div className="mb-4 text-sm text-slate-500">Loading sales…</div>
      )}

      {!loading && (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["Invoice #", "Customer", "Grand Total", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-slate-600">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No sales found
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {sale.invoiceNo}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {sale.customer.name}
                    </td>

                    <td className="px-4 py-3 font-semibold tabular-nums text-slate-900">
                      Rs {sale.grandTotal.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {new Date(sale.createdAt).toLocaleDateString("en-GB")}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ViewIcon to={`/sales/view/${sale._id}`} />
                        <button
                          onClick={() => handlePDF(sale._id)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition shadow-sm"
                        >
                          Download PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center border-t border-slate-100 pt-4">
        <span className="text-sm text-slate-600">
          Page <span className="font-semibold text-slate-800">{meta.page}</span> of{" "}
          <span className="font-semibold text-slate-800">{meta.totalPages}</span>
        </span>

        <div className="flex gap-2">
          {meta.page > 1 && (
            <button
              onClick={() => dispatch(fetchSalesThunk({ page: meta.page - 1 }))}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              Previous
            </button>
          )}

          {meta.page < meta.totalPages && (
            <button
              onClick={() => dispatch(fetchSalesThunk({ page: meta.page + 1 }))}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

SalesList.pageName = "ViewSalesList";
export default SalesList;
