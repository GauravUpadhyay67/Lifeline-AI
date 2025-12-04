const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  relatedRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EmergencyRequest',
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'info', // info, alert, success
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
