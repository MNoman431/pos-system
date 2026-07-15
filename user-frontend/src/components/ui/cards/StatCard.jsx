// src/components/ui/cards/StatCard.jsx
import React from "react";

const toneStyles = {
  neutral: { chip: "bg-indigo-50 text-indigo-600", value: "text-slate-900" },
  positive: { chip: "bg-emerald-50 text-emerald-600", value: "text-emerald-600" },
  negative: { chip: "bg-red-50 text-red-600", value: "text-red-600" },
};

const StatCard = ({ label, value, icon: Icon, tone = "neutral" }) => {
  const styles = toneStyles[tone] || toneStyles.neutral;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={`mt-2 text-2xl font-bold tabular-nums ${styles.value}`}>{value}</p>
        </div>
        {Icon && (
          <div className={`rounded-xl p-2.5 ${styles.chip}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
