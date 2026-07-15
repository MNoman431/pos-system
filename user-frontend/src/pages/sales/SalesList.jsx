import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSalesThunk } from "../../redux/thunks/salesThunk/SaleThunk";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../../services/api";
import { ViewIcon } from "../../components/ui/icons/ActionIcons";
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

  if (loading)
    return (
      <p className="text-center py-12 text-gray-500 text-lg animate-pulse">
        Loading sales...
      </p>
    );

  return (
    <div className="w-full mx-auto p-6 mt-10 bg-white rounded-2xl shadow-xl border border-gray-100">
         <Helmet>
                      <title>All Sales Invoices - FancyStore</title>
                      <meta name="description" content="View all sales invoices in FancyStore admin panel" />
                      <link rel="canonical" href={window.location.href} />
                    </Helmet>
      <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">
        Sales Invoices
      </h2>

      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["Invoice #", "Customer", "Grand Total", "Date", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale) => (
              <tr
                key={sale._id}
                className="hover:bg-gray-50 transition-all duration-150"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {sale.invoiceNo}
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {sale.customer.name}
                </td>

                <td className="px-6 py-4 font-semibold text-gray-800">
                  ${sale.grandTotal.toLocaleString()}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {new Date(sale.createdAt).toLocaleDateString("en-GB")}
                </td>

                <td className="px-6 py-4 flex gap-2">
                  {/* <Link
                    to={`/sales/view/${sale._id}`}
                    className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition"
                  >
                    View

                  </Link> */}
                  <ViewIcon   to={`/sales/view/${sale._id}`}></ViewIcon>

                  <button
                    onClick={() => handlePDF(sale._id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center text-gray-700 font-medium">
        <span className="text-sm">
          Page {meta.page} of {meta.totalPages}
        </span>

        <div className="space-x-2">
          {meta.page > 1 && (
            <button
              onClick={() => dispatch(fetchSalesThunk({ page: meta.page - 1 }))}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              Previous
            </button>
          )}

          {meta.page < meta.totalPages && (
            <button
              onClick={() => dispatch(fetchSalesThunk({ page: meta.page + 1 }))}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
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