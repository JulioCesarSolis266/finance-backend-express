import reportService from "./report.service.js";
import { TransactionType } from "@prisma/client";

export const getBalance = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { from, to } = req.query;

    const isValidDate = (value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    };

    // Validar formato de fechas si fueron enviadas
    if ((from && !isValidDate(from)) || (to && !isValidDate(to))) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Validar coherencia del rango
    if (from && to && new Date(from) > new Date(to)) {
      return res.status(400).json({
        error: "'from' date cannot be greater than 'to' date",
      });
    }

    const data = await reportService.getBalance(userId, {
      from,
      to,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("getBalance error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSummaryByCategory = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { month } = req.query;

    let from;
    let to;

    if (month) {
      // Validar formato YYYY-MM
      const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

      if (!monthRegex.test(month)) {
        return res.status(400).json({
          error: "Invalid month format. Use YYYY-MM",
        });
      }

      const [year, m] = month.split("-").map(Number);

      // Construcción en UTC (clave para evitar problemas de timezone)
      from = new Date(Date.UTC(year, m - 1, 1, 0, 0, 0, 0));
      to = new Date(Date.UTC(year, m, 0, 23, 59, 59, 999));
    }

    const data = await reportService.getSummaryByCategory(userId, {
      from,
      to,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("getSummaryByCategory error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { type } = req.query;

    // Validar enum si se envía
    if (type && !Object.values(TransactionType).includes(type)) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }

    const data = await reportService.getMonthlySummary(userId, {
      type,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("getMonthlySummary error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getByDateRange = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: "Fechas requeridas" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ error: "Fechas inválidas" });
    }

    const data = await reportService.getByDateRange(userId, startDate, endDate);

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
