const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/middleware');
const {
  createReferral,
  getReferrals,
  getReferralById,
  updateReferral,
  deleteReferral
} = require('../controllers/referralContoller');

// Create a new referral (protected)
router.post('/', authMiddleware, createReferral);

// Get all referrals (protected)
router.get('/', authMiddleware, getReferrals);

// Get a single referral by ID (protected)
router.get('/:id', authMiddleware, getReferralById);

// Update a referral (protected)
router.put('/:id', authMiddleware, updateReferral);

// Delete a referral (protected)
router.delete('/:id', authMiddleware, deleteReferral);

module.exports = router;