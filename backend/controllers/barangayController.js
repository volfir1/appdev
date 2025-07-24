const Barangay = require('../models/Barangay');

// Create a new barangay
exports.createBarangay = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Barangay name is required' });

    // Prevent duplicates
    const exists = await Barangay.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Barangay already exists' });

    const barangay = new Barangay({ name });
    await barangay.save();

    res.status(201).json(barangay);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all barangays
exports.getBarangays = async (req, res) => {
  try {
    const barangays = await Barangay.find();
    res.json(barangays);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single barangay by ID
exports.getBarangayById = async (req, res) => {
  try {
    const barangay = await Barangay.findById(req.params.id);
    if (!barangay) return res.status(404).json({ message: 'Barangay not found' });
    res.json(barangay);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a barangay
exports.updateBarangay = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'New barangay name is required' });

    // Prevent duplicates on update
    const exists = await Barangay.findOne({ name, _id: { $ne: req.params.id } });
    if (exists) return res.status(400).json({ message: 'Barangay name already exists' });

    const barangay = await Barangay.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!barangay) return res.status(404).json({ message: 'Barangay not found' });

    res.json(barangay);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a barangay
exports.deleteBarangay = async (req, res) => {
  try {
    const barangay = await Barangay.findByIdAndDelete(req.params.id);
    if (!barangay) return res.status(404).json({ message: 'Barangay not found' });
    res.json({ message: 'Barangay deleted', barangay });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Geospatial summary for all barangays
exports.getBarangayGeospatialSummary = async (req, res) => {
  try {
    // Get all barangays with location
    const barangays = await Barangay.find();
    // Aggregate household stats per barangay
    const Household = require('../models/Household');
    const stats = await Household.aggregate([
      { $match: { deleted: false } },
      { $group: {
        _id: "$barangay",
        totalHouseholds: { $sum: 1 },
        avgIncome: { $avg: "$familyIncome" },
        avgPovertyScore: { $avg: "$povertyScore" },
        highRisk: { $sum: { $cond: [{ $eq: ["$riskLevel", "High"] }, 1, 0] } },
        moderateRisk: { $sum: { $cond: [{ $eq: ["$riskLevel", "Moderate"] }, 1, 0] } },
        lowRisk: { $sum: { $cond: [{ $eq: ["$riskLevel", "Low"] }, 1, 0] } },
      }}
    ]);
    // Map stats to barangays
    const result = barangays.map(b => {
      const stat = stats.find(s => String(s._id) === String(b._id));
      return {
        _id: b._id,
        name: b.name,
        location: b.location,
        totalHouseholds: stat ? stat.totalHouseholds : 0,
        avgIncome: stat ? stat.avgIncome : 0,
        avgPovertyScore: stat ? stat.avgPovertyScore : 0,
        highRisk: stat ? stat.highRisk : 0,
        moderateRisk: stat ? stat.moderateRisk : 0,
        lowRisk: stat ? stat.lowRisk : 0,
      };
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Geospatial summary error', error: error.message });
  }
};
