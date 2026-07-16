

import React from "react";
import { useSelector } from "react-redux";
import { CalendarDaysIcon, ReceiptPercentIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import StatCard from "../ui/cards/StatCard";

// Format Rs currency
const formatRs = (v, opts = {}) => {
  if (v === null || v === undefined || isNaN(Number(v))) return "—";
  const { showSign = false } = opts;
  const num = Number(v);
  const sign = showSign && num > 0 ? "+" : "";
  return `${sign}Rs ${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Capitalize filter label
const pretty = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "Filtered");

export default function FilteredSummaryCards() {
  const { loading, data, filter } =
    useSelector((s) => s.dashboard.filteredSummary) || {};

  // Loader skeleton
  if (loading || !data) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800" />
        ))}
      </div>
    );
  }

  const label = pretty(filter);

  // ✅ Only REAL KPIs
  const sales = Number(data?.sales || 0);
  const cogs = Number(data?.cogs || 0);
  const profit = Number(data?.grossProfit || 0);

  const profitTone = profit < 0 ? "negative" : profit > 0 ? "positive" : "neutral";

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <StatCard label={`Sales (${label})`} value={formatRs(sales)} icon={CalendarDaysIcon} tone="neutral" />
      <StatCard label={`Cost (${label})`} value={formatRs(cogs)} icon={ReceiptPercentIcon} tone="neutral" />
      <StatCard
        label={`Profit (${label})`}
        value={formatRs(profit, { showSign: true })}
        icon={ArrowTrendingUpIcon}
        tone={profitTone}
      />
    </div>
  );
}
