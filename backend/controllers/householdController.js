// Permanently delete all households (admin only)
exports.deleteAllHouseholds = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete all households' });
    }
    const result = await Household.deleteMany({});
    res.status(200).json({ message: `Deleted ${result.deletedCount} households permanently.` });
  } catch (error) {
    res.status(500).json({ message: 'Delete all households error', error: error.message });
  }
};
const jwt = require('jsonwebtoken');
const Household = require('../models/Household');
const Barangay = require('../models/Barangay');
const csv = require('csv-parse');
const { Readable } = require('stream');

// Use shared JWT middleware
const authMiddleware = require('../utils/middleware');

// Parse CSV data (converts barangay to ObjectId)
const parseCSV = async (csvData) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(csvData);
    stream
      .pipe(
        csv.parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      )
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

// CSV Upload - Save with barangay ObjectId
exports.uploadHouseholdsCSV = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Access restricted to admins and workers' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const parsedRows = await parseCSV(req.file.buffer.toString());
    const savedHouseholds = [];
    // For admin: cache barangay names to ObjectId (case-insensitive)
    let barangayCache = {};
    // Preload all barangays (case-insensitive, trimmed)
    const allBarangays = await Barangay.find({});
    for (const b of allBarangays) {
      barangayCache[b.name.trim().toLowerCase()] = b;
    }
    // For worker: get assigned barangay
    let workerBarangay = null;
    if (req.user.role === 'worker') {
      if (!req.user.barangay) {
        return res.status(400).json({ message: 'Worker account has no assigned barangay' });
      }
      workerBarangay = await Barangay.findById(req.user.barangay);
      if (!workerBarangay) {
        return res.status(400).json({ message: 'Assigned barangay not found' });
      }
    }
    // Taguig barangay reference with coordinates
    const taguigBarangayCoords = {
      "Bagumbayan": { coords: [121.045, 14.5208] },
      "Bambang": { coords: [121.038, 14.518] },
      "Fort Bonifacio": { coords: [121.0510, 14.5508] },
      "Central Bicutan": { coords: [121.048, 14.502] },
      "Santa Ana": { coords: [121.072, 14.552] },
      "Ibayo-Tipas": { coords: [121.068, 14.543] },
      "Calzada": { coords: [121.042, 14.516] },
      "Hagonoy": { coords: [121.03, 14.52] },
      "Napindan": { coords: [121.032, 14.522] },
      "San Miguel": { coords: [121.068, 14.55] },
      "Tuktukan": { coords: [121.066, 14.548] },
      "Ususan": { coords: [121.06, 14.53] },
      "Wawa": { coords: [121.068, 14.542] },
      "Ligid-Tipas": { coords: [121.072, 14.538] },
      "Palingon": { coords: [121.064, 14.535] },
      "Lower Bicutan": { coords: [121.048, 14.498] },
      "New Lower Bicutan": { coords: [121.05, 14.5] },
      "Upper Bicutan": { coords: [121.045, 14.505] },
      "Western Bicutan": { coords: [121.042, 14.502] },
      "Central Signal Village": { coords: [121.052, 14.515] },
      "North Signal Village": { coords: [121.054, 14.518] },
      "South Signal Village": { coords: [121.052, 14.512] },
      "Katuparan": { coords: [121.058, 14.518] },
      "Maharlika Village": { coords: [121.062, 14.522] },
      "Pinagsama": { coords: [121.038, 14.512] },
      "North Daang Hari": { coords: [121.038, 14.5] },
      "South Daang Hari": { coords: [121.036, 14.498] },
      "Tanyag": { coords: [121.042, 14.5] }
    };
    for (const data of parsedRows) {
      let barangayDoc;
      if (req.user.role === 'admin') {
        // Case-insensitive, trim, capitalize first letter of each word
        let rawName = (data.barangay || '').trim();
        let formattedName = rawName
          .toLowerCase()
          .split(' ')
          .filter(Boolean)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        let key = formattedName.toLowerCase();
        // Always use canonical barangay if exists
        if (barangayCache[key]) {
          barangayDoc = barangayCache[key];
        } else {
          // Create new barangay if not exist, with location if available
          let location = undefined;
          if (taguigBarangayCoords[formattedName]) {
            location = {
              type: 'Point',
              coordinates: taguigBarangayCoords[formattedName].coords
            };
          }
          barangayDoc = new Barangay({ name: formattedName, ...(location && { location }) });
          await barangayDoc.save();
          barangayCache[key] = barangayDoc;
        }
      } else if (req.user.role === 'worker') {
        // Ignore CSV value, use assigned barangay
        barangayDoc = workerBarangay;
      }
      // Convert string booleans for accessToServices
      const accessToServices = {
        water: data.water === 'true',
        electricity: data.electricity === 'true',
        sanitation: data.sanitation === 'true'
      };
      // Prepare household data
      const householdData = {
        barangay: barangayDoc._id,
        householdHead: data.householdHead,
        address: data.address,
        familyIncome: Number(data.familyIncome),
        employmentStatus: data.employmentStatus,
        educationLevel: data.educationLevel,
        housingType: data.housingType,
        accessToServices,
        governmentAssistance: data.governmentAssistance ? data.governmentAssistance.split(',') : []
      };
        // Duplicate check: same householdHead, barangay, and address (not deleted)
        const existing = await Household.findOne({
          householdHead: householdData.householdHead,
          barangay: householdData.barangay,
          address: householdData.address,
          deleted: false
        });
        if (existing) {
          // Skip duplicate
          continue;
        }
      const { povertyScore, riskLevel } = Household.calculatePovertyScore(householdData);
      const household = new Household({
        ...householdData,
        povertyScore,
        riskLevel
      });
      await household.save();
      await household.populate('barangay');
      savedHouseholds.push(household);
    }
    res.status(201).json({ message: `${savedHouseholds.length} households uploaded`, households: savedHouseholds });
  } catch (error) {
    res.status(400).json({ message: 'CSV upload failed', error: error.message });
  }
};


