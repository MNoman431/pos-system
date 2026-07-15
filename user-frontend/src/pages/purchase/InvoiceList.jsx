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
    <div className="w-full min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-white p-6 rounded-xl shadow-md border border-gray-200">
           <Helmet>
                        <title>Recent Purchase Invoices - FancyStore</title>
                        <meta name="description" content="View recent purchase invoices in FancyStore admin panel" />
                        <link rel="canonical" href={window.location.href} />
                      </Helmet>

        <Breadcrumbs
          paths={[{ label: "Home", to: "/" }, { label: "Purchases" }]}
        />

        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Recent Purchases
        </h2>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {["#", "Invoice No", "Vendor", "Grand Total", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {purchases.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-500 text-sm"
                  >
                    No purchases found.
                  </td>
                </tr>
              ) : (
                purchases.map((p, index) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-gray-700 text-sm">
                      {(currentPage - 1) * limit + index + 1}
                    </td>

                    <td className="px-6 py-4 text-blue-600 font-medium">
                      <Link to={`/purchase/${p._id}`} className="hover:underline">
                        {p.invoiceNo}
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-gray-700">
                      {p.vendor?.name || "N/A"}
                    </td>

                    <td className="px-6 py-4 text-gray-800 font-semibold">
                      {formatCurrency(p.grandTotal)}
                    </td>

                    <td className="px-6 py-4 flex items-center gap-2">
                      <button
                        onClick={() => handlePDF(p._id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm shadow-sm"
                      >
                        Download PDF
                      </button>

                      <ViewIcon to={`/purchase/${p._id}`} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta?.totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-700 font-medium text-sm">
              Page {currentPage} of {meta.totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === meta.totalPages || loading}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};
InvoiceList.pageName = "ViewPurchases";
export default InvoiceList;
