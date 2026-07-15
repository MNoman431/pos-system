import React from "react";
import { Link } from "react-router-dom";

const ReorderAlerts = ({ items = [], thresholdUsed }) => {
  const sorted = (Array.isArray(items) ? [...items] : []).sort(
    (a, b) => Number(a?.stockQty || 0) - Number(b?.stockQty || 0)
  );

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-bold text-slate-800 mb-3">Reorder Alerts</h2>
      </div>

      {(!sorted || sorted.length === 0) ? (
        <p className="text-slate-500">No items need reorder.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {sorted.map((i) => {
            const isZero = Number(i?.stockQty || 0) === 0;
            return (
              <div key={i._id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">
                    {i.name}{" "}
                    <span className="text-slate-400 font-normal">({i.itemCode || "—"})</span>
                  </p>
                  <p className={`text-sm ${isZero ? "text-red-600" : "text-amber-600"}`}>
                    Stock left: {i.stockQty}
                    {isZero && (
                      <span className="ml-2 inline-block text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Out of stock
                      </span>
                    )}
                  </p>
                </div>

                <Link
                  to={`/purchase/new?itemId=${i._id}&itemCode=${i.itemCode}&suggestedQty=${Math.max(1, i.reorderQty || 1)}`}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm shrink-0"
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