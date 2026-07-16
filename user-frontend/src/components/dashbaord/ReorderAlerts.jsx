import React from "react";
import { Link } from "react-router-dom";

const ReorderAlerts = ({ items = [], thresholdUsed }) => {
  const sorted = (Array.isArray(items) ? [...items] : []).sort(
    (a, b) => Number(a?.stockQty || 0) - Number(b?.stockQty || 0)
  );

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 mb-3">Reorder Alerts</h2>
      </div>

      {(!sorted || sorted.length === 0) ? (
        <p className="text-slate-500 dark:text-slate-400">No items need reorder.</p>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {sorted.map((i) => {
            const isZero = Number(i?.stockQty || 0) === 0;
            return (
              <div key={i._id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {i.name}{" "}
                    <span className="text-slate-400 dark:text-slate-500 font-normal">({i.itemCode || "—"})</span>
                  </p>
                  <p className={`text-sm ${isZero ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
                    Stock left: {i.stockQty}
                    {isZero && (
                      <span className="ml-2 inline-block text-xs bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 px-2 py-0.5 rounded-full">
                        Out of stock
                      </span>
                    )}
                  </p>
                </div>

                <Link
                  to={`/purchase/new?itemId=${i._id}&itemCode=${i.itemCode}&suggestedQty=${Math.max(1, i.reorderQty || 1)}`}
                  className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm shrink-0"
                >
                  Reorder now
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReorderAlerts;