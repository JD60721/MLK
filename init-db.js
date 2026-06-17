const { pool } = require('./src/db');

const initSql = `
-- Enable UUID extension for auto-generating UUID keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone TEXT,
    legal_id TEXT,
    legal_id_type TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    location TEXT,
    price_cop INTEGER NOT NULL,
    rating NUMERIC(3,2) DEFAULT 0.0,
    seller TEXT,
    image_url TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reference TEXT UNIQUE NOT NULL,
    items JSONB NOT NULL,
    amount_cents INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    wompi_txn_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reference TEXT UNIQUE NOT NULL,
    project TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    term_months INTEGER NOT NULL,
    annual_rate NUMERIC(5,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    wompi_txn_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    investment_id UUID REFERENCES investments(id) ON DELETE SET NULL,
    amount_cop INTEGER NOT NULL,
    bank TEXT NOT NULL,
    account_type TEXT NOT NULL,
    account_no TEXT NOT NULL,
    account_holder TEXT NOT NULL,
    holder_legal_id TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create wompi_events table
CREATE TABLE IF NOT EXISTS wompi_events (
    id SERIAL PRIMARY KEY,
    txn_id TEXT,
    reference TEXT,
    status TEXT,
    raw JSONB,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

async function initDatabase() {
  console.log('Initializing database tables...');
  try {
    await pool.query(initSql);
    console.log('Database tables successfully initialized or already exist!');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();
