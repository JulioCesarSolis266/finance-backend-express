import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  getTransactions,
  getOneTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "./transaction.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getTransactions);
router.get("/:id", getOneTransaction);
router.post("/", createTransaction);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
