import dotenv from "dotenv";
// Import the 'pg' package (PostgreSQL client for Node.js)
import pkg from "pg";

dotenv.config();

// Extract Pool (connection pool manager) and types (for custom type parsing) from pg
const { Pool, types } = pkg;

// Configure how DATE columns (OID 1082) are parsed.
// By default, pg converts DATE to JavaScript Date objects (which apply UTC shift).
// This parser keeps them as plain 'YYYY-MM-DD' strings to avoid timezone issues.
types.setTypeParser(1082, (val) => val);

// Create a new connection pool to Postgres
const pool = new Pool({
  // DATABASE_URL should be defined in your .env file
  connectionString: process.env.DATABASE_URL,
  // SSL is required for Neon/Postgres cloud hosting; rejectUnauthorized:false allows self-signed certs
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  maxLifetimeSeconds: 60 * 10,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Event listener: runs when a connection is successfully established
pool.on("connect", () => {
  console.log("Connected to Neon Postgres");
});

// Event listener: catches unexpected errors from the pool
pool.on("error", (err) => {
  console.error("Unexpected Postgres error:", err);
});

// Export the pool so other files can import and use it for queries
export default pool;
