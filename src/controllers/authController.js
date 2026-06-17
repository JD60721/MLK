const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const SALT_ROUNDS = 10;

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  const {
    full_name,
    email,
    password,
    phone,
    legal_id,
    legal_id_type,
    role
  } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  try {
    // Check if email already exists
    const userCheck = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    // Hash the password using bcrypt
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Save the user in the database
    const insertQuery = `
      INSERT INTO users (full_name, email, password_hash, phone, legal_id, legal_id_type, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, full_name, email, phone, legal_id, legal_id_type, role, created_at
    `;
    const values = [
      full_name || null,
      email.toLowerCase(),
      passwordHash,
      phone || null,
      legal_id || null,
      legal_id_type || null,
      role || 'user'
    ];

    const result = await db.query(insertQuery, values);
    const newUser = result.rows[0];

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: {
        user: newUser
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred during registration.'
    });
  }
};

/**
 * Log in an existing user
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.'
    });
  }

  try {
    // Find the user by email
    const queryResult = await db.query(
      'SELECT id, full_name, email, password_hash, role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (queryResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = queryResult.rows[0];

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Sign a JSON Web Token (JWT)
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    const secret = process.env.JWT_SECRET || 'super_secret_fintech_token_generation_key_2026';
    const options = {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    };

    const token = jwt.sign(payload, secret, options);

    // Return the response, excluding the password hash
    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred during login.'
    });
  }
};
