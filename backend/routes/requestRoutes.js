const express = require('express');
const router = express.Router();
const { 
    createRequest, 
    acceptRequest, 
    getMyRequests, 
    getNearbyRequests,
    fulfillRequest 
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.put('/:id/accept', protect, acceptRequest);
router.get('/my-requests', protect, getMyRequests);
router.get('/nearby', protect, getNearbyRequests);
router.put('/:id/fulfill', protect, fulfillRequest);

module.exports = router;
