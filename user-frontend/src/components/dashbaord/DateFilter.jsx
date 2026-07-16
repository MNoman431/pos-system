import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMonthlyAnalytics,
  fetchFilteredSummary,
} from "../../redux/thunks/dashboardThunks/dashboardThunk.js";
import { setFilter } from "../../redux/slices/dashboardSlices/dashboardSlice.js";

const DateFilter = () => {
  const dispatch = useDispatch();
  const { filter, monthlyAnalytics, filteredSummary } = useSelector((s) => s.dashboard || {});
  const loading = monthlyAnalytics?.loading || filteredSummary?.loading;

  // Small debounce to avoid double-fetch if user scrolls quickly
  const debounce = (fn, delay = 150) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  const runFetches = useCallback(
    (value) => {
      // 1) set global filter
      dispatch(setFilter(value));
      // 2) fetch both analytics + filtered summary
      dispatch(fetchMonthlyAnalytics(value));
      dispatch(fetchFilteredSummary(value));
    },
    [dispatch]
  );

  const onChange = useMemo(() => debounce(runFetches, 150), [runFetches]);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="date-filter" className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Period
      </label>
      <select
        id="date-filter"
        className="border border-slate-300 px-3 py-2 rounded-lg shadow-sm bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:focus:border-indigo-400"
        value={filter}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        aria-busy={loading ? "true" : "false"}
        aria-label="Select dashboard period"
      >
        <option value="today">Today</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>
    </div>
  );
};

export default DateFilter;