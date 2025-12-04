const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const getDonorId = async () => {
  await connectDB();
  try {
    const donor = await User.findOne({ role: 'donor' });
    if (donor) {
        console.log(`DONOR_ID=${donor._id}`);
        console.log(`DONOR_NAME=${donor.name}`);
    } else {
        console.log('No donor found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

getDonorId();
