import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardSummary,
  fetchFilteredSummary,
  fetchLowStockItems,
  fetchMonthlyAnalytics,
  fetchReorderAlerts,
} from "../../redux/thunks/dashboardThunks/dashboardThunk";

import DonutChart from "../../components/charts/DonutChart";
import HeartBeatChart from "../../components/charts/HeartBeatChart";
import LowStockTable from "../../components/dashbaord/LowStockTable";
import ReorderAlerts from "../../components/dashbaord/ReorderAlerts";
import DateFilter from "../../components/dashbaord/DateFilter";
import SummaryCards from "../../components/dashbaord/SummarCards";
import FilteredSummaryCards from "../../components/dashbaord/FilteredSummaryCards";
import BarChart from "../../components/charts/BarChart";
import { Helmet } from "react-helmet-async";

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

  // Decide which summary to use in Donut
  const chartSummary = filter ? filteredSummary?.data || {} : summary;

  // Initial Load
  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchLowStockItems());
    dispatch(fetchReorderAlerts());
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
    </div>
  );
};

Dashboard.pageName = "ViewDashboard";

export default Dashboard;
