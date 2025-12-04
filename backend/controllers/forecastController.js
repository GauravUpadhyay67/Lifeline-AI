const axios = require('axios');

// @desc    Get blood demand forecast
// @route   GET /api/forecast
// @access  Private (Hospital only)
const getForecast = async (req, res) => {
  try {
    // Call ML Service
    const mlResponse = await axios.get('http://localhost:8000/predict/blood-demand');
    res.json(mlResponse.data);
  } catch (error) {
    console.error('Error fetching forecast:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getForecast,
};
