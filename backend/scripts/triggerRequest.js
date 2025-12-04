const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const createRequest = async () => {
  try {
    // 1. Connect DB to find a hospital
    await mongoose.connect(process.env.MONGO_URI);
    const hospital = await User.findOne({ role: 'hospital' });
    
    if (!hospital) {
        console.error('No hospital found!');
        process.exit(1);
    }
    console.log(`Using Hospital: ${hospital.name} (${hospital.email})`);

    // 2. Login to get token (simulated or direct token gen if I had the secret, but login is safer)
    // Actually, I can just generate a token if I import the util, but let's use the API to be integration-test like.
    // Wait, I don't know the password. I'll just generate a token directly using the util.
    const generateToken = require('../utils/generateToken');
    const token = generateToken(hospital._id);
    
    mongoose.disconnect(); // Done with DB

    // 3. Send Request
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const requestData = {
        bloodType: 'A+',
        unitsRequired: 2,
        urgency: 'High',
        location: {
            lat: 28.655616,
            lng: 77.1883008,
            address: 'Test Hospital Location'
        },
        notes: 'Test Request from Script'
    };

    console.log('Sending Request...');
    const res = await axios.post('http://localhost:5000/api/requests', requestData, config);
    console.log('Request Created:', res.data.success);
    console.log('Donors Notified:', res.data.donorsNotified);

  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

createRequest();
