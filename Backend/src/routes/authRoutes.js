import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register); // User registration
router.post("/login", login); // User login

// Protected route (requires JWT)
router.get("/me", protect, getMe); // Get current user profile

export default router;
