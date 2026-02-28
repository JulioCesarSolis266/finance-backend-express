import { Router } from "express";

import { authMiddleware } from "../auth/auth.middleware.js";

import {
  getOneCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getCategories);
router.get("/:id", getOneCategory);
router.post("/", createCategory);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
