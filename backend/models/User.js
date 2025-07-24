const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'ngo_staff', 'worker'], 
    default: 'worker'
  },
  deleted: { type: Boolean, default: false }, 
  barangay: { type: mongoose.Schema.Types.ObjectId, ref: 'Barangay' },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

UserSchema.virtual('barangayName').get(function() {
  if (this.barangay && typeof this.barangay === 'object' && this.barangay.name) {
    return this.barangay.name;
  }
  return undefined;
});

module.exports = mongoose.model('User', UserSchema);
