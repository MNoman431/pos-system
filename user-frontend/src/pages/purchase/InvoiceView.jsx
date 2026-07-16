import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import { Helmet } from 'react-helmet-async';

const InvoiceView = () => {
  const { id } = useParams(); // invoice id
  const navigate = useNavigate(); // for back button
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/purchase/${id}`);
        if (res.data && res.data.data) {
          setInvoice(res.data.data);
        } else {
          setError('Invoice not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) return <p className="text-center py-8 dark:text-slate-300">Loading...</p>;
  if (error) return <p className="text-red-500 dark:text-red-400 text-center py-8">{error}</p>;
  if (!invoice) return <p className="text-center py-8 dark:text-slate-300">No invoice found</p>;

  const formatCurrency = (v) =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(v || 0);

  // Breadcrumbs paths
  const paths = [
    { label: "Home", to: "/" },
    { label: "Purchases", to: "/purchase/list" },
    { label: `Invoice #${invoice.invoiceNo}` } // current page
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-slate-900 dark:border dark:border-slate-800">
         <Helmet>
                <title>Purchase Invoice View - FancyStore</title>
                <meta name="description" content="Purchase View invoice details in FancyStore admin panel" />
                <link rel="canonical" href={window.location.href} />
              </Helmet>
      {/* Breadcrumbs */}
      <Breadcrumbs paths={paths} />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 rounded text-sm"
      >
        &larr; Back
      </button>

      {/* Invoice Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1 dark:text-slate-100">Invoice #{invoice.invoiceNo}</h2>
        <div className="text-gray-600 dark:text-slate-400">
          <p><span className="font-semibold">Vendor:</span> {invoice.vendor?.name || 'N/A'}</p>
          <p><span className="font-semibold">Purchase Date:</span> {new Date(invoice.purchaseDate).toLocaleString()}</p>
          <p>
            <span className="font-semibold">Created By:</span>{' '}
            {invoice.createdBy
              ? `${invoice.createdBy.firstName || ''} ${invoice.createdBy.lastName || ''}`.trim() || invoice.createdBy.email
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
          <thead className="bg-gray-50 dark:bg-slate-800/60">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-slate-300">#</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-slate-300">Item Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-slate-300">Code</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-slate-300">Qty</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-slate-300">Cost Price</th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-700 dark:text-slate-300">Line Total</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
            {invoice.items.map((item, idx) => (
              <tr key={item.itemId} className="hover:bg-gray-50 dark:hover:bg-slate-800/60">
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-slate-400">{idx + 1}</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-slate-400">{item.itemName}</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-slate-400">{item.itemCode}</td>
                <td className="px-4 py-2 text-sm text-right text-gray-600 dark:text-slate-400">{item.qty}</td>
                <td className="px-4 py-2 text-sm text-right text-gray-600 dark:text-slate-400">{formatCurrency(item.costPrice)}</td>
                <td className="px-4 py-2 text-sm text-right text-gray-600 dark:text-slate-400">{formatCurrency(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-6 flex flex-col items-end">
        <div className="w-full max-w-md bg-gray-100 dark:bg-slate-800/60 p-4 rounded">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-700 dark:text-slate-300">SubTotal:</span>
            <span className="text-sm font-medium text-gray-900 dark:text-slate-100">{formatCurrency(invoice.subTotal)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-700 dark:text-slate-300">Discount ({invoice.discountType}):</span>
            <span className="text-sm font-medium text-gray-900 dark:text-slate-100">{formatCurrency(invoice.discount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-slate-700">
            <span className="text-lg font-semibold text-gray-800 dark:text-slate-100">Grand Total:</span>
            <span className="text-lg font-semibold text-gray-800 dark:text-slate-100">{formatCurrency(invoice.grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
InvoiceView.pageName = "ViewPurchases";
export default InvoiceView;