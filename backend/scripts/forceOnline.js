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

const forceOnline = async () => {
  await connectDB();
  try {
    console.log('Setting all donors to Online...');
    const res = await User.updateMany({ role: 'donor' }, { $set: { isOnline: true } });
    console.log(`Updated ${res.modifiedCount} donors to Online.`);
    
    // Also verify one
    const donor = await User.findOne({ role: 'donor' });
    console.log('Sample Donor:', donor.name, 'Online:', donor.isOnline);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

forceOnline();
