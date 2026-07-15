import React from "react";

const LowStockTable = ({ items = [], thresholdUsed }) => {
  const sorted = (Array.isArray(items) ? [...items] : []).sort(
    (a, b) => Number(a?.stockQty || 0) - Number(b?.stockQty || 0)
  );

  if (!sorted.length) {
    return (
      <div>
        <h2 className="font-bold text-slate-800 mb-1">Low Stock Items</h2>
        <p className="text-xs text-slate-500 mb-3">
          Threshold: {typeof thresholdUsed === "number" ? thresholdUsed : 5}
        </p>
        <p className="text-slate-500">All good! No low stock items.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-bold text-slate-800 mb-3">Low Stock Items</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-200">
              <th scope="col" className="py-2 pr-2 font-medium">Code</th>
              <th scope="col" className="py-2 pr-2 font-medium">Item</th>
              <th scope="col" className="py-2 pr-2 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((i) => {
              const crit = Number(i?.stockQty || 0) <= (thresholdUsed ?? 5);
              return (
                <tr key={i._id} className="border-t border-slate-100">
                  <td className="py-2.5 pr-2 text-slate-500">{i.itemCode || "—"}</td>
                  <td className="py-2.5 pr-2 text-slate-800">{i.name}</td>
                  <td className={`py-2.5 pr-2 tabular-nums ${crit ? "text-amber-600 font-semibold" : "text-slate-700"}`}>
                    {i.stockQty}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockTable;