import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPurchases } from "../../redux/thunks/purchaseThunks/PurchaseThunk";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { ViewIcon } from "../../components/ui/icons/ActionIcons";
import { Helmet } from "react-helmet-async";

const InvoiceList = () => {
  const dispatch = useDispatch();
  const { purchases, loading, error, meta } = useSelector(
    (state) => state.purchase
  );

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val || 0);

  useEffect(() => {
    dispatch(fetchPurchases({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  const handlePDF = async (id) => {
    try {
      const response = await api.get(`/purchase/pdf/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `purchase-${id}.pdf`;
      link.click();

      toast.success("PDF downloaded successfully!");
    } catch {
      toast.error("PDF download failed.");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <Helmet>
        <title>Recent Purchase Invoices - FancyStore</title>
        <meta name="description" content="View recent purchase invoices in FancyStore admin panel" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Breadcrumbs
        paths={[{ label: "Dashboard", to: "/dashboard" }, { label: "Purchases" }]}
      />

      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-900">Purchase Invoices</h2>
          <p className="text-sm text-slate-500 mt-0.5">Stock purchased from vendors</p>
        </div>
        <Link
          to="/purchase/new"
          className="w-full sm:w-auto rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition text-center"
        >
          + New Invoice
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["#", "Invoice No", "Vendor", "Grand Total", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-semibold text-slate-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {purchases.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No purchases found.
                </td>
              </tr>
            ) : (
              purchases.map((p, index) => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-500">
                    {(currentPage - 1) * limit + index + 1}
                  </td>

                  <td className="px-4 py-3">
                    <Link to={`/purchase/${p._id}`} className="text-indigo-600 hover:underline font-medium">
                      {p.invoiceNo}
                    </Link>
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {p.vendor?.name || "N/A"}
                  </td>

                  <td className="px-4 py-3 font-semibold tabular-nums text-slate-900">
                    {formatCurrency(p.grandTotal)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ViewIcon to={`/purchase/${p._id}`} />
                      <button
                        onClick={() => handlePDF(p._id)}
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

      {/* Pagination */}
      {meta?.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 border-t border-slate-100 pt-4">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1 || loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-slate-600">
            Page <span className="font-semibold text-slate-800">{currentPage}</span> of{" "}
            <span className="font-semibold text-slate-800">{meta.totalPages}</span>
          </span>

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === meta.totalPages || loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
    </div>
  );
};
InvoiceList.pageName = "ViewPurchases";
export default InvoiceList;
