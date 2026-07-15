import Sale from "../models/sale.model.js";
import Purchase from "../models/purchase.model.js";
import InventoryItem from "../models/inventory.model.js";

/* =========================================================
   🔹 LOCAL DAY RANGE (FIXED TIMEZONE)
========================================================= */
const getLocalDayRange = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

/* =========================================================
   🔹 FILTER RANGE (ALL LOCAL - FIXED)
========================================================= */
const getFilterRange = (filter = "monthly") => {
  const now = new Date();
  let startDate, endDate;

  if (filter === "today") {
    ({ start: startDate, end: endDate } = getLocalDayRange(now));
  } 
  else if (filter === "weekly") {
    const day = now.getDay(); // local
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - day);

    ({ start: startDate } = getLocalDayRange(sunday));

    endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  } 
  else if (filter === "yearly") {
    startDate = new Date(now.getFullYear(), 0, 1);
    endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  } 
  else {
    // monthly
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
  }

  return { startDate, endDate };
};

/* =========================================================
   🔹 AGGREGATE SUMMARY
========================================================= */
const aggregateSummary = async (matchWindow = {}) => {
  const matchStage = Object.keys(matchWindow).length
    ? [{ $match: matchWindow }]
    : [];

  const [salesAgg, cogsAgg, purchaseAgg] = await Promise.all([
    Sale.aggregate([
      ...matchStage,
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]),
    Sale.aggregate([
      ...matchStage,
      {
        $group: {
          _id: null,
          total: { $sum: { $ifNull: ["$cogsTotal", 0] } },
        },
      },
    ]),
    Purchase.aggregate([
      ...matchStage,
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]),
  ]);

  const sales = salesAgg?.[0]?.total || 0;
  const cogs = cogsAgg?.[0]?.total || 0;
  const purchases = purchaseAgg?.[0]?.total || 0;

  return {
    sales,
    purchases,
    cogs,
    grossProfit: sales - cogs,
    netCashImpact: sales - purchases,
    cost: purchases,
    profit: sales - purchases,
  };
};

/* =========================================================
   🔹 SERVICE: ALL TIME SUMMARY
========================================================= */
export const getDashboardSummaryService = async () => {
  return await aggregateSummary();
};

/* =========================================================
   🔹 SERVICE: FILTERED SUMMARY
========================================================= */
export const getFilteredSummaryService = async (filter) => {
  const { startDate, endDate } = getFilterRange(filter);

  const matchWindow = {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };

  const data = await aggregateSummary(matchWindow);

  return {
    data,
    filter,
    startDate,
    endDate,
  };
};

/* =========================================================
   🔹 SERVICE: MONTHLY ANALYTICS
========================================================= */
export const getMonthlyAnalyticsService = async (filter) => {
  const { startDate, endDate } = getFilterRange(filter);

  const salesAgg = await Sale.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
        total: { $sum: "$grandTotal" },
      },
    },
  ]);

  const purchasesAgg = await Purchase.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
        total: { $sum: "$grandTotal" },
      },
    },
  ]);

  const map = new Map();
  const key = (y, m) => `${y}-${String(m).padStart(2, "0")}`;

  salesAgg.forEach((s) => {
    const k = key(s._id.y, s._id.m);
    map.set(k, { label: k, sales: s.total, purchases: 0 });
  });

  purchasesAgg.forEach((p) => {
    const k = key(p._id.y, p._id.m);
    if (map.has(k)) {
      map.set(k, { ...map.get(k), purchases: p.total });
    } else {
      map.set(k, { label: k, sales: 0, purchases: p.total });
    }
  });

  // fill missing months
  let current = new Date(startDate);
  while (current <= endDate) {
    const y = current.getFullYear();
    const m = current.getMonth() + 1;
    const k = key(y, m);

    if (!map.has(k)) {
      map.set(k, { label: k, sales: 0, purchases: 0 });
    }

    current.setMonth(current.getMonth() + 1);
  }

  const rows = Array.from(map.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  return {
    labels: rows.map((r) => r.label),
    sales: rows.map((r) => r.sales),
    purchases: rows.map((r) => r.purchases),
  };
};

/* =========================================================
   🔹 SERVICE: LOW STOCK
========================================================= */
export const getLowStockItemsService = async (threshold = 5) => {
  return await InventoryItem.find({ stockQty: { $lte: threshold } });
};

/* =========================================================
   🔹 SERVICE: REORDER ALERTS
========================================================= */
export const getReorderAlertsService = async (threshold = 2) => {
  return await InventoryItem.find({ stockQty: { $lte: threshold } });
};