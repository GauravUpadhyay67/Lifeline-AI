const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isBloodDonor: user.isBloodDonor,
      phone: user.phone,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { 
      name, email, password, role,
      phone, address, bloodType, age, gender,
      specialization, licenseNumber, hospitalName, 
      lastDonationDate, practiceType, isBloodDonor
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Doctors and Hospitals require admin verification
    const needsVerification = (role === 'doctor' || role === 'hospital');

    // Link hospital if doctor is affiliated
    let affiliatedHospitalId = undefined;
    if (role === 'doctor' && practiceType === 'hospital_affiliated' && hospitalName) {
      // Find a verified hospital with this exact name (case insensitive)
      const hospital = await User.findOne({ 
        role: 'hospital', 
        name: new RegExp(`^${hospitalName}$`, 'i'),
        isVerified: true
      });
      if (hospital) {
        affiliatedHospitalId = hospital._id;
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'patient',
      phone,
      address,
      bloodType,
      age,
      gender,
      specialization,
      licenseNumber,
      hospitalName,
      practiceType,
      affiliatedHospitalId,
      lastDonationDate,
      isBloodDonor: isBloodDonor || false,
      isVerified: !needsVerification, // false for doctor/hospital, true for patient
      location: {
          type: 'Point',
          coordinates: [0, 0]
      }
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isBloodDonor: user.isBloodDonor,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Private
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isVerified: true }).select('-password');
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;
        
        if (req.body.age) user.age = Number(req.body.age);
        if (req.body.bloodType) user.bloodType = req.body.bloodType;
        if (req.body.gender) user.gender = req.body.gender;
        
        // Doctor specific fields
        if (req.body.specialization) user.specialization = req.body.specialization;
        if (req.body.hospitalName) user.hospitalName = req.body.hospitalName;
        if (req.body.practiceType) user.practiceType = req.body.practiceType;

        if (req.body.password) {
            user.password = req.body.password;
        }

        if (req.file) {
            user.profilePic = `/${req.file.path.replace(/\\/g, '/')}`;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            profilePic: updatedUser.profilePic,
            isVerified: updatedUser.isVerified,
            isBloodDonor: updatedUser.isBloodDonor,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
      console.error('Profile Update Error:', error);
      res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle blood donor status
// @route   PUT /api/users/toggle-donor
// @access  Private
const toggleDonorStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBloodDonor = !user.isBloodDonor;
    
    // If enabling, optionally set blood type from request
    if (user.isBloodDonor && req.body.bloodType) {
      user.bloodType = req.body.bloodType;
    }

    await user.save();

    res.json({
      _id: user._id,
      isBloodDonor: user.isBloodDonor,
      bloodType: user.bloodType,
      message: user.isBloodDonor 
        ? 'You are now registered as a blood donor! You will receive emergency notifications.' 
        : 'Blood donor status deactivated.'
    });
  } catch (error) {
    console.error('Toggle Donor Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unverified doctors/hospitals (Admin)
// @route   GET /api/users/pending-verification
// @access  Private/Admin
const getPendingVerifications = async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      isVerified: false, 
      role: { $in: ['doctor', 'hospital'] } 
    }).select('-password').sort({ createdAt: -1 });
    
    res.json(pendingUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Verify a doctor/hospital (Admin)
// @route   PUT /api/users/:id/verify
// @access  Private/Admin
const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ 
      message: `${user.role === 'doctor' ? 'Dr. ' : ''}${user.name} has been verified successfully.`,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        isVerified: user.isVerified,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reject (delete) a doctor/hospital verification (Admin)
// @route   DELETE /api/users/:id/reject
// @access  Private/Admin
const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: `${user.name}'s registration has been rejected and removed.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get pending doctors affiliated with the logged-in hospital
// @route   GET /api/users/affiliated-doctors
// @access  Private/Hospital
const getAffiliatedDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: 'doctor',
      affiliatedHospitalId: req.user._id
    }).select('-password').sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Verify an affiliated doctor (Hospital)
// @route   PUT /api/users/:id/hospital-verify
// @access  Private/Hospital
const hospitalVerifyDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({ 
      _id: req.params.id, 
      role: 'doctor', 
      affiliatedHospitalId: req.user._id 
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found or not affiliated with your hospital.' });
    }

    doctor.isVerified = true;
    doctor.verifiedBy = req.user._id;
    await doctor.save();

    res.json({ message: `Dr. ${doctor.name} has been verified.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reject an affiliated doctor (Hospital)
// @route   DELETE /api/users/:id/hospital-reject
// @access  Private/Hospital
const hospitalRejectDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({ 
      _id: req.params.id, 
      role: 'doctor', 
      affiliatedHospitalId: req.user._id 
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found or not affiliated with your hospital.' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: `Dr. ${doctor.name}'s registration request has been rejected.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { 
  authUser, 
  registerUser, 
  getDoctors, 
  updateUserProfile, 
  toggleDonorStatus,
  getPendingVerifications,
  verifyUser,
  rejectUser,
  getAffiliatedDoctors,
  hospitalVerifyDoctor,
  hospitalRejectDoctor,
  getUserProfile,
};
