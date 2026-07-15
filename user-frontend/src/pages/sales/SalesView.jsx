import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchSaleByIdThunk } from "../../redux/thunks/salesThunk/SaleThunk";
import toast from "react-hot-toast";

const SalesView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleSale, loading } = useSelector((state) => state.sales);

  useEffect(() => {
    if (id) {
      dispatch(fetchSaleByIdThunk(id))
        .unwrap()
        .catch((err) => toast.error(err.message || "Failed to fetch sale"));
    }
  }, [dispatch, id]);

  if (loading || !singleSale)
    return <p className="text-center mt-6">Loading sale...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-2xl font-bold mb-4">
        Sale Invoice #{singleSale.invoiceNo}
      </h2>

      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-gray-700">Customer</h3>
          <p className="font-medium">{singleSale.customer?.name}</p>
          <p className="text-sm text-gray-500">
            {singleSale.customer?.phone || "—"}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse border border-gray-200 mb-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Item</th>
            <th className="border px-4 py-2">Qty</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {singleSale.items.map((item) => (
            <tr key={item._id}>
              <td className="border px-4 py-2">{item.itemName}</td>
              <td className="border px-4 py-2 text-center">{item.qty}</td>
              <td className="border px-4 py-2 text-right">
                {item.price.toLocaleString()}
              </td>
              <td className="border px-4 py-2 text-right">
                {(item.qty * item.price).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Grand Total */}
      <div className="text-right text-xl font-bold">
        Grand Total: {singleSale.grandTotal.toLocaleString()}
      </div>

      {/* Back Link */}
      <div className="mt-4">
        <Link
          to="/sales"
          className="text-blue-600 hover:underline font-medium"
        >
          &larr; Back to Sales List
        </Link>
      </div>
    </div>
  );
};

SalesView.pageName = "ViewSaleDetail";
export default SalesView;