import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  getBalance,
  getSummaryByCategory,
  getMonthlySummary,
  getByDateRange,
} from "./report.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/balance", getBalance);
router.get("/by-category", getSummaryByCategory);
router.get("/monthly", getMonthlySummary);
router.get("/range", getByDateRange);

export default router;
