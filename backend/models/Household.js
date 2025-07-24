const mongoose = require('mongoose');

const HouseholdSchema = new mongoose.Schema({
  barangay: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Barangay', 
    required: true 
  },
  householdHead: { type: String, required: true },
  familyIncome: { type: Number, required: true },
  address: { type: String, required: true },
  employmentStatus: { 
    type: String, 
    enum: ['Employed', 'Unemployed', 'Self-Employed'], 
    default: 'Employed' 
  },
  educationLevel: { 
    type: String, 
    enum: ['None', 'Elementary', 'High School', 'College'], 
    default: 'High School' 
  },
  housingType: { 
    type: String, 
    enum: ['Owned', 'Rented', 'Informal Settler'], 
    default: 'Owned' 
  },
  accessToServices: {
    water: { type: Boolean, default: true },
    electricity: { type: Boolean, default: true },
    sanitation: { type: Boolean, default: true }
  },
  governmentAssistance: [{ type: String }],
  povertyScore: { type: Number },
  riskLevel: { type: String, enum: ['Low', 'Moderate', 'High'] },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

HouseholdSchema.statics.calculatePovertyScore = function (data) {
  let score = 0;

  if (data.familyIncome < 5000) score += 40;
  else if (data.familyIncome < 10000) score += 20;

  if (data.employmentStatus === 'Unemployed') score += 20;
  else if (data.employmentStatus === 'Self-Employed') score += 10;

  if (data.educationLevel === 'None') score += 20;
  else if (data.educationLevel === 'Elementary') score += 10;

  if (data.housingType === 'Informal Settler') score += 20;
  else if (data.housingType === 'Rented') score += 10;

  if (!data.accessToServices.water) score += 10;
  if (!data.accessToServices.electricity) score += 10;
  if (!data.accessToServices.sanitation) score += 10;

  if (data.governmentAssistance && data.governmentAssistance.length > 0) score -= 10;

  score = Math.max(0, Math.min(100, score));

  let riskLevel = 'Low';
  if (score >= 60) riskLevel = 'High';
  else if (score >= 30) riskLevel = 'Moderate';

  return { povertyScore: score, riskLevel };
};

module.exports = mongoose.model('Household', HouseholdSchema);
