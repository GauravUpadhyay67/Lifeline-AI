const asyncHandler = require('express-async-handler');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a new blood donation request
// @route   POST /api/requests
// @access  Private (Hospital)
const createRequest = asyncHandler(async (req, res) => {
  try {
    const { bloodType, unitsRequired, urgency, location, notes } = req.body;

    console.log("Received Request Data:", req.body);

    // 1. Create Request in DB
    const request = await BloodRequest.create({
      hospital: req.user._id,
      bloodType,
      unitsRequired,
      urgency,
      location: {
          type: 'Point',
          coordinates: [location.lng, location.lat], // GeoJSON expects [lng, lat]
          address: location.address
      },
      notes,
      status: 'open',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
    });

    console.log("Request Created:", request._id);

    // 2. Find Nearby Eligible Donors
    // Logic: Online donors, matching blood type, within 10km radius
    const radiusInKm = 10;
    
    console.log(`Searching for donors: BloodType=${bloodType}, Lat=${location.lat}, Lng=${location.lng}, Radius=${radiusInKm}km`);

    // Check if index exists or handle error
    let nearbyDonors = [];
    try {
        const query = {
            isBloodDonor: true,
            isOnline: true,
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [location.lng, location.lat]
                    },
                    $maxDistance: radiusInKm * 1000 // meters
                }
            }
        };

        nearbyDonors = await User.find(query);
        console.log(`Found ${nearbyDonors.length} nearby donors.`);

    } catch (err) {
        console.error("Geospatial query failed:", err.message);
    }

    // 3. Notify Donors via Socket.io
    const io = req.app.get('io');
    if (io && nearbyDonors.length > 0) {
      nearbyDonors.forEach(donor => {
          io.to(donor._id.toString()).emit('new_blood_request', {
              requestId: request._id,
              hospitalName: req.user.name,
              bloodType,
              urgency,
              distance: 'Nearby', // Could calculate precise distance
              location: request.location
          });
          console.log(`Notified donor ${donor.name} (${donor._id})`);

          // Create persistent notification
          Notification.create({
            user: donor._id,
            relatedRequestId: request._id,
            message: `Urgent: ${bloodType} blood needed at ${req.user.name}`,
            type: 'alert'
          }).catch(err => console.error('Error creating notification:', err));
      });
    } else if (!io) {
        console.error("Socket.io instance not found");
    }

    res.status(201).json({
      success: true,
      data: request,
      donorsNotified: nearbyDonors.length
    });
  } catch (error) {
    console.error("Error in createRequest:", error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
});

// @desc    Accept a blood request
// @route   PUT /api/requests/:id/accept
// @access  Private (Donor)
const acceptRequest = asyncHandler(async (req, res) => {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    if (request.status !== 'open') {
        res.status(400);
        throw new Error('Request is no longer open');
    }

    // Update Request
    request.status = 'accepted';
    request.acceptedBy = req.user._id;
    await request.save();

    // Notify Hospital
    const io = req.app.get('io');
    io.to(request.hospital.toString()).emit('request_accepted', {
        requestId: request._id,
        donorName: req.user.name,
        donorPhone: req.user.phone,
        donorLocation: req.user.location
    });

    res.json({ success: true, data: request });
});

// @access  Private (Hospital)
const getMyRequests = asyncHandler(async (req, res) => {
    const requests = await BloodRequest.find({ hospital: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
});

// @desc    Get nearby requests for a donor
// @route   GET /api/requests/nearby
// @access  Private (Donor)
const getNearbyRequests = asyncHandler(async (req, res) => {
    const { lng, lat } = req.query;
    
    if (!lng || !lat) {
        res.status(400);
        throw new Error('Location (lng, lat) is required');
    }

    const requests = await BloodRequest.find({
        status: 'open',

        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: 20000 // 20km search radius for manual pull
            }
        }
    }).populate('hospital', 'name phone address');

    res.json(requests);
});

// @desc    Fulfill a blood request (Hospital)
// @route   PUT /api/requests/:id/fulfill
// @access  Private (Hospital)
const fulfillRequest = asyncHandler(async (req, res) => {
    const request = await BloodRequest.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error('Request not found');
    }

    if (request.hospital.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    request.status = 'fulfilled';
    await request.save();

    res.json({ success: true, data: request });
});

module.exports = {
    createRequest,
    acceptRequest,
    getMyRequests,
    getNearbyRequests,
    fulfillRequest
};
