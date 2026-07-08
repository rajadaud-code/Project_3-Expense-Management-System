// Import Node.js built-in modules
import fs from 'fs/promises';          // File system module (promise-based) for reading/writing files
import path from 'path';               // Path module for handling file and directory paths
import { fileURLToPath } from 'url';   // Converts file URLs to file paths

// Import the database connection pool from your local db.js file
import pool from '../db/db.js';

// Get the current file name and directory name (ESM equivalent of __filename and __dirname)
const __filename = fileURLToPath(import.meta.url);   // Absolute path of the current file
const __dirname = path.dirname(__filename);          // Directory containing the current file

// SQL string to drop all tables if they exist
// CASCADE ensures that dependent objects (like foreign keys) are also dropped
const DROP_ALL = `
DROP TABLE IF EXISTS ai_insights CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;
`;

// Define an async function to handle database migrations
const runMigration = async () => {
  // Check if the '--reset' flag was passed when running the script
  // Example: `node migrate.js --reset`
  const shouldReset = process.argv.includes('--reset');

  // Build the path to the schema.sql file inside the sql folder
  const schemaPath = path.join(__dirname, '..', 'sql', 'schema.sql');

  try {
    // If reset flag is present, drop all existing tables first
    if (shouldReset) {
      console.log('Dropping existing tables...');
      await pool.query(DROP_ALL); // Executes the DROP_ALL SQL string
    }

    // Read the schema.sql file contents
    console.log(`Reading schema from ${schemaPath}`);
    const schema = await fs.readFile(schemaPath, 'utf-8');

    // Run the migration by executing the schema SQL
    console.log('Running migration...');
    await pool.query(schema);

    // Success message
    console.log('Migration complete. Tables created.');
  } catch (error) {
    // Handle errors gracefully
    console.error('Migration failed:', error);
    process.exitCode = 1; // Exit with error code
  } finally {
    // Close the database connection pool
    await pool.end();
  }
};

// Execute the migration function
runMigration();
