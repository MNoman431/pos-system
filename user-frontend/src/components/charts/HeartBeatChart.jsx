// import React, { useMemo } from "react";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   LineElement,
//   PointElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
//   Filler,
// } from "chart.js";

// ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

// const HeartBeatChart = ({ labels = [], sales = [], purchases = [] }) => {
//   // Empty state guard
//   if (!labels.length) {
//     return (
//       <div className="bg-white p-5 rounded-xl shadow border h-96 flex items-center justify-center text-gray-500">
//         No data for this period.
//       </div>
//     );
//   }

//   const data = useMemo(
//     () => ({
//       labels,
//       datasets: [
//         {
//           label: "Sales",
//           data: sales,
//           borderColor: "rgba(59,130,246,1)",      // blue-500
//           backgroundColor: "rgba(59,130,246,0.15)",
//           borderWidth: 2,
//           tension: 0.35,
//           pointRadius: 2,
//           pointHoverRadius: 4,
//           fill: true,
//         },
//         {
//           label: "Purchases",
//           data: purchases,
//           borderColor: "rgba(16,185,129,1)",      // emerald-500
//           backgroundColor: "rgba(16,185,129,0.15)",
//           borderWidth: 2,
//           tension: 0.35,
//           pointRadius: 2,
//           pointHoverRadius: 4,
//           fill: true,
//         },
//       ],
//     }),
//     [labels, sales, purchases]
//   );

//   const options = useMemo(
//     () => ({
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: { position: "top", labels: { usePointStyle: true } },
//         tooltip: {
//           mode: "index",
//           intersect: false,
//           callbacks: {
//             label: (ctx) => {
//               const v = Number(ctx.parsed.y || 0);
//               const val = v.toLocaleString(undefined, {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//               });
//               return ` ${ctx.dataset.label}: Rs ${val}`;
//             },
//           },
//         },
//       },
//       interaction: { mode: "nearest", axis: "x", intersect: false },
//       scales: {
//         x: { grid: { display: false } },
//         y: {
//           beginAtZero: true,
//           ticks: {
//             callback: (v) =>
//               `Rs ${Number(v).toLocaleString(undefined, {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//               })}`,
//           },
//         },
//       },
//     }),
//     []
//   );

//   return (
//     <div className="bg-white p-5 rounded-xl shadow border h-96">
//       <h2 className="font-bold mb-3">Sales & Purchases Trend</h2>
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// export default HeartBeatChart;

import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

const HeartBeatChart = ({ labels = [], sales = [] }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!labels.length) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
        No data for this period.
      </div>
    );
  }

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Sales",
          data: sales,
          borderColor: "rgba(239,68,68,1)",      // red
          backgroundColor: "rgba(239,68,68,0.12)",
          borderWidth: 2,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: true,
        }
      ],
    }),
    [labels, sales]
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top", labels: { usePointStyle: true, color: isDark ? "#94a3b8" : "#475569" } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = Number(ctx.parsed.y || 0);
              return ` Sales: Rs ${v.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: isDark ? "#94a3b8" : "#475569" },
        },
        y: {
          beginAtZero: true,
          grid: { color: isDark ? "#1e293b" : "#e2e8f0" },
          ticks: {
            color: isDark ? "#94a3b8" : "#475569",
            callback: (v) =>
              `Rs ${Number(v).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`,
          },
        },
      },
    }),
    [isDark]
  );

  return (
    <div className="h-80">
      <Line data={data} options={options} />
    </div>
  );
};

export default HeartBeatChart;