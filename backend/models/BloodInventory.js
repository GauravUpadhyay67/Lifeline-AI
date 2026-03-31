const mongoose = require('mongoose');

const bloodInventorySchema = mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  stock: {
    'A+': { type: Number, default: 0 },
    'A-': { type: Number, default: 0 },
    'B+': { type: Number, default: 0 },
    'B-': { type: Number, default: 0 },
    'O+': { type: Number, default: 0 },
    'O-': { type: Number, default: 0 },
    'AB+': { type: Number, default: 0 },
    'AB-': { type: Number, default: 0 },
  },
  beds: {
    icu: {
      total: { type: Number, default: 20 },
      occupied: { type: Number, default: 0 }
    },
    general: {
      total: { type: Number, default: 100 },
      occupied: { type: Number, default: 0 }
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);
