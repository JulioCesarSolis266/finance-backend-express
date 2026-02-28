import reportService from "./report.service.js";

export const getBalance = async (req, res) => {
  const data = await reportService.getBalance(req.user.id);
  return res.status(200).json(data);
};

export const getSummaryByCategory = async (req, res) => {
  const data = await reportService.getSummaryByCategory(req.user.id);
  return res.status(200).json(data);
};

export const getMonthlySummary = async (req, res) => {
  const data = await reportService.getMonthlySummary(req.user.id);
  return res.status(200).json(data);
};

export const getByDateRange = async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: "Fechas requeridas" });
  }

  const data = await reportService.getByDateRange(
    req.user.id,
    new Date(start),
    new Date(end),
  );

  return res.status(200).json(data);
};
