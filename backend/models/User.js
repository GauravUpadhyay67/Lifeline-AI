const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'donor', 'hospital'],
    default: 'patient',
  },
  // Common Fields
  phone: { type: String },
  address: { type: String },
  
  // Patient/Donor Fields
  bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  
  // Doctor Fields
  specialization: { type: String },
  licenseNumber: { type: String },
  hospitalName: { type: String }, // Also for Hospital role if needed as separate field, or use name
  
  // Donor Fields
  // Donor Fields
  lastDonationDate: { type: Date },
  
  // Real-time & Location Fields
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    },
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  fcmToken: {
    type: String,
  },
}, {
  timestamps: true,
});

userSchema.index({ location: '2dsphere' });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
