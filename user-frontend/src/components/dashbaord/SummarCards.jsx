
import React from "react";
import { BanknotesIcon, ReceiptPercentIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import StatCard from "../ui/cards/StatCard";

const SummaryCards = ({ summary = {} }) => {
  const fmt = (n) =>
    `Rs ${Number(n || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  //  Only the REAL metrics (as sir requested)
  const sales = summary.sales || 0;
  const cost = summary.cogs || 0;          // REAL COGS
  const profit = summary.grossProfit || 0; // REAL PROFIT

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard label="Total Sales" value={fmt(sales)} icon={BanknotesIcon} tone="neutral" />
      <StatCard label="Total Cost" value={fmt(cost)} icon={ReceiptPercentIcon} tone="neutral" />
      <StatCard
        label="Total Profit"
        value={fmt(profit)}
        icon={ChartBarIcon}
        tone={profit >= 0 ? "positive" : "negative"}
      />
    </div>
  );
};

export default SummaryCards;
