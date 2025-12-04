const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

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

const fs = require('fs');

const getToken = async () => {
  await connectDB();
  try {
    const hospital = await User.findOne({ role: 'hospital' });
    if (hospital) {
        console.log(`HOSPITAL_ID=${hospital._id}`);
        const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        console.log(`TOKEN generated`);
        fs.writeFileSync('token.txt', token);
    } else {
        console.log('No hospital found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

getToken();
