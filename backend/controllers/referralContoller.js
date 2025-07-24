const Referral = require('../models/Referrals');
const Household = require('../models/Household');
const Program = require('../models/Programs');
const User = require('../models/User');

// Create a new referral
exports.createReferral = async (req, res) => {
  try {
    const { household, program, user, notes } = req.body;
    if (!household || !program || !user) {
      return res.status(400).json({ message: 'household, program, and user are required' });
    }

    const householdExists = await Household.findById(household);
    const programExists = await Program.findById(program);
    const userExists = await User.findById(user);

    if (!householdExists || !programExists || !userExists) {
      return res.status(400).json({ message: 'Invalid household, program, or user ID' });
    }

    const referral = new Referral({ household, program, user, notes });
    await referral.save();
    res.status(201).json(referral);
  } catch (error) {
    res.status(500).json({ message: 'Create referral error', error: error.message });
  }
};

// Get all referrals
exports.getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find()
      .populate({
        path: 'household',
        populate: { path: 'barangay', select: 'name' }
      })
      .populate('program')
      .populate('user')
      .populate('approvedBy')
      .sort({ createdAt: -1 });
    res.status(200).json(referrals);
  } catch (error) {
    res.status(500).json({ message: 'Get referrals error', error: error.message });
  }
};

// Get a single referral by ID
exports.getReferralById = async (req, res) => {
  try {
    const referral = await Referral.findById(req.params.id)
      .populate('household')
      .populate('program')
      .populate('user');
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }
    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({ message: 'Get referral error', error: error.message });
  }
};

// Update a referral (status, notes)
exports.updateReferral = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const updateFields = {};
    if (status) updateFields.status = status;
    if (notes) updateFields.notes = notes;

    // If approving or completing, record the user who approved
    if ((status === 'approved' || status === 'completed') && req.user && req.user.userId) {
      updateFields.approvedBy = req.user.userId;
    }

    const referral = await Referral.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate('household')
      .populate('program')
      .populate('user')
      .populate('approvedBy');

    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }
    res.status(200).json(referral);
  } catch (error) {
    res.status(500).json({ message: 'Update referral error', error: error.message });
  }
};

// Delete a referral (role-based access)
exports.deleteReferral = async (req, res) => {
  try {
    // Only allow admin or ngo_staff to delete referrals
    const userRole = req.user?.role;
    if (userRole !== 'admin' && userRole !== 'ngo_staff') {
      return res.status(403).json({ message: 'You do not have permission to delete referrals.' });
    }
    const referral = await Referral.findByIdAndDelete(req.params.id);
    if (!referral) {
      return res.status(404).json({ message: 'Referral not found' });
    }
    res.status(200).json({ message: 'Referral deleted', referral });
  } catch (error) {
    res.status(500).json({ message: 'Delete referral error', error: error.message });
  }
};