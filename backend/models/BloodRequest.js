const mongoose = require('mongoose');

const bloodRequestSchema = mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  unitsRequired: {
    type: Number,
    required: true,
  },
  urgency: {
    type: String,
    enum: ['routine', 'urgent', 'critical', 'high', 'medium', 'low'],
    default: 'routine',
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
    address: { type: String },
  },
  status: {
    type: String,
    enum: ['open', 'accepted', 'fulfilled', 'cancelled', 'expired'],
    default: 'open',
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notes: {
    type: String,
  },
  expiresAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

bloodRequestSchema.index({ location: '2dsphere' });

const BloodRequest = mongoose.model('BloodRequest', bloodRequestSchema);

module.exports = BloodRequest;
