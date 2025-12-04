const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

const path = require('path');
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

const createIndex = async () => {
  await connectDB();
  try {
    console.log('Dropping existing indexes...');
    await User.collection.dropIndexes();
    
    console.log('Creating indexes...');
    await User.createIndexes();
    console.log('Indexes created successfully');
    
    // Verify
    const indexes = await User.listIndexes();
    console.log('Current Indexes:', indexes);

  } catch (error) {
    console.error('Error creating index:', error);
  } finally {
    mongoose.disconnect();
  }
};

createIndex();
