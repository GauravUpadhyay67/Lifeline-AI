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
    enum: ['patient', 'doctor', 'hospital', 'admin'],
    default: 'patient',
  },

  // --- Verification & Trust ---
  isVerified: {
    type: Boolean,
    default: true, // Patients are auto-verified; doctors/hospitals set to false on register
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin or Hospital who verified
  verificationDocUrl: { type: String }, // Uploaded license/registration document path

  // --- Blood Donor (Feature Flag, not a separate role) ---
  isBloodDonor: {
    type: Boolean,
    default: false,
  },

  // Common Fields
  phone: { type: String },
  address: { type: String },
  profilePic: { type: String },
  
  // Patient Fields
  bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  
  // Doctor Fields
  specialization: { type: String },
  licenseNumber: { type: String },
  hospitalName: { type: String },
  practiceType: {
    type: String,
    enum: ['hospital_affiliated', 'independent_clinic'],
  },
  affiliatedHospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked hospital for affiliated doctors

  // Donor-related Fields (available on any user with isBloodDonor=true)
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

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
