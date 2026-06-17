require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
app.use(cors());

// Configure JSON Body Parsing
app.use(express.json());

// Basic Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve Static Files (Developer Dashboard)
app.use(express.static('public'));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fintech Backend API is active and running.',
    timestamp: new Date().toISOString()
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);

// Fallback Route for Undefined Enpoints (404)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.url}`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Global Error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred on the server.'
  });
});

// Start server and verify Database connection
const server = app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
  
  // Verify database connectivity
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Database connected successfully. Current timestamp:', result.rows[0].now);
  } catch (err) {
    console.warn('\n⚠️  WARNING: Database connection failed. Please ensure PostgreSQL is running and credentials in .env are correct.');
    console.warn(`Error Details: ${err.message}\n`);
  }
});

module.exports = { app, server };
