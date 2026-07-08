import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";
import { defaultCategories } from "../utils/default categories.js";

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

export const register = async (req, res) => {
  const { name, email, password, currency = "USD" } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  // Basic validation: required fields and password length
  if (!name || !normalizedEmail || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password are required" });
  }
  if (!isValidEmail(normalizedEmail)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  let client;
  let transactionStarted = false;
  try {
    client = await pool.connect();

    // Check if email already exists
    const existing = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail],
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    await client.query("BEGIN"); // Start transaction
    transactionStarted = true;
    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert new user into database and return basic info
    const userResult = await client.query(
      "INSERT INTO users (name, email, password_hash, currency) VALUES ($1, $2, $3, $4) RETURNING id, name, email, currency, created_at",
      [name, normalizedEmail, passwordHash, currency],
    );
    const user = userResult.rows[0];

    // Loop through default categories and insert them for the new user
    for (const cat of defaultCategories) {
      await client.query(
        "INSERT INTO categories (user_id, name, type, icon, color, is_default) VALUES ($1, $2, $3, $4, $5, true)",
        [user.id, cat.name, cat.type, cat.icon, cat.color],
      );
    }

    await client.query("COMMIT"); // Finalize transaction if everything succeeds
    transactionStarted = false;

    // Generate JWT token for the new user and return response
    const token = signToken(user.id);
    res.status(201).json({ user, token });
  } catch (error) {
    if (transactionStarted) {
      try {
        await client.query("ROLLBACK"); // Undo transaction if something fails
      } catch (rollbackError) {
        console.error("Register rollback error", rollbackError);
      }
    }
    console.error("Register error", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (client) {
      client.release(); // Release DB connection back to pool
    }
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  // Basic validation: both fields required
  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Look up user by email
    const result = await pool.query(
      "SELECT id, name, email, password_hash, currency FROM users WHERE email = $1",
      [normalizedEmail],
    );

    // If no user found, reject
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    // Compare provided password with stored hash
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token and return user info
    const token = signToken(user.id);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        currency: user.currency,
      },
      token,
    });
  } catch (error) {
    console.log("Login error", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    // Query user info based on the authenticated userId
    const result = await pool.query(
      "SELECT id, name, email, currency, created_at FROM users WHERE id = $1",
      [req.userId],
    );

    // If no user found, return 404
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data
    res.json(result.rows[0]);
  } catch (error) {
    // Handle unexpected errors
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
