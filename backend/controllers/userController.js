// Bulk assign barangay to all workers missing one
exports.bulkAssignBarangay = async (req, res) => {
  try {
    const { barangay } = req.body;
    if (!barangay) {
      return res.status(400).json({ error: 'Barangay ObjectId required' });
    }
    // Only admin can perform this
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can bulk assign barangay' });
    }
    // Find all workers missing barangay
    const result = await User.updateMany(
      { role: 'worker', $or: [{ barangay: { $exists: false } }, { barangay: null }] },
      { $set: { barangay } }
    );
    res.json({ message: 'Barangay assigned to all workers missing one', modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const mongoose = require('mongoose');
const User = require('../models/User');
const Barangay = require('../models/Barangay');


// Get all users (excluding soft-deleted)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('barangay');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, deleted: { $ne: true } }).populate('barangay');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user (role, email, etc.)
exports.updateUser = async (req, res) => {
  try {
    const { email, role, barangay } = req.body;

    // Only admin can change role or barangay
    if ((role || barangay) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can assign role or barangay' });
    }

    const updateFields = {};
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;

    // Fetch the existing user to check their current role if not being updated
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const targetRole = role || existingUser.role; // Use new role if provided, else existing role

    // Handle barangay assignment based on role
    if (barangay !== undefined) {
      if (targetRole === 'worker') {
        // Accept either ObjectId or name
        if (typeof barangay === 'string' && mongoose.Types.ObjectId.isValid(barangay)) {
          // If it's a valid ObjectId string
          updateFields.barangay = barangay;
        } else if (typeof barangay === 'string') {
          // If it's a name, look up the ObjectId
          const barangayDoc = await Barangay.findOne({ name: barangay });
          if (!barangayDoc) {
            return res.status(400).json({ error: 'Barangay not found' });
          }
          updateFields.barangay = barangayDoc._id;
        } else if (barangay === null) {
          // Workers cannot have null barangay
          return res.status(400).json({ error: 'Worker must be assigned to a barangay' });
        } else {
          return res.status(400).json({ error: 'Invalid barangay format' });
        }
      } else {
        // For admin/ngo_staff, allow clearing barangay by sending null
        updateFields.barangay = barangay;
      }
    } else if (targetRole === 'worker' && !existingUser.barangay) {
      // If no barangay is provided in the request AND the worker doesn't already have one,
      // then it's a bad request.
      return res.status(400).json({ error: 'Worker must be assigned to a barangay' });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, deleted: { $ne: true } },
      updateFields,
      { new: true }
    ).populate('barangay');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Soft delete user (set deleted: true)
exports.softDeleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, deleted: { $ne: true } },
      { deleted: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User soft deleted', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.recoverUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, deleted: true },
      { deleted: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found or not deleted' });
    res.json({ message: 'User recovered', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};