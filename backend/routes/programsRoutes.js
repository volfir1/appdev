const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/middleware');
const {
  createProgram,
  getPrograms,
  getProgramById,
  updateProgram,
  deleteProgram
} = require('../controllers/programsController');

// Create a new program (protected)
router.post('/', authMiddleware, createProgram);

// Get all programs (protected)
router.get('/', authMiddleware, getPrograms);

// Get a single program by ID (protected)
router.get('/:id', authMiddleware, getProgramById);

// Update a program (protected)
router.put('/:id', authMiddleware, updateProgram);

// Delete a program (protected)
router.delete('/:id', authMiddleware, deleteProgram);

module.exports = router;