exports.getHouseholds = async (req, res) => {
  try {
    let households;
    if (req.user.role === 'admin' || req.user.role === 'ngo_staff') {
      // Admin and NGO staff: see all households
      households = await Household.find({ deleted: false }).populate('barangay');
    } else if (req.user.role === 'worker') {
      // Worker: see only households from their assigned barangay
      if (!req.user.barangay) {
        return res.status(400).json({ message: 'Worker account has no assigned barangay' });
      }
      households = await Household.find({ deleted: false, barangay: req.user.barangay }).populate('barangay');
    } else {
      // Other roles: restrict
      return res.status(403).json({ message: 'Access restricted' });
    }
    return res.status(200).json(households);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get household by ID (with barangay info)
exports.getHouseholdById = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Access restricted to admins and workers' });
    }
    const household = await Household.findOne({ _id: req.params.id, deleted: false }).populate('barangay');
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }
    res.status(200).json(household);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new household
exports.createHousehold = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Access restricted to admins and workers' });
    }
    // Validate householdHead
    if (!req.body.householdHead) {
      return res.status(400).json({ message: 'householdHead is required' });
    }
    // Convert barangay name or ObjectId to ObjectId
    let barangayDoc = null;
    if (req.body.barangay.length === 24) {
      barangayDoc = await Barangay.findById(req.body.barangay);
    } else {
      barangayDoc = await Barangay.findOne({ name: req.body.barangay });
    }
    if (!barangayDoc) return res.status(400).json({ message: 'Barangay not found' });

    const existing = await Household.findOne({
      householdHead: req.body.householdHead,
      barangay: barangayDoc._id,
      address: req.body.address,
      deleted: false
    });
    if (existing) {
      return res.status(400).json({ message: 'Household with the same head, barangay, and address already exists' });
    }

    const householdData = { ...req.body, barangay: barangayDoc._id };
    const { povertyScore, riskLevel } = Household.calculatePovertyScore(householdData);
    const household = new Household({ ...householdData, povertyScore, riskLevel });
    await household.save();
    await household.populate('barangay');
    res.status(201).json(household);
  } catch (error) {
    res.status(400).json({ message: 'Create household error', error: error.message });
  }
};

// Update a household
exports.updateHousehold = async (req, res) => { 
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Access restricted to admins and workers' });
    }
    // Validate householdHead
    if (!req.body.householdHead) {
      return res.status(400).json({ message: 'householdHead is required' });
    }
    // Convert barangay name or ObjectId to ObjectId
    let barangayDoc = null;
    if (req.body.barangay.length === 24) {
      barangayDoc = await Barangay.findById(req.body.barangay);
    } else {
      barangayDoc = await Barangay.findOne({ name: req.body.barangay });
    }
    if (!barangayDoc) return res.status(400).json({ message: 'Barangay not found' });

    const householdData = { ...req.body, barangay: barangayDoc._id };
    const { povertyScore, riskLevel } = Household.calculatePovertyScore(householdData);

    const household = await Household.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { ...householdData, povertyScore, riskLevel },
      { new: true, runValidators: true }
    ).populate('barangay');

    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }
    res.status(200).json(household);
  } catch (error) {
    res.status(400).json({ message: 'Update household error', error: error.message });
  }
};

// Soft delete a household
exports.softDeleteHousehold = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Access restricted to admins and workers' });
    }
    const household = await Household.findOneAndUpdate(
      { _id: req.params.id, deleted: false },
      { deleted: true },
      { new: true }
    );
    if (!household) {
      return res.status(404).json({ message: 'Household not found' });
    }
    res.status(200).json({ message: 'Household soft deleted', household });
  } catch (error) {
    res.status(500).json({ message: 'Soft delete error', error: error.message });
  }
};

// Get households by risk level
exports.getHouseholdsByRiskLevel = async (req, res) => {
  try {
    const { riskLevel } = req.query;
    if (!['Low', 'Moderate', 'High'].includes(riskLevel)) {
      return res.status(400).json({ message: 'Invalid risk level' });
    }
    let households = await Household.find({ riskLevel, deleted: false }).populate('barangay');
    households = households.map(({ barangay, povertyScore, riskLevel }) => ({
      barangay,
      povertyScore,
      riskLevel,
    }));
    res.status(200).json(households);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.recoverHousehold = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Access restricted to admins and workers' });
    }
    const household = await Household.findOneAndUpdate(
      { _id: req.params.id, deleted: true },
      { deleted: false },
      { new: true }
    );
    if (!household) {
      return res.status(404).json({ message: 'Household not found or not deleted' });
    }
    res.status(200).json({ message: 'Household recovered', household });
  } catch (error) {
    res.status(500).json({ message: 'Recover error', error: error.message });
  }
};
// Export shared middleware for use in routes
exports.authMiddleware = authMiddleware;
