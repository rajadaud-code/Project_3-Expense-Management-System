-- AI Expense Tracker — Postgres schema (Neon)

-- Users table: stores account information for each user
CREATE TABLE users (
    id SERIAL PRIMARY KEY,                 -- Auto-incrementing unique ID for each user
    name VARCHAR(100) NOT NULL,            -- User's name (required)
    email VARCHAR(255) UNIQUE NOT NULL,    -- User's email (must be unique, required)
    password_hash VARCHAR(255) NOT NULL,   -- Hashed password for authentication
    currency VARCHAR(3) DEFAULT 'USD',     -- Preferred currency (default is USD, e.g., PKR, EUR)
    created_at TIMESTAMPTZ DEFAULT NOW()   -- Timestamp when the user was created
);



-- Categories table: defines expense/income categories for each user
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,                 -- Auto-incrementing unique ID for each category
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Links category to a specific user; if the user is deleted, their categories are deleted too

    name VARCHAR(50) NOT NULL,             -- Category name (e.g., Food, Salary)
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    -- Defines whether the category is for income or expense, restricted to these two values

    icon VARCHAR(50),                      -- Optional icon name for UI representation
    color VARCHAR(7),                      -- Optional color code (e.g., #FF5733)
    is_default BOOLEAN DEFAULT FALSE,      -- Marks if this is a default category
    created_at TIMESTAMPTZ DEFAULT NOW(),  -- Timestamp when the category was created

    UNIQUE (user_id, name, type)           -- Prevents duplicate category names of the same type for one user
);



-- Transactions table: records all income and expense entries for each user
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,                           -- Auto-incrementing unique ID for each transaction
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Links transaction to a specific user; if the user is deleted, their transactions are deleted too

    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    -- Links transaction to a category; if the category is deleted, the reference becomes NULL (transaction remains)

    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    -- Transaction amount with 2 decimal places, must be greater than 0

    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    -- Defines whether the transaction is income or expense, restricted to these two values

    description VARCHAR(255),                        -- Short description of the transaction (optional)
    notes TEXT,                                      -- Longer notes/details (optional)
    transaction_date DATE NOT NULL,                  -- The actual date of the transaction
    created_at TIMESTAMPTZ DEFAULT NOW()             -- Timestamp when the record was created
);


-- Index to quickly query transactions by user and date (descending order for recent first)
CREATE INDEX idx_txn_user_date ON transactions(user_id, transaction_date DESC);

-- Index to quickly query transactions by category
CREATE INDEX idx_txn_category ON transactions(category_id);




-- Budgets table: allows users to set spending limits for categories
CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,                           -- Auto-incrementing unique ID for each budget
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Links budget to a specific user; if the user is deleted, their budgets are deleted too

    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    -- Links budget to a category; if the category is deleted, the budget is deleted too

    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    -- Budget amount with 2 decimal places, must be greater than 0

    period VARCHAR(10) NOT NULL DEFAULT 'monthly' CHECK (period IN ('monthly', 'weekly')),
    -- Defines the budget period, restricted to 'monthly' or 'weekly', default is 'monthly'

    start_date DATE NOT NULL,                        -- When the budget period starts
    created_at TIMESTAMPTZ DEFAULT NOW(),            -- Timestamp when the budget record was created

    UNIQUE (user_id, category_id, period)
    -- Prevents duplicate budgets for the same user, category, and period combination
);



-- AI Insights table: stores AI-generated insights for each user

CREATE TABLE ai_insights (
    id SERIAL PRIMARY KEY,                           -- Auto-incrementing unique ID for each insight
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Links insight to a specific user; if the user is deleted, their insights are deleted too

    insight_type VARCHAR(50) NOT NULL,               -- Type of insight (e.g., spending pattern, savings tip)
    period_start DATE,                               -- Start date of the period the insight covers (optional)
    period_end DATE,                                 -- End date of the period the insight covers (optional)

    content_json JSONB NOT NULL,                     -- Stores the actual AI insight in JSON format (flexible structure)
    created_at TIMESTAMPTZ DEFAULT NOW()             -- Timestamp when the insight was generated
);

-- Index to quickly query insights by user and creation time (latest insights first)
CREATE INDEX idx_insights_user_created ON ai_insights(user_id, created_at DESC);
