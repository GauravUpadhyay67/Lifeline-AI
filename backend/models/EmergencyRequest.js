const mongoose = require('mongoose');

const emergencyRequestSchema = mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  bloodType: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
  },
  quantity: {
    type: Number,
    required: true,
  },
  urgency: {
    type: String,
    required: true,
    enum: ['Critical', 'High', 'Medium'],
  },
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Fulfilled', 'Cancelled'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
