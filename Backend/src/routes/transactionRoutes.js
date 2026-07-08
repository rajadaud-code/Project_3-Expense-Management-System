import express from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  getTransactionById,
  deleteTransaction,
  analyzeTransactions,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect); // Apply authentication middleware to all routes

router.get("/", getTransactions);
router.post("/", createTransaction);
router.post("/analyze", analyzeTransactions);
router.get("/:id", getTransactionById);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
