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

const checkDonors = async () => {
  await connectDB();
  try {
    console.log('--- Checking All Donors ---');
    const donors = await User.find({ role: 'donor' });
    donors.forEach(d => {
        console.log(`ID: ${d._id}, Name: ${d.name}, Blood: ${d.bloodType}, Online: ${d.isOnline}`);
        console.log(`   Location: ${JSON.stringify(d.location)}`);
    });

    console.log('\n--- Testing Geospatial Query ---');
    // Use coordinates from the user's screenshot/previous request if possible, or a known location
    // Based on previous logs: Lat=28.476, Lng=77.511 (approx)
    const testLocation = { lat: 28.47626, lng: 77.51132 }; 
    const radiusInKm = 10;
    const bloodType = 'A+'; // Assuming this is what was requested, or I'll check for any match

    const query = {
        role: 'donor',
        // bloodType: bloodType, // Comment out to check location only first
        isOnline: true,
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [testLocation.lng, testLocation.lat]
                },
                $maxDistance: radiusInKm * 1000
            }
        }
    };

    console.log("Query:", JSON.stringify(query, null, 2));
    const found = await User.find(query);
    console.log(`Found ${found.length} donors in range.`);
    found.forEach(d => console.log(` - Found: ${d.name} (${d.bloodType})`));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

checkDonors();
