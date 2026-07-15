// import React from "react";
// import { Doughnut } from "react-chartjs-2";
// import { useSelector } from "react-redux";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const formatRs = (v) =>
//   `Rs ${Number(v || 0).toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`;

// const DonutChart = ({ summary: summaryProp }) => {
//   const reduxSummary = useSelector((s) => s.dashboard?.summary || {});
//   const summary = summaryProp || reduxSummary;

//   const sales = Number(summary?.sales || 0);
//   const purchases = Number(summary?.purchases || 0);

//   if (sales <= 0 && purchases <= 0) {
//     return (
//       <div className="bg-white p-5 shadow rounded-xl border h-80 flex items-center justify-center text-gray-500">
//         No data available.
//       </div>
//     );
//   }

//   const data = {
//     labels: ["Sales", "Purchases"],
//     datasets: [
//       {
//         data: [sales, purchases],
//         backgroundColor: ["#22c55e", "#ef4444"], // green-500, red-500
//         borderWidth: 0.5,
//         hoverOffset: 6,
//       },
//     ],
//   };

//   const options = {
//     plugins: {
//       legend: { position: "bottom", labels: { usePointStyle: true } },
//       tooltip: {
//         callbacks: {
//           label: (ctx) => {
//             const v = Number(ctx.parsed || 0);
//             return `${ctx.label}: ${formatRs(v)}`;
//           },
//         },
//       },
//     },
//     cutout: "60%",
//   };

//   return (
//     <div className="bg-white p-5 shadow rounded-xl border">
//       <h2 className="font-bold mb-3">Sales vs Purchases</h2>
//       <div className="h-80">
//         <Doughnut data={data} options={options} />
//       </div>
//       <p className="text-xs text-gray-400 mt-2">
//         Purchases show cash spent to add stock; profit uses COGS, not purchases.
//       </p>
//     </div>
//   );
// };

// export default DonutChart;


import React from "react";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const formatRs = (v) =>
  `Rs ${Number(v || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const DonutChart = ({ summary: override }) => {
  const reduxSummary = useSelector((s) => s.dashboard?.summary || {});
  const summary = override || reduxSummary;

  const sales = Number(summary?.sales || 0);
  const cost = Number(summary?.cogs || 0);
  const profit = Number(summary?.grossProfit || 0);

  // If there's no meaningful data
  if (sales <= 0 && cost <= 0 && profit <= 0) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-500 text-sm">
        No data available.
      </div>
    );
  }

  const data = {
    labels: ["Sales", "Cost", "Profit"],
    datasets: [
      {
        data: [sales, cost, profit],
        backgroundColor: ["#4f46e5", "#ef4444", "#10b981"], // indigo, red, emerald
        borderWidth: 1,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: "bottom", labels: { usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = Number(ctx.parsed || 0);
            return `${ctx.label}: ${formatRs(v)}`;
          },
        },
      },
    },
    cutout: "60%",
  };

  return (
    <div className="h-80">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DonutChart;