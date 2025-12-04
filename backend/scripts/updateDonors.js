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

const updateDonors = async () => {
  await connectDB();
  try {
    console.log('Updating donors to A+...');
    const res = await User.updateMany({ role: 'donor' }, { $set: { bloodType: 'A+' } });
    console.log(`Updated ${res.modifiedCount} donors.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

updateDonors();
