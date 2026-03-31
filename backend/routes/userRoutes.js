const express = require('express');
const router = express.Router();
const { 
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
  getUserProfile
} = require('../controllers/userController');
const { protect, verifiedOnly, roleCheck } = require('../middleware/authMiddleware');
const { uploadProfilePic } = require('../middleware/uploadMiddleware');

// Public
router.post('/', registerUser);
router.post('/login', authUser);

// Authenticated
router.get('/doctors', protect, getDoctors);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, uploadProfilePic, updateUserProfile);
router.put('/toggle-donor', protect, toggleDonorStatus);

// Admin only
router.get('/pending-verification', protect, roleCheck('admin'), getPendingVerifications);
router.put('/:id/verify', protect, roleCheck('admin'), verifyUser);
router.delete('/:id/reject', protect, roleCheck('admin'), rejectUser);

// Hospital only (for verifying affiliated doctors)
router.get('/affiliated-doctors', protect, roleCheck('hospital'), getAffiliatedDoctors);
router.put('/:id/hospital-verify', protect, roleCheck('hospital'), hospitalVerifyDoctor);
router.delete('/:id/hospital-reject', protect, roleCheck('hospital'), hospitalRejectDoctor);

module.exports = router;
