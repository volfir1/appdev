const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema({
  household: { type: mongoose.Schema.Types.ObjectId, ref: 'Household', required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who made the referral
  status: { type: String, enum: ['pending', 'approved', 'completed', 'cancelled', 'rejected'], default: 'pending' },
  notes: String,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Who approved the referral
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Referral', ReferralSchema);
