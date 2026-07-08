import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/authRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import transactionRoutes from "./src/routes/transactionRoutes.js";
import budgetRoutes from "./src/routes/budgetRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";
import insightRoutes from "./src/routes/insightRoutes.js";
import db from "./src/db/db.js";

dotenv.config();

const app = express();
const Port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Expense Management System API");
});

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

app.use("/api/auth", authRoutes); // Mount auth routes under /api/auth)
app.use("/api/categories", categoryRoutes); // Mount category routes under /api/categories
app.use("/api/transactions", transactionRoutes); // Mount transaction routes under /api/transactions
app.use("/api/budgets", budgetRoutes); // Mount budget routes under /api/budgets
app.use("/api/dashboard", dashboardRoutes); // Mount dashboard routes under /api/dashboard
app.use("/api/insights", insightRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
  });
}

export default app;
