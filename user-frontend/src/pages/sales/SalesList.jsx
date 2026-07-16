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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Helmet>
        <title>All Sales Invoices - FancyStore</title>
        <meta name="description" content="View all sales invoices in FancyStore admin panel" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Breadcrumbs paths={breadcrumbPaths} />

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">Sales Invoices</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">All sales transactions recorded in the system</p>
        </div>
        <Link
          to="/sales/add"
          className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 shadow-sm transition text-center"
        >
          + New Sale
        </Link>
      </div>

      {loading && (
        <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">Loading sales…</div>
      )}

      {!loading && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                {["Invoice #", "Customer", "Grand Total", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                    No sales found
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                      {sale.invoiceNo}
                    </td>

                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {sale.customer.name}
                    </td>

                    <td className="px-4 py-3 font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                      Rs {sale.grandTotal.toLocaleString()}
                    </td>

                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {new Date(sale.createdAt).toLocaleDateString("en-GB")}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ViewIcon to={`/sales/view/${sale._id}`} />
                        <button
                          onClick={() => handlePDF(sale._id)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition shadow-sm"
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
      <div className="mt-6 flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-4">
        <span className="text-sm text-slate-600 dark:text-slate-300">
          Page <span className="font-semibold text-slate-800 dark:text-slate-100">{meta.page}</span> of{" "}
          <span className="font-semibold text-slate-800 dark:text-slate-100">{meta.totalPages}</span>
        </span>

        <div className="flex gap-2">
          {meta.page > 1 && (
            <button
              onClick={() => dispatch(fetchSalesThunk({ page: meta.page - 1 }))}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition"
            >
              Previous
            </button>
          )}

          {meta.page < meta.totalPages && (
            <button
              onClick={() => dispatch(fetchSalesThunk({ page: meta.page + 1 }))}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition"
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
