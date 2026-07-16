import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../../context/ThemeContext";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChart = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { monthlyAnalytics } = useSelector((s) => s.dashboard || {});
  const labels = monthlyAnalytics?.labels || [];
  const sales = monthlyAnalytics?.sales || [];

  const data = useMemo(() => ({
    labels,
    datasets: [
      {
        label: "Sales",
        data: sales,
        backgroundColor: "rgba(16, 185, 129, 0.75)",
        borderRadius: 6,
        maxBarThickness: 28,
      },
    ],
  }), [labels, sales]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { usePointStyle: true, color: isDark ? "#94a3b8" : "#475569" } },
      tooltip: {
        callbacks: {
          label: (ctx) => `Sales: Rs ${Number(ctx.raw || 0).toLocaleString()}`
        }
      }
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
          callback: (v) => `Rs ${Number(v).toLocaleString()}`
        }
      }
    }
  }), [isDark]);

  return (
    <div className="h-80">
      {/* ✅ Force chart to remount to avoid hooks error */}
      <Bar key={labels.join("-")} data={data} options={options} />
    </div>
  );
};

export default BarChart;