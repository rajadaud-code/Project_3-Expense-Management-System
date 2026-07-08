import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply JWT protection middleware to all category routes
router.use(protect);

// Category CRUD routes
router.get("/", getCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
