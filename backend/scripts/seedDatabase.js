/**
 * Seed Database Script
 * Wipes all users and creates: 1 Admin, 3 Hospitals, 5 Doctors, 5 Patients
 * 
 * Usage: node scripts/seedDatabase.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Wipe all users
    const deleted = await User.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing users`);

    // --- 1. Admin ---
    const admin = await User.create({
      name: 'Lifeline Admin',
      email: 'admin.leftline.ai@gmail.com',
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      isVerified: true,
      phone: '+91 9000000001',
      location: { type: 'Point', coordinates: [77.2090, 28.6139] }, // Delhi
    });
    console.log(`👑 Admin created: ${admin.email}`);

    // --- 2. Hospitals (verified) ---
    const hospitals = await User.create([
      {
        name: 'Apollo Hospital Delhi',
        email: 'apollo.delhi@hospital.com',
        password: process.env.HOSPITAL_PASSWORD,
        role: 'hospital',
        isVerified: true,
        phone: '+91 11-26825500',
        address: 'Sarita Vihar, Delhi Mathura Road, New Delhi, 110076',
        licenseNumber: 'HOSP-DL-2024-001',
        location: { type: 'Point', coordinates: [77.2885, 28.5316] },
      },
      {
        name: 'AIIMS New Delhi',
        email: 'aiims.delhi@hospital.com',
        password: process.env.HOSPITAL_PASSWORD,
        role: 'hospital',
        isVerified: true,
        phone: '+91 11-26588500',
        address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi, 110029',
        licenseNumber: 'HOSP-DL-2024-002',
        location: { type: 'Point', coordinates: [77.2088, 28.5672] },
      },
      {
        name: 'Fortis Gurugram',
        email: 'fortis.ggn@hospital.com',
        password: process.env.HOSPITAL_PASSWORD,
        role: 'hospital',
        isVerified: true,
        phone: '+91 124-4962200',
        address: 'Sector 44, Gurugram, Haryana, 122002',
        licenseNumber: 'HOSP-HR-2024-003',
        location: { type: 'Point', coordinates: [77.0688, 28.4556] },
      },
    ]);
    console.log(`🏥 ${hospitals.length} Hospitals created`);

    // --- 3. Doctors ---
    const doctors = await User.create([
      // Verified (affiliated with Apollo)
      {
        name: 'Dr. Anika Sharma',
        email: 'dr.anika@lifeline.com',
        password: process.env.DOCTOR_PASSWORD,
        role: 'doctor',
        isVerified: true,
        phone: '+91 9876500001',
        specialization: 'Cardiology',
        licenseNumber: 'MCI-2020-10234',
        hospitalName: 'Apollo Hospital Delhi',
        practiceType: 'hospital_affiliated',
        affiliatedHospitalId: hospitals[0]._id,
        verifiedBy: hospitals[0]._id,
        location: { type: 'Point', coordinates: [77.2885, 28.5316] },
      },
      // Verified (affiliated with AIIMS)
      {
        name: 'Dr. Rajesh Kumar',
        email: 'dr.rajesh@lifeline.com',
        password: process.env.DOCTOR_PASSWORD,
        role: 'doctor',
        isVerified: true,
        phone: '+91 9876500002',
        specialization: 'Neurology',
        licenseNumber: 'MCI-2019-08451',
        hospitalName: 'AIIMS New Delhi',
        practiceType: 'hospital_affiliated',
        affiliatedHospitalId: hospitals[1]._id,
        verifiedBy: hospitals[1]._id,
        location: { type: 'Point', coordinates: [77.2088, 28.5672] },
      },
      // Verified (independent clinic)
      {
        name: 'Dr. Priya Mehta',
        email: 'dr.priya@lifeline.com',
        password: process.env.DOCTOR_PASSWORD,
        role: 'doctor',
        isVerified: true,
        phone: '+91 9876500003',
        specialization: 'Dermatology',
        licenseNumber: 'MCI-2021-11890',
        hospitalName: 'Mehta Skin Clinic',
        practiceType: 'independent_clinic',
        verifiedBy: admin._id,
        location: { type: 'Point', coordinates: [77.2310, 28.6315] },
      },
      // UNVERIFIED (affiliated with Fortis — pending hospital verification)
      {
        name: 'Dr. Vikram Singh',
        email: 'dr.vikram@lifeline.com',
        password: process.env.DOCTOR_PASSWORD,
        role: 'doctor',
        isVerified: false,
        phone: '+91 9876500004',
        specialization: 'Orthopedics',
        licenseNumber: 'MCI-2023-14567',
        hospitalName: 'Fortis Gurugram',
        practiceType: 'hospital_affiliated',
        affiliatedHospitalId: hospitals[2]._id,
        location: { type: 'Point', coordinates: [77.0688, 28.4556] },
      },
      // UNVERIFIED (independent — pending admin verification)
      {
        name: 'Dr. Neha Gupta',
        email: 'dr.neha@lifeline.com',
        password: process.env.DOCTOR_PASSWORD,
        role: 'doctor',
        isVerified: false,
        phone: '+91 9876500005',
        specialization: 'Pediatrics',
        licenseNumber: 'MCI-2023-15890',
        hospitalName: 'Little Stars Child Clinic',
        practiceType: 'independent_clinic',
        location: { type: 'Point', coordinates: [77.1025, 28.7041] },
      },
    ]);
    console.log(`🩺 ${doctors.length} Doctors created (3 verified, 2 pending)`);

    // --- 4. Patients ---
    const patients = await User.create([
      {
        name: 'Rahul Verma',
        email: 'rahul.verma@gmail.com',
        password: process.env.PATIENT_PASSWORD,
        role: 'patient',
        isVerified: true,
        phone: '+91 9812300001',
        address: '12, Green Park, New Delhi, 110016',
        bloodType: 'O+',
        age: 28,
        gender: 'Male',
        isBloodDonor: true,
        location: { type: 'Point', coordinates: [77.2090, 28.5600] },
      },
      {
        name: 'Sneha Patel',
        email: 'sneha.patel@gmail.com',
        password: process.env.PATIENT_PASSWORD,
        role: 'patient',
        isVerified: true,
        phone: '+91 9812300002',
        address: '45, Vasant Kunj, New Delhi, 110070',
        bloodType: 'A+',
        age: 34,
        gender: 'Female',
        isBloodDonor: false,
        location: { type: 'Point', coordinates: [77.1524, 28.5245] },
      },
      {
        name: 'Amit Tiwari',
        email: 'amit.tiwari@gmail.com',
        password: process.env.PATIENT_PASSWORD,
        role: 'patient',
        isVerified: true,
        phone: '+91 9812300003',
        address: '89, Sector 18, Noida, 201301',
        bloodType: 'B-',
        age: 45,
        gender: 'Male',
        isBloodDonor: true,
        location: { type: 'Point', coordinates: [77.3266, 28.5700] },
      },
      {
        name: 'Kavita Reddy',
        email: 'kavita.reddy@gmail.com',
        password: process.env.PATIENT_PASSWORD,
        role: 'patient',
        isVerified: true,
        phone: '+91 9812300004',
        address: '23, Hauz Khas, New Delhi, 110016',
        bloodType: 'AB+',
        age: 22,
        gender: 'Female',
        isBloodDonor: true,
        location: { type: 'Point', coordinates: [77.2040, 28.5530] },
      },
      {
        name: 'Deepak Joshi',
        email: 'deepak.joshi@gmail.com',
        password: process.env.PATIENT_PASSWORD,
        role: 'patient',
        isVerified: true,
        phone: '+91 9812300005',
        address: '67, Lajpat Nagar, New Delhi, 110024',
        bloodType: 'O-',
        age: 55,
        gender: 'Male',
        isBloodDonor: false,
        location: { type: 'Point', coordinates: [77.2423, 28.5689] },
      },
    ]);
    console.log(`🧑 ${patients.length} Patients created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('─────────────────────────────────────');
    console.log('Admin:     admin.leftline.ai@gmail.com');
    console.log('Hospitals: apollo.delhi@hospital.com / aiims.delhi@hospital.com / fortis.ggn@hospital.com');
    console.log('Doctors:   dr.anika / dr.rajesh / dr.priya / dr.vikram / dr.neha @lifeline.com');
    console.log('Patients:  rahul.verma / sneha.patel / amit.tiwari / kavita.reddy / deepak.joshi @gmail.com');
    console.log('All passwords: use values from .env file');
    console.log('─────────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    process.exit(1);
  }
};

seed();
