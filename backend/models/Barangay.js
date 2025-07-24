const mongoose = require('mongoose');

const BarangaySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }, // [longitude, latitude]
  }
});

module.exports = mongoose.model('Barangay', BarangaySchema);
