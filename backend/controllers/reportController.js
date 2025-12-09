const Report = require('../models/Report');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// @desc    Analyze image and save report
// @route   POST /api/reports/analyze
// @access  Private
const analyzeAndSaveReport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // 1. Prepare image for ML service
    const imagePath = req.file.path;
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath), {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
    });

    // 2. Call ML Service
    // Assuming ML service is running on port 8000
    const mlResponse = await axios.post('http://127.0.0.1:8000/predict/disease', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    const analysis = mlResponse.data.analysis;

    // 3. Save Report to Database
    // Construct accessible image URL (assuming static file serving is set up)
    const imageUrl = `/uploads/${req.file.filename}`;

    const report = await Report.create({
      user: req.user._id,
      imageUrl,
      analysis,
    });

    res.status(201).json(report);

  } catch (error) {
    console.error('Error in analyzeAndSaveReport:', error.message);
    if (error.response) {
        console.error('ML Service Error Data:', error.response.data);
        console.error('ML Service Error Status:', error.response.status);
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get user reports
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  analyzeAndSaveReport,
  getReports,
};
