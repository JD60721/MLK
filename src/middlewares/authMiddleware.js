const jwt = require('jsonwebtoken');

/**
 * Authentication middleware that verifies JWT from the request headers.
 */
module.exports = (req, res, next) => {
  // Retrieve the Authorization header
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization header provided.'
    });
  }

  // Check if header format is Bearer <token>
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Format must be "Bearer <token>".'
    });
  }

  const token = parts[1];

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_fintech_token_generation_key_2026';
    // Verify the token
    const decoded = jwt.verify(token, secret);
    
    // Attach decoded user information to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid or expired token.'
    });
  }
};
