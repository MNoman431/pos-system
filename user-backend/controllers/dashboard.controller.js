

import { getDashboardSummaryService, getFilteredSummaryService, getLowStockItemsService, getMonthlyAnalyticsService, getReorderAlertsService } from "../services/dashbaord.service.js";


export const getDashboardSummary = async (req, res) => {
  const data = await getDashboardSummaryService();
  res.json({ success: true, data });
};

export const getFilteredSummary = async (req, res) => {
  const { filter = "monthly" } = req.query;
  const result = await getFilteredSummaryService(filter);

  res.json({
    success: true,
    ...result,
  });
};

export const getMonthlyAnalytics = async (req, res) => {
  const { filter = "monthly" } = req.query;
  const data = await getMonthlyAnalyticsService(filter);

  res.json({ success: true, ...data });
};

export const getLowStockItems = async (req, res) => {
  const threshold = Number(req.query.threshold ?? 5);
  const items = await getLowStockItemsService(threshold);

  res.json({ success: true, items });
};

export const getReorderAlerts = async (req, res) => {
  const threshold = Number(req.query.threshold ?? 2);
  const items = await getReorderAlertsService(threshold);

  res.json({ success: true, items });
};