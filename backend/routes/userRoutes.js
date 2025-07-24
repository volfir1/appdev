const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../utils/middleware'); // Assuming this is your authentication middleware


// Get all users
router.get('/all', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/:id', authenticate, userController.updateUser);

// Soft delete user
router.delete('/:id', authenticate, userController.softDeleteUser);

//Recover soft-deleted user
router.patch('/recover/:id', authenticate, userController.recoverUser);

module.exports = router;