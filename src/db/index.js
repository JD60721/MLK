const { Pool } = require('pg');
require('dotenv').config();

// Determine database configuration method
let poolConfig;

if (process.env.DATABASE_URL) {
  // Use connection string if provided
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
} else {
  // Otherwise, use individual parameters
  poolConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
}

const pool = new Pool(poolConfig);

// Event listener for idle clients
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

module.exports = {
  pool,
  /**
   * Helper query function to automatically acquire a client,
   * execute the query, and release the client back to the pool.
   * @param {string} text - SQL query text
   * @param {any[]} params - query parameters
   * @returns {Promise<import('pg').QueryResult>}
   */
  query: (text, params) => pool.query(text, params)
};
