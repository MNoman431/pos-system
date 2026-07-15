import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchDashboardSummary,
  fetchFilteredSummary,
  fetchLowStockItems,
  fetchMonthlyAnalytics,
  fetchReorderAlerts,
} from "../../redux/thunks/dashboardThunks/dashboardThunk";
import { getFilteredSummaryApi } from "../../services/dashboardApi/dashbaordApi";
import { fetchItems } from "../../redux/thunks/inventoryThunk/InventoryThunk";
import { fetchSalesThunk } from "../../redux/thunks/salesThunk/SaleThunk";
import {
  BanknotesIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import DonutChart from "../../components/charts/DonutChart";
import HeartBeatChart from "../../components/charts/HeartBeatChart";
import LowStockTable from "../../components/dashbaord/LowStockTable";
import ReorderAlerts from "../../components/dashbaord/ReorderAlerts";
import DateFilter from "../../components/dashbaord/DateFilter";
import SummaryCards from "../../components/dashbaord/SummarCards";
import FilteredSummaryCards from "../../components/dashbaord/FilteredSummaryCards";
import BarChart from "../../components/charts/BarChart";
import StatCard from "../../components/ui/cards/StatCard";
import { Helmet } from "react-helmet-async";

const fmtRs = (n) =>
  `Rs ${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const Dashboard = () => {
  const dispatch = useDispatch();

  const {
    summary,
    filteredSummary,
    lowStock,
    reorderAlerts,
    monthlyAnalytics,
    filter,
  } = useSelector((state) => state.dashboard || {});

  const totalProducts = useSelector((state) => state.inventory?.meta?.totalItems ?? 0);
  const recentSales = useSelector((state) => state.sales?.sales || []);

  // "Today" sales figure, fetched independently so it doesn't collide with the
  // period selector above (which shares the same filteredSummary slot).
  const [todaySales, setTodaySales] = useState(null);

  // Decide which summary to use in Donut
  const chartSummary = filter ? filteredSummary?.data || {} : summary;

  // Initial Load
  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchLowStockItems());
    dispatch(fetchReorderAlerts());
    dispatch(fetchItems());
    dispatch(fetchSalesThunk({ page: 1, limit: 5 }));

    getFilteredSummaryApi("today")
      .then((res) => setTodaySales(res.data?.data?.sales ?? 0))
      .catch(() => setTodaySales(0));
  }, [dispatch]);

  // Load filtered analytics and summary
  useEffect(() => {
    if (filter) {
      dispatch(fetchMonthlyAnalytics(filter));
      dispatch(fetchFilteredSummary(filter));
    }
  }, [dispatch, filter]);

  // Chart data
  const labels = monthlyAnalytics?.labels || [];
  const salesSeries = monthlyAnalytics?.sales || [];

  return (
    <div>
      <Helmet>
        <title>Dashboard Overview - FancyStore</title>
        <meta
          name="description"
          content="View analytics, sales performance, stock status and reorder alerts in FancyStore admin dashboard."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Overview of sales, performance &amp; inventory
          </p>
        </div>
        <DateFilter />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Sales Today"
          value={todaySales === null ? "…" : fmtRs(todaySales)}
          icon={BanknotesIcon}
          tone="neutral"
        />
        <StatCard
          label="Total Revenue"
          value={fmtRs(summary?.sales)}
          icon={CurrencyDollarIcon}
          tone="positive"
        />
        <StatCard
          label="Total Products"
          value={totalProducts.toLocaleString()}
          icon={CubeIcon}
          tone="neutral"
        />
        <StatCard
          label="Low Stock Items"
          value={lowStock.length}
          icon={ExclamationTriangleIcon}
          tone={lowStock.length > 0 ? "negative" : "positive"}
        />
      </div>

      {/* Summary Cards */}
      <div className="mb-6">
        <SummaryCards summary={summary} />
      </div>

      {/* Filtered Summary Cards */}
      <div className="mb-6">
        <FilteredSummaryCards />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Donut Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Sales Distribution
          </h2>
          <DonutChart summary={chartSummary} />
        </div>

        {/* HeartBeat Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            Monthly Performance
          </h2>
          <HeartBeatChart labels={labels} sales={salesSeries} />
        </div>

        {/* Bar Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Sales Trend
          </h2>
          <BarChart />
        </div>
      </div>

      {/* Inventory Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 md:p-6">
          <LowStockTable items={lowStock} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 md:p-6">
          <ReorderAlerts items={reorderAlerts} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5 md:p-6 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800">Recent Transactions</h2>
          <Link to="/sales/list" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View all
          </Link>
        </div>

        {recentSales.length === 0 ? (
          <p className="text-slate-500 text-sm">No sales yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-2 font-medium">Invoice #</th>
                  <th className="py-2 pr-2 font-medium">Customer</th>
                  <th className="py-2 pr-2 font-medium">Date</th>
                  <th className="py-2 pr-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentSales.slice(0, 5).map((sale) => (
                  <tr key={sale._id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                    <td className="py-2.5 pr-2">
                      <Link to={`/sales/view/${sale._id}`} className="text-indigo-600 hover:underline font-medium">
                        {sale.invoiceNo}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-2 text-slate-700">{sale.customer?.name || "—"}</td>
                    <td className="py-2.5 pr-2 text-slate-500">
                      {new Date(sale.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="py-2.5 pr-2 text-right font-semibold tabular-nums text-slate-900">
                      {fmtRs(sale.grandTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

Dashboard.pageName = "ViewDashboard";

export default Dashboard;
