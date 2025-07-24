const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../utils/middleware');

// Public routes
router.post('/login', authController.login);
router.post('/register', authController.register);

// Protected route (requires token)
router.get('/profile', authMiddleware, authController.profile);

module.exports = router;