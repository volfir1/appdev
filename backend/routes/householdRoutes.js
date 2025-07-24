const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/middleware'); // <-- Import middleware directly
const {
  getHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  softDeleteHousehold, // <-- use softDeleteHousehold if that's your delete function
  getHouseholdsByRiskLevel,
  uploadHouseholdsCSV,
  recoverHousehold,
  deleteAllHouseholds
} = require('../controllers/householdController');
// Permanently delete all households (admin only)
router.delete('/delete/all', authMiddleware, deleteAllHouseholds);
const multer = require('multer');
const upload = multer();

// Routes
router.get('/risk', authMiddleware, getHouseholdsByRiskLevel);
router.get('/', authMiddleware, getHouseholds);
router.get('/:id', authMiddleware, getHouseholdById);
router.post('/', authMiddleware, createHousehold);
router.put('/:id', authMiddleware, updateHousehold);
router.delete('/:id', authMiddleware, softDeleteHousehold);
router.post('/upload', authMiddleware, upload.single('file'), uploadHouseholdsCSV);
router.patch('/:id/recover', authMiddleware, recoverHousehold);
module.exports = router;
