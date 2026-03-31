const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const doctors = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Cardiologist',
    hospitalName: 'City Heart Hospital',
    isOnline: true,
    location: { type: 'Point', coordinates: [0, 0] }
  },
  {
    name: 'Dr. James Smith',
    email: 'james.smith@example.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Neurologist',
    hospitalName: 'Central General Hospital',
    isOnline: false,
    location: { type: 'Point', coordinates: [0, 0] }
  },
  {
    name: 'Dr. Emily Davis',
    email: 'emily.davis@example.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Pediatrician',
    hospitalName: 'Kids Care Clinic',
    isOnline: true,
    location: { type: 'Point', coordinates: [0, 0] }
  },
  {
    name: 'Dr. Michael Brown',
    email: 'michael.brown@example.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Orthopedic Surgeon',
    hospitalName: 'Bone & Joint Center',
    isOnline: false,
    location: { type: 'Point', coordinates: [0, 0] }
  },
  {
    name: 'Dr. Linda Wilson',
    email: 'linda.wilson@example.com',
    password: 'password123',
    role: 'doctor',
    specialization: 'Dermatologist',
    hospitalName: 'Skin Health Institute',
    isOnline: true,
    location: { type: 'Point', coordinates: [0, 0] }
  }
];

const importData = async () => {
  try {
    // optional: await User.deleteMany({ role: 'doctor' }); 
    // We won't delete to preserve existing data, just try to add new ones.

    for (const doc of doctors) {
        const exists = await User.findOne({ email: doc.email });
        if (!exists) {
            await User.create(doc);
            console.log(`Created: ${doc.name}`);
        } else {
            console.log(`Skipped (Exists): ${doc.name}`);
        }
    }

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
