const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected endpoint (Demonstration of authMiddleware protecting future routes)
router.get('/me', authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully.',
    data: {
      user: req.user
    }
  });
});

module.exports = router;
