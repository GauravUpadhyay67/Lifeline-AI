const Camp = require('../models/Camp');

// @desc    Get all donation camps
// @route   GET /api/camps
// @access  Private
const getCamps = async (req, res) => {
  try {
    let camps = await Camp.find({}).sort({ date: 1 });

    if (camps.length === 0) {
      // Seed some dummy data if no camps exist
      const dummyCamps = [
        {
          name: 'City General Blood Drive',
          location: 'City General Hospital, Main Hall',
          city: 'New York',
          date: new Date(Date.now() + 86400000 * 2), // 2 days from now
          time: '9:00 AM - 5:00 PM',
          organizer: 'Red Cross',
          contact: '555-0123'
        },
        {
          name: 'Community Center Donation Camp',
          location: 'Downtown Community Center',
          city: 'New York',
          date: new Date(Date.now() + 86400000 * 5), // 5 days from now
          time: '10:00 AM - 4:00 PM',
          organizer: 'Rotary Club',
          contact: '555-0456'
        },
        {
          name: 'University Campus Drive',
          location: 'State University, Student Union',
          city: 'New York',
          date: new Date(Date.now() + 86400000 * 10), // 10 days from now
          time: '11:00 AM - 6:00 PM',
          organizer: 'NSS Unit',
          contact: '555-0789'
        }
      ];
      camps = await Camp.insertMany(dummyCamps);
    }

    res.json(camps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCamps,
};
